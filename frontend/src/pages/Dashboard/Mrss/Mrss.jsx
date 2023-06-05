import React from "react";

import Navbar from "../../../components/Navbar/Navbar";
import Sidebar from "../../../components/Sidebar/Sidebar";
import playIcon from "../../../assets/play-button-icon.png";

import { Link } from "react-router-dom";
import { useState } from "react";
import axios from "axios";
import { useEffect } from "react";
import moment from "moment";
import DeleteIcon from "@mui/icons-material/Delete";
import { useSelector } from "react-redux";
import XMLParser from "react-xml-parser";
import { Box, Modal } from "@mui/material";

export default function Mrss() {
  const [videos, setVideos] = useState([]);
  const { currentDomain } = useSelector((state) => state.sessionSlice);

  const [input, setInput] = useState("");

  const [name, setName] = useState("");

  const [openMrss, setOpenMrss] = useState(false);

  const handleOpenMrss = () => {
    setOpenMrss(true);
  };

  const handleCloseMrss = () => {
    setOpenMrss(false);
  };

  console.log(videos);

  const style4 = {
    display: "flex",
    justifyContent: "center",
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    border: "none",
  };

  const getPlayers = async () => {
    await axios
      .get(`/api/playlist/getPlaylists?domain=${currentDomain._id}`)
      .then(({ data }) => {
        let newData = data.filter((e) => e.mrss);
        setVideos(newData);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  useEffect(() => {
    getPlayers();
  }, [currentDomain]);

  const saveMrss = async () => {
    let config = {
      method: "post",
      maxBodyLength: Infinity,
      url: "/api/playlist/postPlaylist",
      data: { title: name, mrss: input, domain: currentDomain._id },
    };

    await axios
      .request(config)
      .then((res) => {
        setOpenMrss(false);
        setInput("");
        setName("");
        getPlayers();
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const handleDelete = async (id) => {
    await axios
      .put(`/api/playlist/deletePlaylist`, { playlistId: id })
      .then((res) => {
        getPlayers();
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <div className="palyers">
      <Navbar />
      <div className="palyers-main">
        <Sidebar />
        <div className="palyers-main-container">
          <span className="newPlayerButton" onClick={handleOpenMrss}>
            Add Mrss Feed
          </span>
          <div className="programsContainer">
            {videos?.map((e, index) => {
              return (
                <div className="programsBox" key={index}>
                  <img className="playIcon" src={playIcon} alt=""></img>
                  <div className="programsBox-main">
                    <div className="programsBox-title-div">
                      <span className="programsBox-title">{e.title}</span>
                      <div className="programsBox-button-div">
                        <Link className="programsBox-button" to="/viewMrss" state={videos.filter((p) => p._id.toString() === e._id.toString())}>
                          View
                        </Link>
                      </div>
                    </div>
                    <div style={{ margin: "5px 0px", display: "flex", alignItems: "center" }}>
                      <span>Playlist Id: {e._id}</span>
                    </div>

                    <span className="programBox-details">
                      <li className="sidebarListItem" onClick={() => handleDelete(e._id)}>
                        <DeleteIcon className="sidebarIcon" />
                      </li>
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
      <Modal open={openMrss} onClose={handleCloseMrss} aria-labelledby="parent-modal-title" aria-describedby="modal-modal-description">
        <Box sx={style4}>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              height: "300px",
              width: "400px",
              backgroundColor: "white",
              borderRadius: "20px",
              padding: "20px",
              justifyContent: "space-between",
            }}
          >
            <input
              style={{ padding: "10px", width: "80%", borderRadius: "10px" }}
              type="text"
              value={name}
              placeholder="Title"
              onChange={(e) => setName(e.target.value)}
            ></input>
            <input
              style={{ padding: "10px", width: "80%", borderRadius: "10px" }}
              type="text"
              value={input}
              placeholder="MRSS Feed URL"
              onChange={(e) => setInput(e.target.value)}
            ></input>

            <span className="newPlayerButton" onClick={saveMrss}>
              Save
            </span>
          </div>
        </Box>
      </Modal>
    </div>
  );
}
