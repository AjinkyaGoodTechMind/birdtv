import React, { useEffect, useState } from "react";
import "./ContentUnits.css";
import Navbar from "../../../components/Navbar/Navbar";
import Sidebar from "../../../components/Sidebar/Sidebar";
import playIcon from "../../../assets/play-button-icon.png";
import BorderColorIcon from "@mui/icons-material/BorderColor";
import AssessmentIcon from "@mui/icons-material/Assessment";
import { Link } from "react-router-dom";
import axios from "axios";
import { Modal, Typography } from "@mui/material";
import { Box } from "@mui/system";
import DeleteIcon from "@mui/icons-material/Delete";
import { useSelector } from "react-redux";
import ReactPlayer from "react-player";
const jsFile = "main.e746603b.js";

export default function ContentUnits() {
  const { currentDomain } = useSelector((state) => state.sessionSlice);
  const [contentUnits, setContentUnits] = useState([]);
  const [playerId, setPlayerId] = useState("");
  const [playlistId, setPlaylistId] = useState("");
  const [contentUnit, setContentUnit] = useState("");
  const [open, setOpen] = useState(false);

  const [isJs, setIsJs] = useState(true);

  const [embedCode, setEmbedCode] = useState(
    `<!DOCTYPE html>
    <html lang="en">
   
      <script
        defer="defer"
        src="https://birdtv.onrender.com/public/videoplayer/${jsFile}"
        playerId="${playerId}" 
        playlistId="${playlistId}"
        contentUnitId="${contentUnit}"
      ></script>
    
      <body>
 
          <div id="videoplayer"></div>
      
      </body>
    </html>
    `
  );

  const [embedCodeJs, setEmbedCodeJs] = useState(
    `
      <script
        defer="defer"
        src="https://birdtv.onrender.com/public/videoplayer/${jsFile}"
        playerId="${playerId}" 
        playlistId="${playlistId}"
        contentUnitId="${contentUnit}"
      ></script>
      <div id="videoplayer"></div>
  
    `
  );

  // const [embedCode2, setEmbedCode2] = useState(`<div id="root"></div>`);

  useEffect(() => {
    setEmbedCode(
      `<!DOCTYPE html>
    <html lang="en">
   
      <script
        defer="defer"
        src="http://52.91.168.25/public/videoplayer/${jsFile}"
        playerId="${playerId}" 
        playlistId="${playlistId}"
        contentUnitId="${contentUnit}"
      ></script>
    
      <body>
 
          <div id="videoplayer"></div>
      
      </body>
    </html>
    `
    );

    setEmbedCodeJs(
      `
      <script
      defer="defer"
      src="http://52.91.168.25/public/videoplayer/${jsFile}"
      playerId="${playerId}" 
      playlistId="${playlistId}"
      contentUnitId="${contentUnit}"
    ></script>
    <div id="videoplayer"></div>
      `
    );
  }, [playlistId, playerId]);

  const handleOpen = (unitId) => {
    let unit = contentUnits.filter((e) => e._id === unitId);
    setPlayerId(unit[0].player._id);
    setPlaylistId(unit[0].playlist._id);
    console.log(unit[0]._id);
    setContentUnit(unit[0]._id);
    setOpen(true);
  };

  const handleClose = () => setOpen(false);

  const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 600,
    backgroundColor: "white",
    padding: 40,
    border: "none",
    borderRadius: 10,
    boxShadow: 24,
    p: 4,
  };

  // const getContentUnits = async () => {
  //   await axios
  //     .get(`http://64.227.170.236/content/unit/list/create/`)
  //     .then(({ data }) => {
  //       setContentUnits(data);
  //     })
  //     .catch((err) => {
  //       console.log(err);
  //     });
  // };

  const getContentUnits = async () => {
    await axios
      .get(`/api/contentUnit/getConentUnits?domain=${currentDomain._id}`)
      .then(({ data }) => {
        setContentUnits(data);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  useEffect(() => {
    getContentUnits();
  }, [currentDomain]);

  // const handleDelete = async (id) => {
  //   await axios
  //     .delete(`http://64.227.170.236/content/unit/update/delete/api/${id}/`)
  //     .then((res) => {
  //       getContentUnits();
  //     })
  //     .catch((err) => {
  //       console.log(err);
  //     });
  // };

  const handleDelete = async (id) => {
    await axios
      .put(`/api/contentUnit/deleteConentUnit`, { id })
      .then((res) => {
        getContentUnits();
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
          <Link to="/addContentUnit" className="newPlayerButton">
            Add New
          </Link>
          <div className="programsContainer">
            {contentUnits.map((e, index) => {
              return (
                <div className="programsBox" key={index}>
                  <img className="playIcon" src={playIcon} alt=""></img>
                  <div className="programsBox-main">
                    <div className="programsBox-title-div">
                      <span className="programsBox-title">{e._id}</span>
                      <div className="programsBox-button-div">
                        <span className="programsBox-button" onClick={() => handleOpen(e._id)}>
                          Get Embed Code
                        </span>
                      </div>
                    </div>
                    <div style={{ margin: "2px 0px", display: "flex", alignItems: "center" }}>
                      <span>Player Id: {e.player._id}</span>
                    </div>
                    <div style={{ margin: "0px 0px", display: "flex", alignItems: "center" }}>
                      <span>Playlist Id: {e.playlist._id}</span>
                    </div>

                    <span className="programBox-details">
                      <Link to="/editContentUnits" className="link" state={contentUnits.filter((p) => p._id.toString() === e._id.toString())}>
                        <li className="sidebarListItem ">
                          <BorderColorIcon className="sidebarIcon" />
                        </li>
                      </Link>
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
      <Modal open={open} onClose={handleClose} aria-labelledby="modal-modal-title" aria-describedby="modal-modal-description">
        <div style={style}>
          <div style={{ display: "flex", alignItems: "center", flexDirection: "column" }}>
            <Typography id="modal-modal-title" variant="h6" component="h2">
              Embed Code
            </Typography>

            <div style={{ marginTop: "20px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <span
                style={{
                  backgroundColor: "red",
                  height: "40px",
                  width: "200px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  borderRadius: "10px",
                  color: "white",
                  fontSize: "20px",
                  cursor: "pointer",
                  marginRight: "40px",
                }}
                onClick={() => setIsJs(true)}
              >
                Js Embed Code
              </span>
              <span
                style={{
                  backgroundColor: "red",
                  height: "40px",
                  width: "200px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  borderRadius: "10px",
                  color: "white",
                  fontSize: "20px",
                  cursor: "pointer",
                }}
                onClick={() => setIsJs(false)}
              >
                Html Embed Code
              </span>
            </div>
            <div style={{ border: "1px solid black", padding: "20px", margin: "20px" }}>
              {isJs ? (
                <Typography id="modal-modal-description">{embedCodeJs}</Typography>
              ) : (
                <Typography id="modal-modal-description">{embedCode}</Typography>
              )}
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
}
