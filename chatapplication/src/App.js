import mute_icon from "./assets/images/icons/mic-off.svg";
import unmute_icon from "./assets/images/icons/mic.svg";
import leave_icon from "./assets/images/icons/leave.svg";
import React from 'react'
import AgoraRTC from "agora-rtc-sdk-ng";
import { useEffect, useState } from "react";
import MembersJoined from "./components/MembersJoined";
import ChannelCreator from "./components/ChannelCreator";
import AgoraRTM from "agora-rtm-sdk";
import male1 from "./assets/images/avatars/male-1.png";
import male2 from "./assets/images/avatars/male-2.png";
import male3 from "./assets/images/avatars/male-3.png";
import male4 from "./assets/images/avatars/male-4.png";
import male5 from "./assets/images/avatars/male-5.png";
import female1 from "./assets/images/avatars/female-1.png";
import female2 from "./assets/images/avatars/female-2.png";
import female3 from "./assets/images/avatars/female-3.png";
import female4 from "./assets/images/avatars/female-4.png";
import female5 from "./assets/images/avatars/female-5.png";

function App() {
  // rtc: Realtime communication
  // 1)local/publish--: If you want others in the session to hear what you're saying or see you, you need to "publish" your audio or video. Without publishing, it's like having your microphone or camera on but nobody can hear or see you.you can start, stop, mute, or adjust them as needed.

  // 2)remote/subscribe--: These are the audio tracks that you receive from other participants in the session. These tracks are played on your device so you can hear what others are saying. While you can mute or adjust the volume of remote audio tracks locally, you cannot control their transmission (i.e., you can't stop them from publishing)
  const [isFormVisible, setIsFormVisible] = useState(true);
  const [isRoomVisible, setIsRoomVisible] = useState(false);
  const [isTotalMembersVisible, setIsTotalMembersVisible] = useState(false);
  const [rtcClient, setRtcClient] = useState(null);
  const [rtcUid, setRtcUid] = useState();
  const [isMute, setIsMute] = useState(true);
  const [audioTracks, setAudioTracks] = useState({
    localAudioTrack: null,
    remoteAudioTracks: {},
  });

  const [rtmClient, setRtmClient] = useState(null);
  const [rtmUid, setRtmUid] = useState();
  const [rtmChannel, setRtmChannel] = useState();
  const [userName, setUserName] = useState("");
  const [displayUserDetails, setDisplayUserDetails] = useState([]);
  const [displayAvatar, setDisplayAvatar] = useState([]);
  const [selectedAvatar, setselectedAvatar] = useState(null);
  const [membersJoined, setMembersJoined] = useState([]);
  const [speakingMembers, setSpeakingMembers] = useState();
  const [roomName, setRoomName] = useState([]);

  const appid = "1762126651ed494691d5fdef14975f92";
  const token = null;

  // const signalingEngine = new AgoraRTM.RTM(appid, "user-id", {
  //   token: token,
  // });
  // console.log("TotalMembersJoined--", membersJoined);
  let initRtm = async () => {
    const client = AgoraRTM.createInstance(appid);
    setRtmClient(client);
  };

  useEffect(() => {
    if (rtmClient) {
      initRtmFollowUp();
    }
  }, [rtmClient]);  
  
  let initRtmFollowUp = async () => {
    try {
      await rtmClient.login({ uid: String(rtcUid), token: token });
      // To send any data like a payload
      rtmClient.addOrUpdateLocalUserAttributes({
        name: userName,
        avatar: displayAvatar,
        channelName: roomName,
      });
      const channel = rtmClient.createChannel(roomName);
      await channel.join();
      setRtmChannel(channel);
      let { name } = await rtmClient.getUserAttributesByKeys(String(rtcUid), [
        "name",
      ]);
      let { avatar } = await rtmClient.getUserAttributesByKeys(String(rtcUid), [
        "avatar",
      ]);
      let { channelName } = await rtmClient.getUserAttributesByKeys(
        String(rtcUid),
        ["channelName"]
      );

      setDisplayUserDetails((prev) => [
        ...prev,
        { id: rtcUid, name: name, roomName: channelName, avatar: avatar },
      ]);

      window.addEventListener("beforeunload", (e) => {
        channel.leave();
        rtmClient.logout();
      });
      console.log("usJoined-", name);
    } catch (e) {
      console.log("rtmError--", e);
    }
  };

  let initRtc = () => {
    setRtcUid(Math.floor(Math.random() * 2000)); //created user-id

    let client = AgoraRTC.createClient({ mode: "rtc", codec: "vp8" }); //creates client
    setRtcClient(client); //client val set into rtcClient state.
    // when value of RtcClient changes-> useEffect called and then tempFn called. I did this bcz state updates in React are asynchronous and sheduled so when rtcClient state changes its val from null to value useEffect is called follow up with initRtcFollowUp fn called.
    // I waited for the rtcClient state val to be changed from null,as the val of rtcClient is used in initRtcFollowUp fn to do some more operations.
  };

  useEffect(() => {
    if (rtcClient != null) initRtcFollowUp();
  }, [rtcClient]);

  const initRtcFollowUp = async () => {
    try {
      await rtcClient.join(appid, roomName, token, rtcUid);
      let lclAudioTrack = await AgoraRTC.createMicrophoneAudioTrack();
      setIsMute(true);
      setAudioTracks((prev) => {
        return { ...prev, localAudioTrack: lclAudioTrack };
      });
      /*  
    you can perform operations with localAudioTrack in the same function right after setting it. Since state updates in React are asynchronous, it's safer to use the local variable (in this case, lclAudioTrack) directly within the same function. However, if you need to reference the state variable immediately after updating it within the same function, you can do so using the local variable or by accessing the state directly.
    */
      initVolumeIndicator();
      setIsRoomVisible(true);
      setIsTotalMembersVisible(true);
    } catch (e) {
      console.log("ERROR OCCURED", e);
    }
  };

  function initVolumeIndicator() {
    AgoraRTC.setParameter("AUDIO_VOLUME_INDICATION_INTERVAL", 200);
    rtcClient.enableAudioVolumeIndicator();
  }

  async function joinMemberHandler(user) {
    // console.log("userDetails--", user);
    let { name } = await rtmClient.getUserAttributesByKeys(String(user.uid), [
      "name",
    ]);
    let { avatar } = await rtmClient.getUserAttributesByKeys(String(user.uid), [
      "avatar",
    ]);
    // setDisplayUserDetails((prev) => [...prev, { id: rtcUid, name: name }]);
    setDisplayUserDetails((prev) => {
      for (let member of prev) {
        // If that user already presents in previous state, return the prev state
        if (member && member.id == user.uid) {
          return [...prev];
        }
      }
      // if new user joins
      return [...prev, { id: user.uid, name: name, avatar: avatar }];
    });
    setMembersJoined((prev) => {
      for (let member of prev) {
        if (member && member.id == user.uid) {
          return [...prev];
        }
      }
      return [...prev, { id: user.uid, roomName: roomName }];
    });
  }

  function userLeftHandler(user) {
    setDisplayUserDetails((prev) => {
      let members = prev.filter((member) => {
        return member.id != user.uid;
      });
      return [...members];
    });
    setMembersJoined((prev) => {
      let members = prev.filter((member) => {
        return member.id != user.uid;
      });
      return members;
    });
    setAudioTracks((prev) => {
      const updatedRemoteAudioTracks = { ...prev.remoteAudioTracks };
      Object.keys(updatedRemoteAudioTracks).forEach((key) => {
        if (key == user.uid) {
          delete updatedRemoteAudioTracks[key];
        }
      });
      return {
        ...prev,
        remoteAudioTracks: updatedRemoteAudioTracks,
      };
    });
  }

  let leaveRtmChannel = async () => {
    await rtmChannel.leave();
    await rtmClient.logout();
    // handleMemberLeft
  };

  async function publishMemberHandler(user, mediaType) {
    await rtcClient.subscribe(user, mediaType);

    if (mediaType === "audio") {
      setAudioTracks((prev) => {
        return {
          ...prev,
          remoteAudioTracks: {
            ...prev.remoteAudioTracks,
            [user.uid]: [user.audioTrack],
          },
        };
      });
      // audioTracks.remoteAudioTracks[user.uid] = [user.audioTrack];
      user.audioTrack.play();
    }
  }
  // useEffect managing if any other user joins the channel
  useEffect(() => {
    if (rtcClient) {
      rtcClient.on("user-joined", joinMemberHandler);
      rtcClient.on("user-left", userLeftHandler);
      rtcClient.on("user-published", publishMemberHandler);
      rtcClient.on("volume-indicator", (volume) => {
        // console.log("volumes--", volume);
        const activeSpeakers = volume
          .filter((vol) => {
            if (vol.level > 50) return vol;
          })
          .map((vol) => vol.uid);
        setSpeakingMembers(activeSpeakers);

        // console.log("activeSpeakers--",activeSpeakers)
      });
    }
  }, [rtcClient]);

  let leaveRoom = () => {
    // Read readme.md for better understanding
    audioTracks.localAudioTrack.stop();
    audioTracks.localAudioTrack.close();
    setselectedAvatar(-1);
    rtcClient.unpublish();
    rtcClient.leave();
    leaveRtmChannel();
    setIsRoomVisible(false);
    setIsTotalMembersVisible(false);
    setIsFormVisible(true);
  };

  // effect managing the mic-mute-unmute functionality
  useEffect(() => {
    if (rtcClient) micMuteUnmuteHandler();
  }, [isMute]);

  async function micMuteUnmuteHandler() {
    if (isMute) {
      await rtcClient.unpublish(audioTracks.localAudioTrack);
    } else {
      await rtcClient.publish(audioTracks.localAudioTrack);
    }
  }

  function displayAvatarHandler(e, idx) {
    setDisplayAvatar(e.target.src);
    setselectedAvatar(idx);
    // e.target.style.borderColor='green'
  }

  return (
    <div id="container">
      {/* Room-Header */}
      <div
        id="room-header"
        style={{ display: isRoomVisible ? "flex" : "none" }}//initially hidden as no one joins the room
      >
        <h1 id="room-name">{roomName}</h1>

        <div id="room-header-controls">
          <img
            id="mic-icon"
            className="control-icon"
            src={isMute ? mute_icon : unmute_icon}
            onClick={() => setIsMute((prev) => !prev)}
            alt="mic-icon"
          />
          <img
            id="leave-icon"
            className="control-icon"
            src={leave_icon}
            onClick={leaveRoom}
            alt="leave-icon"
          />
        </div>
      </div>

      <form
        id="form"
        onSubmit={(e) => {
          e.preventDefault();
          if (selectedAvatar == null) {
            alert("You have to select an avatar before entering into room");
            return;
          }
          initRtc();
          initRtm();
          setIsFormVisible(false);
        }}
        style={{ display: isFormVisible ? "block" : "none" }}
      >
        <div>
          <h3>Select an Avatar</h3>
        </div>

        {/* border-clr:#00ff00,opacity=1  */}
        <div id="avatars">
          <img
            src={male1}
            alt=""
            className="avatar-selection"
            style={
              selectedAvatar === 0
                ? { borderColor: "#00ff00", opacity: "1" }
                : { borderColor: "white", opacity: ".5" }
            }
            onClick={(e) => displayAvatarHandler(e, 0)}
          />
          <img
            src={male2}
            alt=""
            className="avatar-selection"
            style={
              selectedAvatar === 1
                ? { borderColor: "#00ff00", opacity: "1" }
                : { borderColor: "white", opacity: ".5" }
            }
            onClick={(e) => displayAvatarHandler(e, 1)}
          />
          <img
            src={male3}
            alt=""
            className="avatar-selection"
            style={
              selectedAvatar === 2
                ? { borderColor: "#00ff00", opacity: "1" }
                : { borderColor: "white", opacity: ".5" }
            }
            onClick={(e) => displayAvatarHandler(e, 2)}
          />
          <img
            src={male4}
            alt=""
            className="avatar-selection"
            style={
              selectedAvatar === 3
                ? { borderColor: "#00ff00", opacity: "1" }
                : { borderColor: "white", opacity: ".5" }
            }
            onClick={(e) => displayAvatarHandler(e, 3)}
          />
          <img
            src={male5}
            alt=""
            className="avatar-selection"
            style={
              selectedAvatar === 4
                ? { borderColor: "#00ff00", opacity: "1" }
                : { borderColor: "white", opacity: ".5" }
            }
            onClick={(e) => displayAvatarHandler(e, 4)}
          />
          <img
            src={female1}
            alt=""
            className="avatar-selection"
            style={
              selectedAvatar === 5
                ? { borderColor: "#00ff00", opacity: "1" }
                : { borderColor: "white", opacity: ".5" }
            }
            onClick={(e) => displayAvatarHandler(e, 5)}
          />
          <img
            src={female2}
            alt=""
            className="avatar-selection"
            style={
              selectedAvatar === 6
                ? { borderColor: "#00ff00", opacity: "1" }
                : { borderColor: "white", opacity: ".5" }
            }
            onClick={(e) => displayAvatarHandler(e, 6)}
          />
          <img
            src={female3}
            alt=""
            className="avatar-selection"
            style={
              selectedAvatar === 7
                ? { borderColor: "#00ff00", opacity: "1" }
                : { borderColor: "white", opacity: ".5" }
            }
            onClick={(e) => displayAvatarHandler(e, 7)}
          />
          <img
            src={female4}
            alt=""
            className="avatar-selection"
            style={
              selectedAvatar === 8
                ? { borderColor: "#00ff00", opacity: "1" }
                : { borderColor: "white", opacity: ".5" }
            }
            onClick={(e) => displayAvatarHandler(e, 8)}
          />
          <img
            src={female5}
            alt=""
            className="avatar-selection"
            style={
              selectedAvatar === 9
                ? { borderColor: "#00ff00", opacity: "1" }
                : { borderColor: "white", opacity: ".5" }
            }
            onClick={(e) => displayAvatarHandler(e, 9)}
          />
        </div>
        <div id="form-fields">
          <label>Display Name:</label>
          <input
            required
            type="text"
            name="displayName"
            placeholder="Enter Display Name"
            id=""
            onChange={(e) => setUserName(e.target.value)}
          />

          <label>Room Name:</label>
          <input
            required
            name="roomname"
            type="text"
            placeholder="Enter room name..."
            onChange={(e) => setRoomName(e.target.value)}
          />
          <input type="submit" value="Enter Room" />
        </div>
      </form>
      <div
        id="members"
        style={{ display: isTotalMembersVisible ? "flex" : "none" }}
      >
        <ChannelCreator
          isTotalMembersVisible={isTotalMembersVisible}
          rtcUid={rtcUid}
          displayUserDetails={displayUserDetails}
          audioTracks={audioTracks}
          rtcClient={rtcClient}
          speakingMembers={speakingMembers}
        />
        <MembersJoined
          membersJoined={membersJoined}
          audioTracks={audioTracks}
          displayUserDetails={displayUserDetails}
          isTotalMembersVisible={isTotalMembersVisible}
          rtcClient={rtcClient}
          speakingMembers={speakingMembers}
        />
      </div>
    </div>
  );
}

export default App;
