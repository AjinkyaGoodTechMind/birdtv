import React, { useEffect, useRef } from "react";
import videojs from "video.js";
import "video.js/dist/video-js.css";
import "videojs-vast-vpaid/dist/videojs_5.vast.vpaid.min.js";

import "videojs-contrib-ads";
import testVideo from "./testVideo2.mp4";

// http://64.227.170.236/media/videos/testVideo2.mp4

export default function Test() {
  const videoRef = useRef(null);

  var videoOptions = {
    controls: true,
    sources: [
      {
        src: "http://64.227.170.236/media/videos/testVideo2.mp4",
        type: "video/mp4",
      },
    ],
  };

  var imaOptions = {
    adTagUrl:
      "http://pubads.g.doubleclick.net/gampad/ads?sz=640x480&iu=/124319096/external/ad_rule_samples&ciu_szs=300x250&ad_rule=1&impl=s&gdfp_req=1&env=vp&output=xml_vmap1&unviewed_position_start=1&cust_params=sample_ar%3Dpremidpostpod%26deployment%3Dgmf-js&cmsid=496&vid=short_onecue&correlator=",
  };

  useEffect(() => {
    const player = videojs(videoRef.current);

    console.log(player);

    player.vastClient({
      adTagUrl:
        "http://pubads.g.doubleclick.net/gampad/ads?sz=640x480&iu=/124319096/external/ad_rule_samples&ciu_szs=300x250&ad_rule=1&impl=s&gdfp_req=1&env=vp&output=xml_vmap1&unviewed_position_start=1&cust_params=sample_ar%3Dpremidpostpod%26deployment%3Dgmf-js&cmsid=496&vid=short_onecue&correlator=",
    });

    player.src({
      src: "http://64.227.170.236/media/videos/testVideo2.mp4",
      type: "video/mp4",
    });

    return () => {
      player.dispose();
    };
  }, []);

  return (
    <div>
      <span>Hii</span>
      <video ref={videoRef} id="content_video" className="video-js vjs-default-skin" controls preload="auto" width="640" height="360">
        <source src="https://storage.googleapis.com/gvabox/media/samples/android.mp4" type="video/mp4" />
      </video>
    </div>
  );
}
