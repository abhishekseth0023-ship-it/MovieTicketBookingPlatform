import React from "react";
import { Tickets, Info, Star } from "lucide-react";
import Video from "../../assets/MovieBannerVideo.mp4";
import { bannerStyles } from "../../assets/dummyStyles";

const Banner = () => {
  return (
    <div className={bannerStyles.container}>
      
      <div className={bannerStyles.videoContainer}>
        <video
          autoPlay
          loop
          muted
          playsInline
          className={bannerStyles.video}
        >
          <source src={Video} type="video/mp4" />
          Your browser does not support the video tag.
        </video>

        <div
          aria-hidden="true"
          className={bannerStyles.overlay}
        />
      </div>
      <style>
        {bannerStyles.customCSS}
      </style>
    </div>
  );
};

export default Banner;