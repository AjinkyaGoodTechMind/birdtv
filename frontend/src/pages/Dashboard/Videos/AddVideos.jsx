import "./AddVideos.css";
import React, { useRef, useState } from "react";
import axios from "axios";
import ReactPlayer from "react-player";
import { useEffect } from "react";
import Navbar from "../../../components/Navbar/Navbar";
import Sidebar from "../../../components/Sidebar/Sidebar";
import { Box, Button, Step, StepLabel, Stepper, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import Loader from "../../../components/Loader/Loader";

const steps = ["Upload Video", "Video Details"];

export default function AddVideos() {
  const navigate = useNavigate();
  const { currentDomain } = useSelector((state) => state.sessionSlice);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const [video, setVideo] = useState("");

  const [videoSrc, setVideoSrc] = useState("");

  const videoRef = useRef(null);

  const [activeStep, setActiveStep] = useState(0);

  const [loading, setLoading] = useState(false);

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleFinish = async () => {
    let data = new FormData();
    data.append("file", video);
    data.append("title", title);
    data.append("description", description);
    data.append("domain", currentDomain._id);

    let config = {
      method: "post",
      maxBodyLength: Infinity,
      url: "/api/video/postVideo",
      data: data,
    };

    setLoading(true);

    await axios
      .request(config)
      .then((res) => {
        console.log(res);
        setLoading(false);
        navigate("/videos");
      })
      .catch((error) => {
        console.log(error);
        setLoading(false);
      });
  };

  useEffect(() => {
    const src = URL.createObjectURL(new Blob([video]), { type: "video/mp4" });
    setVideoSrc(src);
  }, [video]);

  return loading ? (
    <Loader />
  ) : (
    <div className="addPlayer">
      <Navbar />
      <div className="addPlayer-main">
        <Sidebar />
        <div className="addContentUnit-main-container">
          <span className="title">Upload Video</span>

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
              <div className="stepperContainer" style={{ width: "80%" }}>
                <div className="stepperMain">
                  {activeStep === 0 && (
                    <div className="stepperMain-step">
                      <label class="custom-file-upload">
                        <input ref={videoRef} type="file" onChange={(e) => setVideo(e.target.files[0])} />
                        Upload Your Video
                      </label>
                    </div>
                  )}
                  {activeStep === 1 && (
                    <div style={{ width: "100%", display: "flex", justifyContent: "space-between" }}>
                      <div>
                        <Typography sx={{ mt: 2, mb: 1 }}>Video Title</Typography>
                        <input
                          style={{ width: "300px", height: "20px", padding: "10px", borderRadius: "10px", border: "1px solid gray" }}
                          value={title}
                          onChange={(e) => setTitle(e.target.value)}
                        />
                        <Typography sx={{ mt: 2, mb: 1 }}>Video Description</Typography>
                        <input
                          style={{ width: "300px", height: "20px", padding: "10px", borderRadius: "10px", border: "1px solid gray" }}
                          value={description}
                          onChange={(e) => setDescription(e.target.value)}
                        />
                      </div>
                      <div>
                        <Typography sx={{ mt: 2, mb: 1 }}>Selected Video</Typography>
                        <video style={{ height: "300px", width: "400px" }} src={videoSrc} controls />
                      </div>
                    </div>
                  )}
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
