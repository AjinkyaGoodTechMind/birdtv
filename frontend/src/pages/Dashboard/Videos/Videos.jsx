import React from "react";
import "./videos.css";
import Navbar from "../../../components/Navbar/Navbar";
import Sidebar from "../../../components/Sidebar/Sidebar";
import playIcon from "../../../assets/play-button-icon.png";
import BorderColorIcon from "@mui/icons-material/BorderColor";
import AssessmentIcon from "@mui/icons-material/Assessment";
import { Link } from "react-router-dom";
import { useState } from "react";
import axios from "axios";
import { useEffect } from "react";
import moment from "moment";
import DeleteIcon from "@mui/icons-material/Delete";
import { Box, Modal } from "@mui/material";
import ReactPlayer from "react-player";
import { useSelector } from "react-redux";

export default function Videos() {
  const { currentDomain } = useSelector((state) => state.sessionSlice);
  const [videos, setVideos] = useState([]);

  const [playingVideo, setPlayingVideo] = useState("");

  const [openVideo, setOpenVideo] = useState(false);

  const handleOpenVideo = () => {
    setOpenVideo(true);
  };

  const handleCloseVideo = () => {
    setOpenVideo(false);
  };

  // const getPlayers = async () => {
  //   await axios
  //     .get(`http://64.227.170.236/video/list`)
  //     .then(({ data }) => {
  //       setVideos(data);
  //     })
  //     .catch((err) => {
  //       console.log(err);
  //     });
  // };

  const getPlayers = async () => {
    await axios
      .get(`/api/video/getVideos?domain=${currentDomain._id}`)
      .then(({ data }) => {
        setVideos(data);
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
  //     .delete(`http://64.227.170.236/video/${id}/`)
  //     .then((res) => {
  //       getPlayers();
  //     })
  //     .catch((err) => {
  //       console.log(err);
  //     });
  // };

  const handleDelete = async (id) => {
    await axios
      .put(`/api/video/deleteVideo`, { videoId: id })
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
    console.log(id);
    let currentVideo = videos.filter((e) => e._id.toString() === id.toString());
    console.log(currentVideo);
    setPlayingVideo(currentVideo[0]);
    setOpenVideo(true);
  };

  return (
    <div className="palyers">
      <Navbar />
      <div className="palyers-main">
        <Sidebar />
        <div className="palyers-main-container">
          <Link to="/addVideos" className="newPlayerButton">
            Add Video
          </Link>
          <div className="programsContainer">
            {videos?.map((e, index) => {
              return (
                <div className="programsBox" key={index}>
                  {/* <img className="playIcon" style={{ cursor: "pointer" }} src={playIcon} alt="" onClick={() => playVideo(e._id)}></img> */}
                  <video
                    className="thumbnailVideoPage"
                    src={e.file}
                    controls={false}
                    disablePictureInPicture
                    onClick={() => playVideo(e._id)}
                    style={{ marginRight: "20px", cursor: "pointer" }}
                  ></video>
                  <div className="programsBox-main">
                    <div className="programsBox-title-div">
                      <span className="programsBox-title">{e.title}</span>
                      <div className="programsBox-button-div">
                        <span className="duration">Duration: 00:00</span>
                        <span className="duration">Publish Date: {moment(e.createdAt).format("DD/MM/YYYY ")}</span>
                        {/* <span className="programsBox-button">Edit</span> */}
                      </div>
                    </div>
                    <div style={{ margin: "5px 0px", display: "flex", alignItems: "center" }}>
                      <span>Video Id: {e._id}</span>
                    </div>

                    <span className="programBox-details">
                      {/* <Link to="/dashboard" className="link">
                        <li className="sidebarListItem active">
                          <BorderColorIcon className="sidebarIcon" />
                        </li>
                      </Link> */}
                      {/* <Link to="/pendingApprovalsAdmin" className="link">
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
          <ReactPlayer url={playingVideo.file} controls={true} />
        </Box>
      </Modal>
    </div>
  );
}
