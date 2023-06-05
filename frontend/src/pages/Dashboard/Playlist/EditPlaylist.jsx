import React, { useRef, useState } from "react";
import axios from "axios";
import ReactPlayer from "react-player";
import { useEffect } from "react";
import Navbar from "../../../components/Navbar/Navbar";
import Sidebar from "../../../components/Sidebar/Sidebar";
import { Box, Button, Modal, Step, StepLabel, Stepper, Typography } from "@mui/material";
import { useLocation, useNavigate } from "react-router-dom";

import { useSelector } from "react-redux";

export default function EditPlaylist() {
  const location = useLocation();

  const playlist = location.state[0];

  console.log(playlist);
  const navigate = useNavigate();
  const { currentDomain } = useSelector((state) => state.sessionSlice);

  const [title, setTitle] = useState(playlist.title);

  const [videoArray, setVideoArray] = useState([]);

  const [selectedVideos, setSelectedVideos] = useState([]);

  const [playingVideo, setPlayingVideo] = useState("");

  const [openVideo, setOpenVideo] = useState(false);

  const handleOpenVideo = () => {
    setOpenVideo(true);
  };

  const handleCloseVideo = () => {
    setOpenVideo(false);
  };

  const handleFinish = async () => {
    let config = {
      method: "put",
      maxBodyLength: Infinity,
      url: "/api/playlist/updatePlaylist",
      data: { title: title, videos: selectedVideos, domain: currentDomain._id, playlistId: playlist._id },
    };

    await axios
      .request(config)
      .then((res) => {
        console.log(res);
        navigate("/playlists");
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const getVideos = async () => {
    await axios
      .get(`/api/video/getVideos?domain=${currentDomain._id}`)
      .then(async ({ data }) => {
        setVideoArray(data);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  useEffect(() => {
    getVideos();
  }, []);

  useEffect(() => {
    const ids = playlist.videos.map((e) => {
      return e._id;
    });

    setSelectedVideos(ids);
  }, [playlist]);

  console.log(selectedVideos);

  const handleSelect = (id) => {
    let exist = selectedVideos.filter((e) => e.toString() === id.toString());

    if (exist.length) {
      let newArray = selectedVideos.filter((e) => e.toString() !== id.toString());
      setSelectedVideos([...newArray]);
    } else {
      setSelectedVideos((prev) => [...prev, id]);
    }
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
    let currentVideo = videoArray.filter((e) => e._id.toString() === id.toString());
    console.log(currentVideo);
    setPlayingVideo(currentVideo[0]);
    setOpenVideo(true);
  };

  return (
    <div className="addPlayer">
      <Navbar />
      <div className="addPlayer-main">
        <Sidebar />
        <div className="addContentUnit-main-container">
          <span className="title">Create Playlist</span>

          <div style={{ display: "flex", flexDirection: "column", width: "80%", height: "700px", alignItems: "center" }}>
            <div style={{ marginTop: "20px", display: "flex", width: "100%", alignItems: "center" }}>
              <Typography sx={{ mr: 5, mb: 1 }}>Playlist Name</Typography>
              <input
                style={{ width: "300px", height: "20px", padding: "10px", borderRadius: "10px", border: "1px solid gray" }}
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>

            <div
              style={{
                marginTop: "20px",
                display: "flex",
                width: "100%",
                height: "550px",
                flexWrap: "wrap",
                justifyContent: "space-between",
                overflowY: "scroll",
                padding: "20px",
                borderRadius: "10px",
                border: "1px solid black",
              }}
            >
              {videoArray.map((e, index) => {
                return (
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      height: "200px",
                      border: "1px solid gray",
                      padding: "10px",
                      borderRadius: "10px",
                    }}
                  >
                    <input type="checkbox" checked={selectedVideos.includes(e._id)} onChange={() => handleSelect(e._id)}></input>
                    {/* <img style={{ height: "60px", width: "60px" }} src={e.thumbnailUrl} alt={e.title} /> */}
                    <video
                      className="thumbnailVideoPage"
                      src={e.file}
                      controls={false}
                      disablePictureInPicture
                      onClick={() => playVideo(e._id)}
                      style={{ marginTop: "20px" }}
                    ></video>
                    <h2>{e.title}</h2>
                  </div>
                );
              })}
            </div>

            <Box sx={{ display: "flex", flexDirection: "row", pt: 2 }}>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  width: "150px",
                  height: "50px",
                  backgroundColor: "red",
                  borderRadius: "10px",
                  color: "white",
                  cursor: "pointer",
                }}
                onClick={handleFinish}
              >
                Save
              </div>
            </Box>
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
