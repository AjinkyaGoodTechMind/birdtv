import React, { useRef, useState } from "react";
import axios from "axios";
import ReactPlayer from "react-player";
import { useEffect } from "react";
import Navbar from "../../../components/Navbar/Navbar";
import Sidebar from "../../../components/Sidebar/Sidebar";

import { Link, useLocation, useNavigate } from "react-router-dom";

import { useSelector } from "react-redux";
import { Box, Modal } from "@mui/material";

export default function ViewMrss() {
  const location = useLocation();

  const playlist = location.state[0];

  console.log(playlist);
  const navigate = useNavigate();
  const { currentDomain } = useSelector((state) => state.sessionSlice);

  const [title, setTitle] = useState(playlist.title);

  const [videoArray, setVideoArray] = useState([]);

  const [playingVideo, setPlayingVideo] = useState("");

  const [openVideo, setOpenVideo] = useState(false);

  const handleOpenVideo = () => {
    setOpenVideo(true);
  };

  const handleCloseVideo = () => {
    setOpenVideo(false);
  };

  const getVideos = async () => {
    await axios.post(`/api/playlist/getPlaylistById`, { playlistId: playlist._id }).then((res) => {
      let url = res.data[0].mrss;

      const fetchFeed = async () => {
        try {
          await axios.get(url).then(({ data }) => {
            const extractUrls = () => {
              try {
                const parser = new DOMParser();
                const xmlDoc = parser.parseFromString(data, "text/xml");
                const mediaContentElements = xmlDoc.getElementsByTagName("media:content");
                const extractedData = [];

                for (let i = 0; i < mediaContentElements.length; i++) {
                  const file = mediaContentElements[i].getAttribute("url");

                  const titleElement = mediaContentElements[i].parentNode.getElementsByTagName("title")[0];
                  const title = titleElement ? titleElement.textContent : "";

                  extractedData.push({ file, title });
                }

                return extractedData;
              } catch (error) {
                console.error(error);
              }
            };

            const extractedVideos = extractUrls();

            setVideoArray(extractedVideos);
          });
        } catch (error) {
          console.log(error);
        }
      };

      fetchFeed();
    });
  };

  useEffect(() => {
    getVideos();
  }, [playlist]);

  const style4 = {
    display: "flex",
    justifyContent: "center",
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    border: "none",
  };

  const playVideo = (file) => {
    setPlayingVideo(file);

    setOpenVideo(true);
  };

  return (
    <div className="addPlayer">
      <Navbar />
      <div className="addPlayer-main">
        <Sidebar />
        <div className="addContentUnit-main-container">
          <div style={{ display: "flex", flexDirection: "column", width: "80%", height: "700px", alignItems: "center" }}>
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
                      width: "100px",
                      border: "1px solid gray",
                      padding: "10px",
                      borderRadius: "10px",
                      overflow: "hidden",
                      margin: "10px",
                      cursor: "pointer",
                    }}
                  >
                    <video
                      className="thumbnailVideoPage"
                      src={e.file}
                      controls={false}
                      disablePictureInPicture
                      onClick={() => playVideo(e.file)}
                      style={{ width: "100%", height: "100%" }}
                    ></video>
                    <span>{e.title}</span>
                  </div>
                );
              })}
            </div>

            <Box sx={{ display: "flex", flexDirection: "row", pt: 2 }}>
              <Link
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
                to="/mrss"
              >
                Back
              </Link>
            </Box>
          </div>
        </div>
      </div>
      <Modal open={openVideo} onClose={handleCloseVideo} aria-labelledby="parent-modal-title" aria-describedby="modal-modal-description">
        <Box sx={style4}>
          <ReactPlayer url={playingVideo} controls={true} />
        </Box>
      </Modal>
    </div>
  );
}
