import { useEffect, useRef, useState } from "react";
// import "./App.css";
import ReactPlayer from "react-player";

import axios from "axios";

import ReactJWPlayer from "react-jw-player";

import testVideo from "./testVideo2.mp4";

import styled from "styled-components";

function App({ playerId, playlistId, contentUnitId }) {
  //function App() {
  // let playerId = "646381878cca3ed8541304c3";
  // let playlistId = "64637175ed07ec0be7efb245";
  //let contentUnitId = "6479a4e4ad0fef6c62480a07";

  const [currentIndex, setCurrentIndex] = useState(0);

  const [playlist, setPlaylist] = useState([]);

  const [videoSrc, setVideoSrc] = useState(playlist[0]);

  const [general, setGeneral] = useState({
    playerSize: {
      height: 0,
      width: 0,
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
    inSlide: true,
    position: "bottom-left",
  });

  const [ads, setAds] = useState({
    ads: false,
    preRoll: {
      preRoll: false,
      vastTag: "",
    },
    postRoll: {
      postRoll: false,
      vastTag: "",
    },
    midRoll: {
      midRoll: false,
      adTime: [
        {
          tag: [
            "https://pubads.g.doubleclick.net/gampad/ads?sz=640x480&iu=/124319096/external/single_ad_samples&ciu_szs=300x250&impl=s&gdfp_req=1&env=vp&output=vast&unviewed_position_start=1&cust_params=deployment%3Ddevsite%26sample_ct%3Dskippablelinear&correlator=[timestamp]",
          ],
          type: "linear",
          offset: 25,
        },
      ],
    },
  });

  console.log(ads);

  const [isInPictureInPictureMode, setIsInPictureInPictureMode] = useState(false);
  const [pipWindowPosition, setPipWindowPosition] = useState({ left: 0, top: 0 });
  const [pipWindowSize, setPipWindowSize] = useState({ height: 100, width: 300 });

  const [isVisible, setIsVisible] = useState(false);

  const playerRef = useRef(null);
  const pipPlayerRef = useRef(null);

  useEffect(() => {
    if (!adUnit.actAsAdUnit) {
      if (sticky.stick) {
        const handleScroll = () => {
          // const player = playerRef.current.getInternalPlayer();
          const player = document.querySelector(".jw-wrapper");

          const playerRect = player.getBoundingClientRect();
          const playerBottom = playerRect.top + playerRect.height;
          const isInViewport = playerRect.top >= 0 && playerBottom <= window.innerHeight;
          const isBeyondPlayerBottom = playerBottom < window.scrollY;

          if (!isInViewport && isBeyondPlayerBottom && !isInPictureInPictureMode) {
            enterPictureInPictureMode();
          } else if ((isInViewport || !isBeyondPlayerBottom) && isInPictureInPictureMode) {
            exitPictureInPictureMode();
          }
        };

        window.addEventListener("scroll", handleScroll);

        return () => {
          window.removeEventListener("scroll", handleScroll);
        };
      } else if (general.pauseWhenOutOfView) {
        const handleScroll = () => {
          const player = playerRef.current.getInternalPlayer();
          const playerRect = player.getBoundingClientRect();
          const playerBottom = playerRect.top + playerRect.height;
          const isInViewport = playerRect.top >= 0 && playerBottom <= window.innerHeight;
          const isBeyondPlayerBottom = playerBottom < window.scrollY;

          if (!isInViewport && isBeyondPlayerBottom) {
            player.pause();
          } else if (isInViewport || !isBeyondPlayerBottom) {
            player.play();
          }
        };

        window.addEventListener("scroll", handleScroll);

        return () => {
          window.removeEventListener("scroll", handleScroll);
        };
      }
    }
  }, [isInPictureInPictureMode, sticky]);

  const adUnitRef = useRef(null);

  useEffect(() => {
    if (adUnit.actAsAdUnit && adUnit.inSlide) {
      const handleScroll = () => {
        const container = document.getElementById("container");
        const containerRect = container.getBoundingClientRect();
        const containerBottom = containerRect.top + containerRect.height;

        const isInViewport = containerRect.top >= 0 && containerBottom <= window.innerHeight;

        const isBeyondPlayerBottom = containerBottom < window.scrollY;

        if (!isInViewport && isBeyondPlayerBottom) {
          setIsVisible(true);
        } else if (isInViewport || !isBeyondPlayerBottom) {
          setIsVisible(false);
        }
      };

      window.addEventListener("scroll", handleScroll);

      return () => window.removeEventListener("scroll", handleScroll);
    } else if (adUnit.actAsAdUnit) {
      const handleScroll = () => {
        const first = document.getElementById("container");

        const containerRect = first.getBoundingClientRect();
        const containerBottom = containerRect.top + containerRect.height;

        const isInViewport = containerRect.top >= 0 && containerBottom <= window.innerHeight;

        const isBeyondPlayerBottom = containerRect.top < window.scrollY;

        console.log("beyond", isBeyondPlayerBottom);
        if (isInViewport && isBeyondPlayerBottom) {
          const player = adUnitRef.current;
          const nestedDiv = player.querySelector("div");
          console.log("nestedDiv", nestedDiv);
          nestedDiv.style.height = "100%";
          player.style.height = `${general.playerSize.height}px`;

          player.style.transition = "height 1s";
          setIsVisible(true);
        } else if (isInViewport || !isBeyondPlayerBottom) {
          const player = adUnitRef.current;
          console.log("player", player);
          player.style.height = "0px";
          setIsVisible(false);
        }
      };

      window.addEventListener("scroll", handleScroll);

      return () => window.removeEventListener("scroll", handleScroll);
    }
  }, [adUnit.actAsAdUnit]);

  const enterPictureInPictureMode = () => {
    setPipWindowPosition({
      left: sticky.position.left,
      top: sticky.position.top,
    });

    setPipWindowSize({
      height: sticky.playerSize.height,
      width: sticky.playerSize.width,
    });

    setIsInPictureInPictureMode(true);
  };

  const exitPictureInPictureMode = () => {
    setIsInPictureInPictureMode(false);
  };

  const handleNext = () => {
    if (general.continuePlaylist) {
      if (currentIndex < playlist.length - 1) {
        setVideoSrc(playlist[currentIndex + 1].file);
        setCurrentIndex((prev) => prev + 1);
      }
    }
  };

  const getPlayer = async (id) => {
    await axios
      .post(`http://52.91.168.25/api/player/getPlayerById`, { playerId: id })
      .then(({ data }) => {
        console.log("data", data);
        setGeneral(data[0].generalSettings);
        setSticky(data[0].sticky);
        setAdUnit(data[0].adUnit);
        setAds(data[0].ads);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const getPlaylist = async (id) => {
    await axios
      .post(`http://52.91.168.25/api/playlist/getPlaylistById`, { playlistId: id })
      .then(({ data }) => {
        if (data[0].mrss) {
          const fetchFeed = async () => {
            try {
              await axios.get(data[0].mrss).then(({ data }) => {
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

                setPlaylist(extractedVideos);
                setVideoSrc(extractedVideos[0].file);
              });
            } catch (error) {
              console.log(error);
            }
          };

          fetchFeed();
        } else {
          setPlaylist(data[0].videos);
          setVideoSrc(data[0].videos[0].file);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const getContentUnit = async () => {
    await axios.post(`http://52.91.168.25/api/contentUnit/getConentUnitById`, { contentUnitId }).then(({ data }) => {
      getPlayer(data[0].player._id);
      getPlaylist(data[0].playlist._id);
    });
  };

  useEffect(() => {
    getContentUnit();
    // getPlayer();
    // getPlaylist();
  }, []);

  const playerStyle = {
    top: general.playerSize.position.top,
    left: general.playerSize.position.left,
  };

  const playerStyle3 = {
    top: general.playerSize.position.top,
    left: general.playerSize.position.left,
    height: "0px",
  };

  const playerStyle2 = {
    display: isInPictureInPictureMode ? "flex" : "none",
    position: "fixed",
    top: pipWindowPosition.top,
    left: pipWindowPosition.left,
    marginTop: "30px",
  };

  const ads2 = {
    admessage: "This video will resume in xx seconds",
    adscheduleid: "your_ad_schedule_id",
    client: "vast",
    cuetext: "Advertisement",
    outstream: false,
    preloadAds: false,
    vpaidcontrols: false,
    rules: {
      startOnSeek: "pre",
      timeBetweenAds: 0,
    },
    schedule: ads.midRoll.adTime,
  };

  // const adUnitSyle = {
  //   display: isVisible ? "flex" : "none",
  //   position: "sticky",
  //   top: adUnit.position.top,
  //   left: adUnit.position.left,
  //   marginTop: "30px",
  // };

  const style = {
    //height: "4000px",
  };

  return (
    <div className="App2" style={style}>
      <link href="http://52.91.168.25/public/videoplayer/main.f955f613.css" rel="stylesheet" />
      {/* <p>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed euismod leo id nulla bibendum tincidunt. Nunc tincidunt sapien vel lacinia
        auctor. Praesent iaculis, eros eu rutrum congue, dolor enim eleifend augue, at tincidunt lorem velit ac lectus. Lorem ipsum dolor sit amet,
        consectetur adipiscing elit. Sed euismod leo id nulla bibendum tincidunt. Nunc tincidunt sapien vel lacinia auctor. Praesent iaculis, eros eu
        rutrum congue, dolor enim eleifend augue, at tincidunt lorem velit ac lectus. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed
        euismod leo id nulla bibendum tincidunt. Nunc tincidunt sapien vel lacinia auctor. Praesent iaculis, eros eu rutrum congue, dolor enim
        eleifend augue, at tincidunt lorem velit ac lectus. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed euismod leo id nulla bibendum
        tincidunt. Nunc tincidunt sapien vel lacinia auctor. Praesent iaculis, eros eu rutrum congue, dolor enim eleifend augue, at tincidunt lorem
        velit ac lectus. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed euismod leo id nulla bibendum tincidunt. Nunc tincidunt sapien
        vel lacinia auctor. Praesent iaculis, eros eu rutrum congue, dolor enim eleifend augue, at tincidunt lorem velit ac lectus.
      </p>
      <p>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed euismod leo id nulla bibendum tincidunt. Nunc tincidunt sapien vel lacinia
        auctor. Praesent iaculis, eros eu rutrum congue, dolor enim eleifend augue, at tincidunt lorem velit ac lectus. Lorem ipsum dolor sit amet,
        consectetur adipiscing elit. Sed euismod leo id nulla bibendum tincidunt. Nunc tincidunt sapien vel lacinia auctor. Praesent iaculis, eros eu
        rutrum congue, dolor enim eleifend augue, at tincidunt lorem velit ac lectus. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed
        euismod leo id nulla bibendum tincidunt. Nunc tincidunt sapien vel lacinia auctor. Praesent iaculis, eros eu rutrum congue, dolor enim
        eleifend augue, at tincidunt lorem velit ac lectus. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed euismod leo id nulla bibendum
        tincidunt. Nunc tincidunt sapien vel lacinia auctor. Praesent iaculis, eros eu rutrum congue, dolor enim eleifend augue, at tincidunt lorem
        velit ac lectus. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed euismod leo id nulla bibendum tincidunt. Nunc tincidunt sapien
        vel lacinia auctor. Praesent iaculis, eros eu rutrum congue, dolor enim eleifend augue, at tincidunt lorem velit ac lectus.
      </p>
      <p>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed euismod leo id nulla bibendum tincidunt. Nunc tincidunt sapien vel lacinia
        auctor. Praesent iaculis, eros eu rutrum congue, dolor enim eleifend augue, at tincidunt lorem velit ac lectus. Lorem ipsum dolor sit amet,
        consectetur adipiscing elit. Sed euismod leo id nulla bibendum tincidunt. Nunc tincidunt sapien vel lacinia auctor. Praesent iaculis, eros eu
        rutrum congue, dolor enim eleifend augue, at tincidunt lorem velit ac lectus. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed
        euismod leo id nulla bibendum tincidunt. Nunc tincidunt sapien vel lacinia auctor. Praesent iaculis, eros eu rutrum congue, dolor enim
        eleifend augue, at tincidunt lorem velit ac lectus. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed euismod leo id nulla bibendum
        tincidunt. Nunc tincidunt sapien vel lacinia auctor. Praesent iaculis, eros eu rutrum congue, dolor enim eleifend augue, at tincidunt lorem
        velit ac lectus. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed euismod leo id nulla bibendum tincidunt. Nunc tincidunt sapien
        vel lacinia auctor. Praesent iaculis, eros eu rutrum congue, dolor enim eleifend augue, at tincidunt lorem velit ac lectus.
      </p>
      <p>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed euismod leo id nulla bibendum tincidunt. Nunc tincidunt sapien vel lacinia
        auctor. Praesent iaculis, eros eu rutrum congue, dolor enim eleifend augue, at tincidunt lorem velit ac lectus. Lorem ipsum dolor sit amet,
        consectetur adipiscing elit. Sed euismod leo id nulla bibendum tincidunt. Nunc tincidunt sapien vel lacinia auctor. Praesent iaculis, eros eu
        rutrum congue, dolor enim eleifend augue, at tincidunt lorem velit ac lectus. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed
        euismod leo id nulla bibendum tincidunt. Nunc tincidunt sapien vel lacinia auctor. Praesent iaculis, eros eu rutrum congue, dolor enim
        eleifend augue, at tincidunt lorem velit ac lectus. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed euismod leo id nulla bibendum
        tincidunt. Nunc tincidunt sapien vel lacinia auctor. Praesent iaculis, eros eu rutrum congue, dolor enim eleifend augue, at tincidunt lorem
        velit ac lectus. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed euismod leo id nulla bibendum tincidunt. Nunc tincidunt sapien
        vel lacinia auctor. Praesent iaculis, eros eu rutrum congue, dolor enim eleifend augue, at tincidunt lorem velit ac lectus.
      </p> */}
      <div id="container"></div>
      {adUnit.actAsAdUnit ? (
        adUnit.inSlide ? (
          <>
            {adUnit.position === "top-left" && (
              <div ref={adUnitRef} className={`video-containerTopLeft${isVisible ? " visible" : ""}`}>
                <div style={playerStyle}>
                  <ReactJWPlayer
                    playerId="1234"
                    ref={playerRef}
                    // file={videoSrc}
                    playlist={playlist}
                    isAutoPlay={general.autoPlay}
                    isMuted={general.muted}
                    playerScript="https://cdn.jwplayer.com/libraries/cDnha7c4.js"
                    customProps={
                      ads.ads
                        ? {
                            advertising: { ...ads2 },
                            controls: true,
                            repeat: general.loop,
                            width: general.playerSize.width,
                            height: general.playerSize.height,
                          }
                        : {
                            controls: true,
                            repeat: general.loop,
                            width: general.playerSize.width,
                            height: general.playerSize.height,
                          }
                    }
                    onComplete={handleNext}
                  />
                </div>
              </div>
            )}

            {adUnit.position === "top-right" && (
              <div ref={adUnitRef} className={`video-containerTopRight${isVisible ? " visible" : ""}`}>
                <div style={playerStyle}>
                  <ReactJWPlayer
                    playerId="1234"
                    ref={playerRef}
                    // file={videoSrc}
                    playlist={playlist}
                    isAutoPlay={general.autoPlay}
                    isMuted={general.muted}
                    playerScript="https://cdn.jwplayer.com/libraries/cDnha7c4.js"
                    customProps={
                      ads.ads
                        ? {
                            advertising: { ...ads2 },
                            controls: true,
                            repeat: general.loop,
                            width: general.playerSize.width,
                            height: general.playerSize.height,
                          }
                        : {
                            controls: true,
                            repeat: general.loop,
                            width: general.playerSize.width,
                            height: general.playerSize.height,
                          }
                    }
                    onComplete={handleNext}
                  />
                </div>
              </div>
            )}

            {adUnit.position === "bottom-left" && (
              <div ref={adUnitRef} className={`video-containerBottomLeft${isVisible ? " visible" : ""}`}>
                <div style={playerStyle}>
                  <ReactJWPlayer
                    playerId="1234"
                    ref={playerRef}
                    // file={videoSrc}
                    playlist={playlist}
                    isAutoPlay={general.autoPlay}
                    isMuted={general.muted}
                    playerScript="https://cdn.jwplayer.com/libraries/cDnha7c4.js"
                    customProps={
                      ads.ads
                        ? {
                            advertising: { ...ads2 },
                            controls: true,
                            repeat: general.loop,
                            width: general.playerSize.width,
                            height: general.playerSize.height,
                          }
                        : {
                            controls: true,
                            repeat: general.loop,
                            width: general.playerSize.width,
                            height: general.playerSize.height,
                          }
                    }
                    onComplete={handleNext}
                  />
                </div>
              </div>
            )}

            {adUnit.position === "bottom-right" && (
              <div ref={adUnitRef} className={`video-containerBottomRight${isVisible ? " visible" : ""}`}>
                <div style={playerStyle}>
                  <ReactJWPlayer
                    playerId="1234"
                    ref={playerRef}
                    // file={videoSrc}
                    playlist={playlist}
                    isAutoPlay={general.autoPlay}
                    isMuted={general.muted}
                    playerScript="https://cdn.jwplayer.com/libraries/cDnha7c4.js"
                    customProps={
                      ads.ads
                        ? {
                            advertising: { ...ads2 },
                            controls: true,
                            repeat: general.loop,
                            width: general.playerSize.width,
                            height: general.playerSize.height,
                          }
                        : {
                            controls: true,
                            repeat: general.loop,
                            width: general.playerSize.width,
                            height: general.playerSize.height,
                          }
                    }
                    onComplete={handleNext}
                  />
                </div>
              </div>
            )}
          </>
        ) : (
          <>
            {/* <p>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed euismod leo id nulla bibendum tincidunt. Nunc tincidunt sapien vel lacinia
        auctor. Praesent iaculis, eros eu rutrum congue, dolor enim eleifend augue, at tincidunt lorem velit ac lectus. Lorem ipsum dolor sit amet,
        consectetur adipiscing elit. Sed euismod leo id nulla bibendum tincidunt. Nunc tincidunt sapien vel lacinia auctor. Praesent iaculis, eros eu
        rutrum congue, dolor enim eleifend augue, at tincidunt lorem velit ac lectus. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed
        euismod leo id nulla bibendum tincidunt. Nunc tincidunt sapien vel lacinia auctor. Praesent iaculis, eros eu rutrum congue, dolor enim
        eleifend augue, at tincidunt lorem velit ac lectus. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed euismod leo id nulla bibendum
        tincidunt. Nunc tincidunt sapien vel lacinia auctor. Praesent iaculis, eros eu rutrum congue, dolor enim eleifend augue, at tincidunt lorem
        velit ac lectus. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed euismod leo id nulla bibendum tincidunt. Nunc tincidunt sapien
        vel lacinia auctor. Praesent iaculis, eros eu rutrum congue, dolor enim eleifend augue, at tincidunt lorem velit ac lectus.
      </p> */}

            <div style={playerStyle3} ref={adUnitRef}>
              <ReactJWPlayer
                playerId="1234"
                ref={playerRef}
                // file={videoSrc}
                playlist={playlist}
                isAutoPlay={general.autoPlay}
                isMuted={general.muted}
                playerScript="https://cdn.jwplayer.com/libraries/cDnha7c4.js"
                customProps={
                  ads.ads
                    ? {
                        advertising: { ...ads2 },
                        controls: true,
                        repeat: general.loop,
                        width: general.playerSize.width,
                        height: "100%",
                      }
                    : {
                        controls: true,
                        repeat: general.loop,
                        width: general.playerSize.width,
                        height: "100%",
                      }
                }
                onComplete={handleNext}
              />
            </div>

            <div id="secondElement"></div>

            {/* <p>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed euismod leo id nulla bibendum tincidunt. Nunc tincidunt sapien vel lacinia
              auctor. Praesent iaculis, eros eu rutrum congue, dolor enim eleifend augue, at tincidunt lorem velit ac lectus. Lorem ipsum dolor sit
              amet, consectetur adipiscing elit. Sed euismod leo id nulla bibendum tincidunt. Nunc tincidunt sapien vel lacinia auctor. Praesent
              iaculis, eros eu rutrum congue, dolor enim eleifend augue, at tincidunt lorem velit ac lectus. Lorem ipsum dolor sit amet, consectetur
              adipiscing elit. Sed euismod leo id nulla bibendum tincidunt. Nunc tincidunt sapien vel lacinia auctor. Praesent iaculis, eros eu rutrum
              congue, dolor enim eleifend augue, at tincidunt lorem velit ac lectus. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed
              euismod leo id nulla bibendum tincidunt. Nunc tincidunt sapien vel lacinia auctor. Praesent iaculis, eros eu rutrum congue, dolor enim
              eleifend augue, at tincidunt lorem velit ac lectus. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed euismod leo id nulla
              bibendum tincidunt. Nunc tincidunt sapien vel lacinia auctor. Praesent iaculis, eros eu rutrum congue, dolor enim eleifend augue, at
              tincidunt lorem velit ac lectus.
            </p>
            <p>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed euismod leo id nulla bibendum tincidunt. Nunc tincidunt sapien vel lacinia
              auctor. Praesent iaculis, eros eu rutrum congue, dolor enim eleifend augue, at tincidunt lorem velit ac lectus. Lorem ipsum dolor sit
              amet, consectetur adipiscing elit. Sed euismod leo id nulla bibendum tincidunt. Nunc tincidunt sapien vel lacinia auctor. Praesent
              iaculis, eros eu rutrum congue, dolor enim eleifend augue, at tincidunt lorem velit ac lectus. Lorem ipsum dolor sit amet, consectetur
              adipiscing elit. Sed euismod leo id nulla bibendum tincidunt. Nunc tincidunt sapien vel lacinia auctor. Praesent iaculis, eros eu rutrum
              congue, dolor enim eleifend augue, at tincidunt lorem velit ac lectus. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed
              euismod leo id nulla bibendum tincidunt. Nunc tincidunt sapien vel lacinia auctor. Praesent iaculis, eros eu rutrum congue, dolor enim
              eleifend augue, at tincidunt lorem velit ac lectus. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed euismod leo id nulla
              bibendum tincidunt. Nunc tincidunt sapien vel lacinia auctor. Praesent iaculis, eros eu rutrum congue, dolor enim eleifend augue, at
              tincidunt lorem velit ac lectus.
            </p> */}
          </>
        )
      ) : (
        <>
          <div style={playerStyle}>
            <ReactJWPlayer
              playerId="1234"
              ref={playerRef}
              // file={videoSrc}
              playlist={playlist}
              isAutoPlay={general.autoPlay}
              isMuted={general.muted}
              playerScript="https://cdn.jwplayer.com/libraries/cDnha7c4.js"
              customProps={
                ads.ads
                  ? {
                      advertising: { ...ads2 },
                      controls: true,
                      repeat: general.loop,
                      width: general.playerSize.width,
                      height: general.playerSize.height,
                    }
                  : {
                      controls: true,
                      repeat: general.loop,
                      width: general.playerSize.width,
                      height: general.playerSize.height,
                    }
              }
              onComplete={handleNext}
            />
          </div>

          <div style={playerStyle2}>
            <ReactJWPlayer
              playerId="1235"
              ref={pipPlayerRef}
              // file={videoSrc}
              playlist={playlist}
              isAutoPlay={general.autoPlay}
              isMuted={general.muted}
              playerScript="https://cdn.jwplayer.com/libraries/cDnha7c4.js"
              customProps={
                ads.ads
                  ? {
                      advertising: { ...ads2 },
                      controls: true,
                      repeat: general.loop,
                      width: sticky.playerSize.width,
                      height: sticky.playerSize.height,
                      left: "300",
                    }
                  : {
                      controls: true,
                      repeat: general.loop,
                      width: sticky.playerSize.width,
                      height: sticky.playerSize.height,
                      left: "300",
                    }
              }
              onComplete={handleNext}
            />
          </div>
        </>
      )}
    </div>
  );
}

export default App;
