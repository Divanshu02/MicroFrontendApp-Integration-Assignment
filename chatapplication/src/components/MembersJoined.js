import React from "react";

const MembersJoined = (props) => {
  const { membersJoined, audioTracks, speakingMembers, displayUserDetails } =
    props;
  return (
    <>
      {membersJoined &&
        membersJoined.map((member, idx) => {
          return (
            <div
              className="speaker"
              key={idx}
            > 
              <img
                src={
                  displayUserDetails?.find((user) => {
                    return user.id == member.id;  
                  })?.avatar
                }
                className="user-avatar"
                style={{
                  borderColor:
                    speakingMembers &&
                    speakingMembers.length > 0 &&
                    speakingMembers.includes(member.id)
                      ? "#00ff00"
                      : "white",
                }}
                alt=""
              />
              <p>
                {displayUserDetails?.find((user) => user.id == member.id)?.name}
              </p>
              {/* <p>
                {displayUserDetails?.find((user) => user.id == member.id)?.id}
              </p> */}
              {/* <p>
                {audioTracks.localAudioTrack &&
                  audioTracks.localAudioTrack.trackMediaType}
              </p> */}
            </div>
          );
        })}
    </>
  );
};

export default MembersJoined;
