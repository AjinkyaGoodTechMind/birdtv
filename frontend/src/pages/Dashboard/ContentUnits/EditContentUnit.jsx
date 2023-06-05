import "./AddContentUnit.css";
import React, { useState } from "react";

import ReactPlayer from "react-player";
import { useEffect } from "react";
import Navbar from "../../../components/Navbar/Navbar";
import Sidebar from "../../../components/Sidebar/Sidebar";
import { Box, Button, Step, StepLabel, Stepper, Typography } from "@mui/material";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { useSelector } from "react-redux";

const steps = ["Choose Player", "Video Content"];

const jsFile = "main.a706a8e6.js";

export default function EditContentUnit() {
  const { currentDomain } = useSelector((state) => state.sessionSlice);

  const location = useLocation();

  const contentUnit = location.state[0];

  console.log(contentUnit);

  const navigate = useNavigate();

  const [activeStep, setActiveStep] = useState(0);

  const [players, setPlayers] = useState([]);

  const [playlist, setPlaylist] = useState([]);

  const [selectedPlayer, setSelectedPlayer] = useState(contentUnit?.player?._id);

  const [selecedPlaylist, setSelectedPlaylist] = useState(contentUnit?.playlist?._id);

  console.log(selecedPlaylist, selectedPlayer);

  const [embedCode, setEmbedCode] = useState(
    `<!DOCTYPE html>
    <html lang="en">
      <head>
        <link rel="stylesheet" href="styles.css" />
        <link href="http://52.91.168.25/public/videoplayer/main.f955f613.css" rel="stylesheet" />
      </head>
      <script
        defer="defer"
        src="http://52.91.168.25/public/videoplayer/${jsFile}"
        playerId="${selectedPlayer}" 
        playlistId="${selecedPlaylist}"
        contentUnitId="${contentUnit._id}"
      ></script>
    
      <div id="root">
       
          <div id="container" class="container"></div> <!--Only for In-Slide Ad unit-->
          <div id="firstElement"></div> <!--Only for In-Content Ad unit-->
          <div id="videoplayer"></div>
          <div id="secondElement"></div> <!--Only for In-Content Ad unit-->
      </div>
    </html>
    `
  );

  const [embedCode2, setEmbedCode2] = useState(`<div id="root"></div>`);

  useEffect(() => {
    setEmbedCode(
      `<!DOCTYPE html>
      <html lang="en">
        <head>
          <link rel="stylesheet" href="styles.css" />
          <link href="http://52.91.168.25/public/videoplayer/main.f955f613.css" rel="stylesheet" />
        </head>
        <script
          defer="defer"
          src="http://52.91.168.25/public/videoplayer/${jsFile}"
          playerId="${selectedPlayer}" 
          playlistId="${selecedPlaylist}"
          contentUnitId="${contentUnit._id}"
        ></script>
      
        <div id="root">
         
            <div id="container" class="container"></div> <!--Only for In-Slide Ad unit-->
            <div id="firstElement"></div> <!--Only for In-Content Ad unit-->
            <div id="videoplayer"></div>
            <div id="secondElement"></div> <!--Only for In-Content Ad unit-->
        </div>
      </html>
      `
    );
  }, [selectedPlayer, selecedPlaylist]);

  // const getPlayers = async () => {
  //   await axios
  //     .get(`http://64.227.170.236/player/get/post/api/`)
  //     .then(({ data }) => {
  //       console.log(data);
  //       setPlayers(data);
  //     })
  //     .catch((err) => {
  //       console.log(err);
  //     });

  //   await axios
  //     .get(`http://64.227.170.236/video/playlist/`)
  //     .then(({ data }) => {
  //       setPlaylist(data);
  //     })
  //     .catch((err) => {
  //       console.log(err);
  //     });
  // };

  const getPlayers = async () => {
    await axios
      .get(`/api/player/getPlayers?domain=${currentDomain._id}`)
      .then(({ data }) => {
        console.log(data);
        setPlayers(data);
      })
      .catch((err) => {
        console.log(err);
      });

    await axios
      .get(`/api/playlist/getPlaylists?domain=${currentDomain._id}`)
      .then(({ data }) => {
        setPlaylist(data);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  useEffect(() => {
    getPlayers();
  }, []);

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  // const handleFinish = async () => {
  //   await axios
  //     .post(`http://64.227.170.236/content/unit/list/create/`, { player_id: selectedPlayer, playlist_id: selecedPlaylist })
  //     .then(({ data }) => {
  //       navigate("/contentUnits");
  //     })
  //     .catch((err) => {
  //       console.log(err);
  //     });
  // };

  const handleFinish = async () => {
    await axios
      .put(`/api/contentUnit/updateConentUnit`, {
        player: selectedPlayer,
        playlist: selecedPlaylist,
        domain: currentDomain._id,
        unitId: contentUnit._id,
      })
      .then((res) => {
        console.log(res);
        navigate("/contentUnits");
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <div className="addPlayer">
      <Navbar />
      <div className="addPlayer-main">
        <Sidebar />
        <div className="addContentUnit-main-container">
          <span className="title">CREATE SIMPLE CONTENT UNIT</span>

          <Box sx={{ width: "80%", marginTop: "30px", alignItems: "center" }}>
            <Stepper activeStep={activeStep}>
              {steps.map((label, index) => {
                const stepProps = {};
                const labelProps = {};

                return (
                  <Step key={label} {...stepProps}>
                    <StepLabel {...labelProps}>{label}</StepLabel>
                  </Step>
                );
              })}
            </Stepper>
            <div style={{ display: "flex", width: "100%", justifyContent: "center" }}>
              <div className="stepperContainer">
                <div className="stepperMain">
                  {activeStep === 0 && (
                    <div className="stepperMain-step">
                      <Typography sx={{ mt: 2, mb: 1 }}>Select Player</Typography>
                      <select className="playerSelect" value={selectedPlayer} onChange={(e) => setSelectedPlayer(e.target.value)}>
                        <option value="" disabled selected hidden>
                          Please Choose...
                        </option>
                        {players.map((e) => {
                          return <option value={e._id}>{e.playerName}</option>;
                        })}
                      </select>
                    </div>
                  )}
                  {activeStep === 1 && (
                    <div className="stepperMain-step">
                      <Typography sx={{ mt: 2, mb: 1 }}>Select Playlist</Typography>
                      <select className="playerSelect" value={selecedPlaylist} onChange={(e) => setSelectedPlaylist(e.target.value)}>
                        <option value="" disabled selected hidden>
                          Please Choose...
                        </option>
                        {playlist.map((e) => {
                          return <option value={e._id}>{e.title}</option>;
                        })}
                      </select>
                    </div>
                  )}
                  {/* {activeStep === 2 && (
                    <div className="stepperMain-step">
                      <Typography sx={{ mt: 2, mb: 1 }}>Embed Code</Typography>
                      <div className="embedCode">
                        <Typography id="modal-modal-description">{embedCode}</Typography>
                    
                      </div>
                    </div>
                  )} */}
                </div>

                <Box sx={{ display: "flex", flexDirection: "row", pt: 2 }}>
                  <Button color="inherit" disabled={activeStep === 0} onClick={handleBack} sx={{ mr: 1 }}>
                    Back
                  </Button>
                  <Box sx={{ flex: "1 1 auto" }} />

                  <Button onClick={handleNext}>{activeStep === 0 && "Next"}</Button>

                  <Button onClick={handleFinish}>{activeStep === 1 && "Finish"}</Button>
                </Box>
              </div>
            </div>
          </Box>
        </div>
      </div>
    </div>
  );
}
