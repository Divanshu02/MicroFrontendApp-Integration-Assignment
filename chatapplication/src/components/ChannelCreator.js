import React, { useEffect, useRef } from "react";

const ChannelCreator = (props) => {
  const { rtcUid, audioTracks, speakingMembers, displayUserDetails } = props;
  console.log("displayUserDetails--", displayUserDetails);
  return (
    <div
      className="speaker"
    >
      <img
        src={
          displayUserDetails?.find((user) => {
            console.log("creatorDet--", user);
            return user.id == rtcUid;
          })?.avatar
        }
        className="user-avatar"
        style={{
          borderColor:
            speakingMembers &&
            speakingMembers.length > 0 &&
            speakingMembers.includes(rtcUid)
              ? "#00ff00"
              : "white",
        }}
        alt=""
      />
      <p>
        {
          displayUserDetails?.find((user) => {
            console.log("creatorDet--", user);
            return user.id == rtcUid;
          })?.name
        }
      </p>
      {/* <p>
        {
          displayUserDetails?.find((user) => {
            console.log("creatorDet--", user);
            return user.id == rtcUid;
          })?.id
        }
      </p> */}
      {/* <p>
        {audioTracks.localAudioTrack &&
          audioTracks.localAudioTrack.trackMediaType}
      </p> */}
    </div>
  );
};

export default ChannelCreator;
