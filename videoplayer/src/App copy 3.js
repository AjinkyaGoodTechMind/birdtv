import { useEffect, useRef, useState } from "react";
import "./App.css";
import ReactPlayer from "react-player";

import axios from "axios";

import ReactJWPlayer from "react-jw-player";

import testVideo from "./testVideo2.mp4";

// function App({ playerId, playlistId }) {
function App() {
  let playerId = "64636eea0fc3b09d6f0bb7a2";

  let playlistId = "64637175ed07ec0be7efb245";

  const [currentIndex, setCurrentIndex] = useState(0);

  const [playlist, setPlaylist] = useState([]);

  const [videoSrc, setVideoSrc] = useState(playlist[0]);

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

  const firstParagraphRef = useRef(null);
  const secondParagraphRef = useRef(null);

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
        const { top } = secondParagraphRef.current.getBoundingClientRect();
        const { bottom } = firstParagraphRef.current.getBoundingClientRect();
        const distance = bottom - top;
        const container = firstParagraphRef.current;
        const containerRect = container.getBoundingClientRect();
        const containerBottom = containerRect.top + containerRect.height;

        const isInViewport = containerRect.top >= 0 && containerBottom <= window.innerHeight;

        const isBeyondPlayerBottom = containerBottom < window.scrollY;

        if (!isInViewport && isBeyondPlayerBottom) {
          setIsVisible(true);
          adUnitRef.current.style.top = `${top + distance}px`;
        } else if (isInViewport || !isBeyondPlayerBottom) {
          setIsVisible(false);
        }
      };

      window.addEventListener("scroll", handleScroll);

      return () => window.removeEventListener("scroll", handleScroll);
    }
  }, [adUnit]);

  const enterPictureInPictureMode = () => {
    // const player = playerRef.current.getInternalPlayer();
    // const player = document.querySelector(".jw-wrapper");
    // const pipPlayer = pipPlayerRef.current.getInternalPlayer();

    const pipPlayer = pipPlayerRef.current;

    setPipWindowPosition({
      left: sticky.position.left,
      top: sticky.position.top,
    });

    setPipWindowSize({
      height: sticky.playerSize.height,
      width: sticky.playerSize.width,
    });

    // pipPlayerRef.current.seekTo(playerRef.current.getCurrentTime(), "seconds");
    // player.pause();
    // pipPlayer.play();

    setIsInPictureInPictureMode(true);
  };

  const exitPictureInPictureMode = () => {
    // const player = playerRef.current.getInternalPlayer();

    // const pipWindow = pipPlayerRef.current.getInternalPlayer();

    // playerRef.current.seekTo(pipPlayerRef.current.getCurrentTime(), "seconds");
    // pipWindow.pause();
    // player.play();

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

  const getPlayer = async () => {
    // await axios
    //   .get(`http://64.227.170.236/player/get/post/api/`)
    //   .then(({ data }) => {
    //     data = data.filter((e) => e.id.toString() === playerId.toString());

    //     setGeneral(data[0].generalSettings);
    //     setSticky(data[0].sticky);
    //     setAdUnit(data[0].adUnit);
    //   })
    //   .catch((err) => {
    //     console.log(err);
    //   });

    await axios
      .post(`http://localhost:4000/api/player/getPlayerById`, { playerId })
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

  const getPlaylist = async () => {
    await axios
      .post(`http://localhost:4000/api/playlist/getPlaylistById`, { playlistId })
      .then(({ data }) => {
        setPlaylist(data[0].videos);
        setVideoSrc(data[0].videos[0].file);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  useEffect(() => {
    getPlayer();
    getPlaylist();
  }, []);

  const playerStyle = {
    top: general.playerSize.position.top,
    left: general.playerSize.position.left,
  };

  const playerStyle2 = {
    display: isInPictureInPictureMode ? "flex" : "none",
    position: "sticky",
    top: pipWindowPosition.top,
    left: pipWindowPosition.left,
    marginTop: "30px",
  };

  // const adUnitSyle = {
  //   display: isVisible ? "flex" : "none",
  //   position: "sticky",
  //   top: adUnit.position.top,
  //   left: adUnit.position.left,
  //   marginTop: "30px",
  // };

  const style = {
    height: "4000px",
  };

  console.log(playerRef.current);

  return (
    <div className="App" style={style}>
      <div id="container" style={{ width: "100%", height: "300px", backgroundColor: "red" }}></div>
      {adUnit.actAsAdUnit ? (
        adUnit.inSlide ? (
          <>
            {adUnit.position === "top-left" && (
              <div ref={adUnitRef} className={`video-containerTopLeft${isVisible ? " visible" : ""}`}>
                <ReactPlayer
                  playing={general.autoPlay}
                  url={videoSrc}
                  width={general.playerSize.width}
                  height={general.playerSize.height}
                  controls={true}
                  loop={general.loop}
                  muted={general.muted}
                  onEnded={handleNext}
                  pip={false}
                  stopOnUnmount={false}
                />
              </div>
            )}

            {adUnit.position === "top-right" && (
              <div ref={adUnitRef} className={`video-containerTopRight${isVisible ? " visible" : ""}`}>
                <ReactPlayer
                  playing={general.autoPlay}
                  url={videoSrc}
                  width={general.playerSize.width}
                  height={general.playerSize.height}
                  controls={true}
                  loop={general.loop}
                  muted={general.muted}
                  onEnded={handleNext}
                  pip={false}
                  stopOnUnmount={false}
                />
              </div>
            )}

            {adUnit.position === "bottom-left" && (
              <div ref={adUnitRef} className={`video-containerBottomLeft${isVisible ? " visible" : ""}`}>
                <ReactPlayer
                  playing={general.autoPlay}
                  url={videoSrc}
                  width={general.playerSize.width}
                  height={general.playerSize.height}
                  controls={true}
                  loop={general.loop}
                  muted={general.muted}
                  onEnded={handleNext}
                  pip={false}
                  stopOnUnmount={false}
                />
              </div>
            )}

            {adUnit.position === "bottom-right" && (
              <div ref={adUnitRef} className={`video-containerBottomRight${isVisible ? " visible" : ""}`}>
                <ReactPlayer
                  playing={general.autoPlay}
                  url={videoSrc}
                  width={general.playerSize.width}
                  height={general.playerSize.height}
                  controls={true}
                  loop={general.loop}
                  muted={general.muted}
                  onEnded={handleNext}
                  pip={false}
                  stopOnUnmount={false}
                />
              </div>
            )}
          </>
        ) : (
          <>
            <p ref={firstParagraphRef}>
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
            <div ref={adUnitRef} className={`video-inContent${isVisible ? " visible" : ""}`}>
              <ReactPlayer
                playing={general.autoPlay}
                url={videoSrc}
                width={general.playerSize.width}
                height={general.playerSize.height}
                controls={true}
                loop={general.loop}
                muted={general.muted}
                onEnded={handleNext}
                pip={false}
                stopOnUnmount={false}
              />
            </div>

            <p ref={secondParagraphRef}>
              Ut euismod ante vel velit tincidunt congue. Mauris consequat, lorem vel congue imperdiet, magna massa mattis tellus, nec venenatis ex
              libero ut libero. Ut euismod ante vel velit tincidunt congue. Mauris consequat, lorem vel congue imperdiet, magna massa mattis tellus,
              nec venenatis ex libero ut libero. Ut euismod ante vel velit tincidunt congue. Mauris consequat, lorem vel congue imperdiet, magna massa
              mattis tellus, nec venenatis ex libero ut libero. Ut euismod ante vel velit tincidunt congue. Mauris consequat, lorem vel congue
              imperdiet, magna massa mattis tellus, nec venenatis ex libero ut libero. Ut euismod ante vel velit tincidunt congue. Mauris consequat,
              lorem vel congue imperdiet, magna massa mattis tellus, nec venenatis ex libero ut libero.
            </p>
          </>
        )
      ) : (
        <>
          {/* <ReactPlayer
            style={playerStyle}
            ref={playerRef}
            playing={general.autoPlay}
            url={videoSrc}
            width={general.playerSize.width}
            height={general.playerSize.height}
            controls={true}
            loop={general.loop}
            muted={general.muted}
            onEnded={handleNext}
            pip={false}
            stopOnUnmount={false}
            advertising={ads2}
          /> */}
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

          {/* <ReactPlayer
            style={playerStyle2}
            ref={pipPlayerRef}
            playing={general.autoPlay}
            url={videoSrc}
            width={pipWindowSize.width}
            height={pipWindowSize.height}
            controls={true}
            loop={general.loop}
            muted={general.muted}
            onEnded={handleNext}
            pip={false}
            stopOnUnmount={false}
          /> */}

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
