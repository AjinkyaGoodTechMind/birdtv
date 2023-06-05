import "./addPlayer.css";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import testVideo from "../../../assets/testVideo2.mp4";
import testAd from "../../../assets/ad.mp4";
import ReactPlayer from "react-player";
import { useEffect } from "react";
import Navbar from "../../../components/Navbar/Navbar";
import Sidebar from "../../../components/Sidebar/Sidebar";
import axios from "axios";
import FormData from "form-data";
import AddBoxIcon from "@mui/icons-material/AddBox";
import CancelIcon from "@mui/icons-material/Cancel";
import { useSelector } from "react-redux";

export default function AddPlayer() {
  const navigate = useNavigate();
  const { currentDomain } = useSelector((state) => state.sessionSlice);
  const [user, setUser] = useState("Robin");

  const [name, setName] = useState("");

  const [active, setActive] = useState(true);

  const [currentIndex, setCurrentIndex] = useState(0);

  const [videoArray, setVideoArray] = useState(testVideo);
  const [videoSrc, setVideoSrc] = useState(testVideo);

  // const [monetization, setMonetization] = useState(false);
  // const [preRollAd, setPreRollAd] = useState(false);
  // const [postRollAd, setPostRollAd] = useState(false);

  // const [midRollAd, setMidRollAd] = useState(false);

  // const [midRollAdTime, setMidRollAdTime] = useState([
  //   {
  //     offset: 0,
  //     vastTag: "",
  //   },
  // ]);

  const [ads, setAds] = useState({
    ads: false,
    preRoll: {
      preRoll: false,
      tag: "",
    },
    postRoll: {
      postRoll: false,
      tag: "",
    },
    midRoll: {
      midRoll: false,
      adTime: [
        {
          offset: 10,
          tag: "",
        },
      ],
    },
  });

  const [general, setGeneral] = useState({
    playerSize: {
      height: 600,
      width: 800,
      position: {
        top: 0,
        left: 0,
      },
    },
    mobileSize: {
      height: 150,
      width: 300,
      position: {
        top: 0,
        left: 0,
      },
    },
    autoPlay: false,
    pauseAdWhenOutOfView: false,
    continuePlaylist: false,
    loop: false,
    muted: false,
    pauseWhenOutOfView: false,
  });

  const [sticky, setSticky] = useState({
    stick: false,
    position: {
      top: 500,
      left: 100,
    },
    playerSize: {
      height: 300,
      width: 600,
    },
  });

  const [adUnit, setAdUnit] = useState({
    actAsAdUnit: false,
    inSlide: false,
    position: "bottom-left",
  });

  const handleNext = () => {
    if (currentIndex < videoArray.length) {
      setVideoSrc(videoArray[currentIndex + 1]);
      setCurrentIndex((prev) => prev + 1);
    }
  };

  // useEffect(() => {
  //   if (preRollAd && postRollAd) {
  //     let newVideoArray = [testAd, testVideo, testAd];
  //     setVideoArray(newVideoArray);
  //     setVideoSrc(newVideoArray[0]);
  //     setCurrentIndex(0);
  //   } else if (preRollAd) {
  //     let newVideoArray = [testAd, testVideo];
  //     setVideoArray(newVideoArray);
  //     setVideoSrc(newVideoArray[0]);
  //     setCurrentIndex(0);
  //   } else if (postRollAd) {
  //     let newVideoArray = [testVideo, testAd];
  //     setVideoArray(newVideoArray);
  //     setVideoSrc(newVideoArray[0]);
  //     setCurrentIndex(0);
  //   } else {
  //     setVideoArray([testVideo]);
  //     setVideoSrc(testVideo);
  //     setCurrentIndex(0);
  //   }
  // }, [preRollAd, postRollAd]);

  const handleSavePlayer = async () => {
    // let config = {
    //   method: "post",
    //   maxBodyLength: Infinity,
    //   url: "http://64.227.170.236/player/get/post/api/",
    //   data: { generalSettings: general, sticky, adUnit, ads, playerName: name },
    // };

    let config = {
      method: "post",
      maxBodyLength: Infinity,
      url: "/api/player/postPlayer",
      data: { generalSettings: general, sticky, adUnit, ads, playerName: name, domain: currentDomain._id },
    };

    await axios
      .request(config)
      .then((res) => {
        console.log(res);
        navigate("/");
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const handleFeatureChange = (i, index) => {
    let newData = ads;

    let name = i.target.name;

    newData.midRoll.adTime[index][name] = i.target.value;

    setAds({ ...newData });
  };

  const handleRemove = (index) => {
    let newData = ads;

    newData.midRoll.adTime.splice(index, 1);

    setAds({ ...newData });
  };

  const handleAdd = () => {
    let newData = ads;

    newData.midRoll.adTime.push({
      offset: 0,
      tag: "",
    });

    setAds({ ...newData });
  };

  return (
    <div className="addPlayer">
      <Navbar />

      <div className="addPlayer-main">
        <Sidebar />
        <div className="addPlayer-main-container">
          <div className="addPlayer-inputsContainer">
            <div className="addPlayer-inputs">
              <h2>
                Player <span style={{ color: "red" }}>Name</span>
              </h2>
              <input type="text" value={name} onChange={(e) => setName(e.target.value)} />
            </div>
            <hr />

            <h2>
              General <span style={{ color: "red" }}>Settings</span>
            </h2>

            <h3>Desktop</h3>
            <h4>Player Size</h4>
            <div className="addPlayer-inputs">
              <span>Height (px)</span>
              <input
                type="number"
                value={general.playerSize.height}
                onChange={(e) => setGeneral((prev) => ({ ...prev, playerSize: { ...prev.playerSize, height: e.target.value } }))}
              />
            </div>
            <div className="addPlayer-inputs">
              <span>Width (px)</span>
              <input
                type="number"
                value={general.playerSize.width}
                onChange={(e) => setGeneral((prev) => ({ ...prev, playerSize: { ...prev.playerSize, width: e.target.value } }))}
              />
            </div>

            <h4>Position</h4>
            <div className="addPlayer-inputs">
              <span>Top(px)</span>
              <input
                style={{ width: "40px", marginRight: "20px", marginLeft: "0" }}
                type="number"
                value={general.playerSize.position.top}
                onChange={(e) =>
                  setGeneral((prev) => ({
                    ...prev,
                    playerSize: { ...prev.playerSize, position: { ...prev.playerSize.position, top: e.target.value } },
                  }))
                }
              />
              <span>Left (px)</span>
              <input
                style={{ width: "40px", marginLeft: "0" }}
                type="number"
                value={general.playerSize.position.left}
                onChange={(e) =>
                  setGeneral((prev) => ({
                    ...prev,
                    playerSize: { ...prev.playerSize, position: { ...prev.playerSize.position, left: e.target.value } },
                  }))
                }
              />
            </div>
            <hr className="hr2" />
            <h3>Mobile</h3>
            <h4>Player Size</h4>
            <div className="addPlayer-inputs">
              <span>Height (px)</span>
              <input
                type="number"
                value={general.mobileSize.height}
                onChange={(e) => setGeneral((prev) => ({ ...prev, mobileSize: { ...prev.mobileSize, height: e.target.value } }))}
              />
            </div>
            <div className="addPlayer-inputs">
              <span>Width (px)</span>
              <input
                type="number"
                value={general.mobileSize.width}
                onChange={(e) => setGeneral((prev) => ({ ...prev, mobileSize: { ...prev.mobileSize, width: e.target.value } }))}
              />
            </div>
            <h4>Position</h4>
            <div className="addPlayer-inputs">
              <span>Top(px)</span>
              <input
                style={{ width: "40px", marginRight: "20px", marginLeft: "0" }}
                type="number"
                value={general.mobileSize.position.top}
                onChange={(e) =>
                  setGeneral((prev) => ({
                    ...prev,
                    mobileSize: { ...prev.mobileSize, position: { ...prev.mobileSize.position, top: e.target.value } },
                  }))
                }
              />
              <span>Left (px)</span>
              <input
                style={{ width: "40px", marginLeft: "0" }}
                type="number"
                value={general.playerSize.position.left}
                onChange={(e) =>
                  setGeneral((prev) => ({
                    ...prev,
                    playerSize: { ...prev.playerSize, position: { ...prev.playerSize.position, left: e.target.value } },
                  }))
                }
              />
            </div>
            <hr className="hr2" />
            <h3>Other Settings</h3>
            <div className="addPlayer-inputs">
              <span>Auto Play</span>
              <input type="checkbox" checked={general.autoPlay} onChange={(e) => setGeneral((prev) => ({ ...prev, autoPlay: e.target.checked }))} />
            </div>

            <div className="addPlayer-inputs">
              <span>Muted</span>
              <input type="checkbox" checked={general.muted} onChange={(e) => setGeneral((prev) => ({ ...prev, muted: e.target.checked }))} />
            </div>

            <div className="addPlayer-inputs">
              <span>Loop</span>
              <input type="checkbox" checked={general.loop} onChange={(e) => setGeneral((prev) => ({ ...prev, loop: e.target.checked }))} />
            </div>

            <div className="addPlayer-inputs">
              <span>Continue Playlist</span>
              <input
                type="checkbox"
                checked={general.continuePlaylist}
                onChange={(e) => setGeneral((prev) => ({ ...prev, continuePlaylist: e.target.checked }))}
              />
            </div>

            <div className="addPlayer-inputs">
              <span>Pause When Out Of View</span>
              <input
                type="checkbox"
                checked={general.pauseWhenOutOfView}
                onChange={(e) => setGeneral((prev) => ({ ...prev, pauseWhenOutOfView: e.target.checked }))}
              />
            </div>

            <hr />

            <h2>
              Sticky <span style={{ color: "red" }}>Settings</span>
            </h2>
            <div className="addPlayer-inputs">
              <h3>Make Player Sticky</h3>
              <input type="checkbox" checked={sticky.stick} onChange={(e) => setSticky((prev) => ({ ...prev, stick: e.target.checked }))} />
            </div>

            {sticky.stick && (
              <>
                <h4>Sticky Player Size</h4>
                <div className="addPlayer-inputs">
                  <span>Height (px)</span>
                  <input
                    type="number"
                    value={sticky.playerSize.height}
                    onChange={(e) => setSticky((prev) => ({ ...prev, playerSize: { ...prev.playerSize, height: e.target.value } }))}
                  />
                </div>
                <div className="addPlayer-inputs">
                  <span>Width (px)</span>
                  <input
                    type="number"
                    value={sticky.playerSize.width}
                    onChange={(e) => setSticky((prev) => ({ ...prev, playerSize: { ...prev.playerSize, width: e.target.value } }))}
                  />
                </div>
                <h4>Sticky Position</h4>
                <div className="addPlayer-inputs">
                  <span>Top(px)</span>
                  <input
                    style={{ width: "40px", marginRight: "20px" }}
                    type="number"
                    value={sticky.position.top}
                    onChange={(e) => setSticky((prev) => ({ ...prev, position: { ...prev.position, top: e.target.value } }))}
                  />
                  <span>Left (px)</span>
                  <input
                    style={{ width: "40px" }}
                    type="number"
                    value={sticky.position.left}
                    onChange={(e) => setSticky((prev) => ({ ...prev, position: { ...prev.position, left: e.target.value } }))}
                  />
                </div>
              </>
            )}

            <hr />

            <h2>
              Ad <span style={{ color: "red" }}>Unit Settings</span>
            </h2>
            <div className="addPlayer-inputs">
              <h3>Act As Ad Unit</h3>
              <input
                type="checkbox"
                checked={adUnit.actAsAdUnit}
                onChange={(e) => setAdUnit((prev) => ({ ...prev, actAsAdUnit: e.target.checked }))}
              />
            </div>

            {adUnit.actAsAdUnit && (
              <>
                <div className="addPlayer-inputs">
                  <h4>In Content</h4>
                  <input type="radio" checked={!adUnit.inSlide} onChange={(e) => setAdUnit((prev) => ({ ...prev, inSlide: !e.target.checked }))} />
                </div>

                <div className="addPlayer-inputs">
                  <h4 style={{ marginLeft: "80px" }}>In Slide</h4>
                  <input type="radio" checked={adUnit.inSlide} onChange={(e) => setAdUnit((prev) => ({ ...prev, inSlide: e.target.checked }))} />
                </div>

                {adUnit.inSlide && (
                  <div className="addPlayer-inputs" style={{ marginLeft: "60px", width: "100px" }}>
                    <span>Position</span>
                    <select onChange={(e) => setAdUnit((prev) => ({ ...prev, position: e.target.value }))}>
                      <option value="top-left">Top-Left</option>
                      <option value="top-right">Top-Right</option>
                      <option value="bottom-left">Bottom-Left</option>
                      <option value="bottom-right">Bottom-Right</option>
                    </select>
                  </div>
                )}
              </>
            )}

            <hr />

            <h2>
              Ad <span style={{ color: "red" }}>Monetization</span>
            </h2>

            <div className="addPlayer-inputs">
              <h3>Enable Ad Monitiation</h3>
              <input type="checkbox" checked={ads.ads} onChange={(e) => setAds((prev) => ({ ...prev, ads: e.target.checked }))} />
            </div>

            {ads?.ads && (
              <>
                <div className="addPlayer-inputs">
                  <h4>Pre-Roll Ad</h4>
                  <input
                    type="checkbox"
                    checked={ads.preRoll.preRoll}
                    onChange={(e) => setAds((prev) => ({ ...prev, preRoll: { ...prev.preRoll, preRoll: e.target.checked } }))}
                  />
                </div>

                {ads.preRoll.preRoll && (
                  <div className="addPlayer-inputs">
                    <span>Vast tag </span>
                    <textarea
                      type="text"
                      value={ads.preRoll.tag}
                      onChange={(e) => setAds((prev) => ({ ...prev, preRoll: { ...prev.preRoll, tag: e.target.value } }))}
                    />
                  </div>
                )}

                <div className="addPlayer-inputs">
                  <h4>Post-Roll Ad</h4>
                  <input
                    type="checkbox"
                    checked={ads.postRoll.postRoll}
                    onChange={(e) => setAds((prev) => ({ ...prev, postRoll: { ...prev.postRoll, postRoll: e.target.checked } }))}
                  />
                </div>

                {ads.postRoll.postRoll && (
                  <div className="addPlayer-inputs">
                    <span>Vast tag </span>
                    <textarea
                      type="text"
                      value={ads.postRoll.tag}
                      onChange={(e) => setAds((prev) => ({ ...prev, postRoll: { ...prev.postRoll, tag: e.target.value } }))}
                    />
                  </div>
                )}

                <div className="addPlayer-inputs">
                  <h4>Mid-Roll Ad</h4>
                  <input
                    type="checkbox"
                    checked={ads.midRoll.midRoll}
                    onChange={(e) => setAds((prev) => ({ ...prev, midRoll: { ...prev.midRoll, midRoll: e.target.checked } }))}
                  />
                </div>
                {ads.midRoll.midRoll && <AddBoxIcon className="addMidroll" onClick={handleAdd} />}
                {ads.midRoll.midRoll &&
                  ads.midRoll.adTime.map((e, index) => {
                    return (
                      <div key={index} style={{ display: "flex", alignItems: "center" }}>
                        <div style={{ display: "flex", flexDirection: "column" }}>
                          <div className="addPlayer-inputs">
                            <span>Offset (Seconds)</span>
                            <input type="number" name="offset" value={e.offset} onChange={(i) => handleFeatureChange(i, index)} />
                          </div>

                          <div className="addPlayer-inputs">
                            <span>Vast tag </span>
                            <textarea name="tag" value={e.tag} type="text" onChange={(i) => handleFeatureChange(i, index)} />
                          </div>
                        </div>
                        <CancelIcon style={{ cursor: "pointer" }} onClick={() => handleRemove(index)} />
                      </div>
                    );
                  })}
              </>
            )}
          </div>

          <div style={{ flex: 1 }}>
            <div style={{ width: `${general.playerSize.width}px`, height: `${general.playerSize.height}px`, maxWidth: "900px", maxHeight: "510px" }}>
              <ReactPlayer
                // playing={autoPlay}
                url={videoSrc}
                width="100%"
                height="100%"
                controls={true}
                loop={general.loop}
                muted={true}
                onEnded={handleNext}
                pip={true}
                stopOnUnmount={false}
              />
            </div>
          </div>
        </div>
      </div>
      <span className="newPlayerButton" style={{ marginTop: "30px" }} onClick={handleSavePlayer}>
        Save Player
      </span>
    </div>
  );
}
