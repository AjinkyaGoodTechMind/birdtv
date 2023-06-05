import React, { useEffect, useState } from "react";
import "./Players.css";
import Navbar from "../../../components/Navbar/Navbar";
import Sidebar from "../../../components/Sidebar/Sidebar";
import playIcon from "../../../assets/play-button-icon.png";
import BorderColorIcon from "@mui/icons-material/BorderColor";
import AssessmentIcon from "@mui/icons-material/Assessment";
import DeleteIcon from "@mui/icons-material/Delete";
import { Link } from "react-router-dom";
import axios from "axios";
import { useSelector } from "react-redux";
import { Box, Modal } from "@mui/material";
import ReactPlayer from "react-player";
import ReactJWPlayer from "react-jw-player";
import testVideo from "../../../assets/testVideo2.mp4";

export default function Players() {
  const [players, setPlayers] = useState([]);
  const { currentDomain } = useSelector((state) => state.sessionSlice);
  const [currentPlayer, setCurrentPlayer] = useState({});
  const [playingVideo, setPlayingVideo] = useState(testVideo);

  const [openVideo, setOpenVideo] = useState(false);

  const handleOpenVideo = () => {
    setOpenVideo(true);
  };

  const handleCloseVideo = () => {
    setOpenVideo(false);
  };

  // const getPlayers = async () => {
  //   await axios
  //     .get(`http://64.227.170.236/player/get/post/api/`)
  //     .then(({ data }) => {
  //       setPlayers(data);
  //     })
  //     .catch((err) => {
  //       console.log(err);
  //     });
  // };

  const getPlayers = async () => {
    await axios
      .get(`/api/player/getPlayers?domain=${currentDomain._id}`)
      .then(({ data }) => {
        setPlayers(data);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  useEffect(() => {
    getPlayers();
  }, [currentDomain]);

  // const handleDelete = async (id) => {
  //   await axios
  //     .delete(`http://64.227.170.236/player/update/delete/api/${id}/`)
  //     .then((res) => {
  //       getPlayers();
  //     })
  //     .catch((err) => {
  //       console.log(err);
  //     });
  // };

  const handleDelete = async (id) => {
    await axios
      .put(`/api/player/deletePlayer`, { playerId: id })
      .then((res) => {
        getPlayers();
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const style4 = {
    display: "flex",
    justifyContent: "center",
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    border: "none",
  };

  const playVideo = (id) => {
    let newCurrentPlayer = players.filter((e) => e._id.toString() === id.toString());
    setCurrentPlayer(newCurrentPlayer[0]);
    setOpenVideo(true);
  };

  return (
    <div className="palyers">
      <Navbar />
      <div className="palyers-main">
        <Sidebar />
        <div className="palyers-main-container">
          <Link to="/addPlayer" className="newPlayerButton">
            Add New Player
          </Link>
          <div className="programsContainer">
            {players.map((e, index) => {
              return (
                <div className="programsBox" key={index}>
                  <img className="playIcon" style={{ cursor: "pointer" }} src={playIcon} alt="" onClick={() => playVideo(e._id)}></img>
                  <div className="programsBox-main">
                    <div className="programsBox-title-div">
                      <span className="programsBox-title">{e.playerName}</span>
                      <div className="programsBox-button-div">
                        <Link className="programsBox-button" to="/editPlayer" state={players.filter((p) => p._id.toString() === e._id.toString())}>
                          Edit
                        </Link>
                      </div>
                    </div>
                    <div style={{ margin: "5px 0px", display: "flex", alignItems: "center" }}>
                      <span>Player Id: {e._id}</span>
                    </div>

                    <span className="programBox-details">
                      {/* <Link to="/dashboard" className="link">
                        <li className="sidebarListItem active">
                          <BorderColorIcon className="sidebarIcon" />
                        </li>
                      </Link>
                      <Link to="/pendingApprovalsAdmin" className="link">
                        <li className="sidebarListItem">
                          <AssessmentIcon className="sidebarIcon" />
                        </li>
                      </Link> */}

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

      <Modal open={openVideo} onClose={handleCloseVideo} aria-labelledby="parent-modal-title" aria-describedby="modal-modal-description">
        <Box sx={style4}>
          <ReactPlayer
            url={testVideo}
            controls={true}
            width={currentPlayer?.generalSettings?.playerSize?.width}
            height={currentPlayer?.generalSettings?.playerSize?.height}
          />
        </Box>
      </Modal>
    </div>
  );
}
