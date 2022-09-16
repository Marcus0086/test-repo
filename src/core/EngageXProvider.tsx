import React, {createContext, useEffect, useRef, useState} from 'react';
import io from "socket.io-client";
import Peer from "simple-peer";
import {config, logger} from "../utils";
import {useRouter} from "next/router";
import {getRandomOptions} from "../components/RandomAvatar";

const EngageXContext = createContext(null);
const socket = io(config.socketURL);

function EngageXProvider({children}) {
    const router = useRouter();
    const {id, name = ""} = router.query;

    const [peers, setPeers] = useState([]);
    const [videoEnabled, setVideoEnabled] = useState(true);
    const [userAvatar, setUserAvatar] = useState({});
    const [user, setUser] = useState({});
    const [messages, setMessages] = useState([]);

    const localStream = useRef<MediaStream>();
    const localVideo = useRef<HTMLVideoElement>();
    const peersRef = useRef<Peer>({});
    const messagesRef = useRef([]);

    useEffect(() => {
        setUserAvatar(getRandomOptions());
        socket.on("connection-successful", (id, callback) => {
            logger.log("SOCKET CONNECTED: ", id);
            callback();
        });

        socket.on("room-exist", ({msg}) => {
            logger.log(msg);
        });

        socket.on("add-user", addUser);

        socket.on("user-joined", ({signal, caller}) => {
            logger.log("user-joined: ", caller, signal);
            peersRef.current[caller.id] = {
                peerID: caller.id,
                peer: addPeer(signal, caller.id),
                peerName: caller.name,
                avatar: caller.avatar,
                // videoEnabled: true
            };
            setPeers([...Object.values(peersRef.current)]);
        });

        socket.on("receiving-returned-signal", ({signal, id}) => {
            const item = peersRef.current[id];
            item.peer.signal(signal);
            logger.log("receiving returned signal: ", item, signal);
        });

        socket.on('remove-peer', (userId) => {
            const videoEl: any = document.getElementById(userId);
            if (videoEl) {
                if (videoEl.srcObject) {
                    const tracks = videoEl.srcObject.getTracks();
                    tracks.forEach((track) => track.stop());
                    videoEl.srcObject = null;
                }
                videoEl.parentNode.parentNode.removeChild(videoEl.parentNode);
            }
            let item = peersRef.current[userId];
            if (item && item.peer) {
                item.peer.destroy();
                peersRef.current[userId] = Object.values(peersRef.current).filter((peer: any) => peer.peerID === userId);
                logger.log("removed-peer: ", userId);
            }
        });

        socket.on('receive-message', ({sender, message}) => {
            if(socket.id === sender.id) return;
            if (message) {
                messagesRef.current.push({sender, message});
                setMessages(messagesRef.current);
            }

        });

        socket.on('receive-video-is-enabled', (id, isEnabled) => {
            if(socket.id === id) return;
            peersRef.current[id].videoEnabled = isEnabled;
            setPeers([...Object.values(peersRef.current)]);
        });
    }, []);

    const init = () => {
        navigator.mediaDevices
            .getUserMedia(config.videoConstraints)
            .then(currentStream => {
                localStream.current = currentStream;
                localVideo.current.srcObject = currentStream;
                toggleAudio();
                toggleVideo();
                if (id) joinRoom(id, name as string);
            })
            .catch(err => logger.error(err));

        return () => {
            cleanUp();
        }
    };

    useEffect(() => {
        if (id) joinRoom(id, name as string);
    }, [id]);

    const joinRoom = (roomId, name = "") => {
        setUser({name, id: socket.id, avatar: userAvatar});
        router
            .push(`/${roomId}?name=${name}`)
            .then(() => socket.emit("join-room", {roomID: roomId, name, avatar: userAvatar}));
    };

    const addUser = users => {
        users.forEach(u => {
            if (u.id === socket.id) return;
            peersRef.current[u.id] = {
                peerID: u.id,
                peer: createPeer(u.id, {name, id: socket.id, avatar: userAvatar}),
                peerName: u.name,
                avatar: u.avatar,
                // videoEnabled: true
            };
        });
        setPeers([...Object.values(peersRef.current)]);
    };

    const createPeer = (userToSignal, caller) => {
        const peer = new Peer({
            initiator: true,
            trickle: false,
            channelName: id,
            stream: localStream.current,
            config: config.newConfig
        });

        peer.on("signal", signal => {
            logger.log("sending signal: ", caller, userToSignal, signal);
            socket.emit("sending-signal", {userToSignal, caller, signal});
        });

        return peer;
    };

    const addPeer = (incomingSignal, callerID) => {
        const peer = new Peer({
            initiator: false,
            trickle: false,
            channelName: id,
            stream: localStream.current,
            config: config.newConfig
        });

        peer.on("signal", signal => {
            logger.log("returning signal: ", callerID, incomingSignal, signal);
            socket.emit("returning-signal", {callerID, signal});
        });

        peer.signal(incomingSignal);

        return peer;
    };

    const toggleAudio = () => {
        const toggleButton = document.getElementById("toggle-audio");
        for (let index in localStream.current.getAudioTracks()) {
            localStream.current.getAudioTracks()[index].enabled = !localStream.current.getAudioTracks()[index].enabled
            toggleButton.innerText = localStream.current.getAudioTracks()[index].enabled ? "Unmuted" : "Muted"
        }
    }

    const toggleVideo = () => {
        const toggleButton = document.getElementById("toggle-video");
        for (let index in localStream.current.getVideoTracks()) {
            localStream.current.getVideoTracks()[index].enabled = !localStream.current.getVideoTracks()[index].enabled
            if(localStream.current.getVideoTracks()[index].enabled){
                navigator.mediaDevices.getUserMedia(config.videoConstraints).then((stream) => switchVideo(stream, true));
                toggleButton.innerText = "Video Enabled";
                // socket.emit('receive-video-is-enabled', true);
            } else {
                localStream.current.getVideoTracks()[index].stop();
                toggleButton.innerText = "Video Disabled";
                // socket.emit('receive-video-is-enabled', false);
            }
        }
        setVideoEnabled(!videoEnabled);
    }

    const toggleScreen = () => {
        const toggleButton = document.getElementById("toggle-screen");
        if(toggleButton.ariaValueNow === "1") {
            navigator.mediaDevices.getUserMedia(config.videoConstraints).then(switchVideo);
        } else {
            navigator.mediaDevices.getDisplayMedia(config.screenConstraints).then(switchVideo);
        }
    }

    const switchVideo = (stream, isVideo = false) => {
        const toggleButton = document.getElementById("toggle-screen");
        if (!isVideo) {
            if (toggleButton.ariaValueNow === "0") {
                toggleButton.ariaValueNow = "1";
                toggleButton.innerText = "STOP SHARING";
            } else {
                toggleButton.ariaValueNow = "0";
                toggleButton.innerText = "SHARE SCREEN";
            }
        }
        for (let socket_id in peersRef.current) {
            if(peersRef.current[socket_id].peer) {
                for (let index in peersRef.current[socket_id].peer.streams[0]?.getTracks()) {
                    for (let index2 in stream.getTracks()) {
                        if (peersRef.current[socket_id].peer.streams[0]?.getTracks()[index].kind === stream.getTracks()[index2].kind) {
                            peersRef.current[socket_id].peer
                                .replaceTrack(
                                    peersRef.current[socket_id].peer.streams[0]?.getTracks()[index],
                                    stream.getTracks()[index2],
                                    peersRef.current[socket_id].peer.streams[0]
                                );
                            stream.getTracks()[index2].onended = () => {
                                navigator.mediaDevices.getUserMedia(config.videoConstraints).then(switchVideo);
                                toggleButton.ariaValueNow = "0";
                                toggleButton.innerText = "SHARE SCREEN";
                            };
                            break;
                        }
                    }
                }
            }
        }
        localStream.current = stream;

        localVideo.current.srcObject = stream;
    }

    const retryVideo = () => {
        const toggleButton = document.getElementById("toggle-screen");
        toggleVideo();
        toggleAudio();

        navigator.mediaDevices.getUserMedia(config.videoConstraints).then(switchVideo);

        toggleButton.ariaValueNow = "0";
        toggleButton.innerText = "SHARE SCREEN";
    }

    const sendMessage = (sender, message) => {
        if (message) {
            messagesRef.current.push({sender, message});
            setMessages(messagesRef.current);
            socket.emit('send-message', {sender, message});
        }
    }

    const cleanUp = () => {
        localStream.current.getTracks().forEach((tracks) => tracks.stop());
        setUser({});
        setPeers([]);
        setUserAvatar(getRandomOptions());
        setMessages([]);
    }

    return (
        <EngageXContext.Provider
            value={{
                init,
                socket,
                localVideo,
                localStream,
                joinRoom,
                peers,
                toggleAudio,
                toggleVideo,
                toggleScreen,
                retryVideo,
                videoEnabled,
                setVideoEnabled,
                userAvatar,
                name,
                messages,
                setMessages,
                user,
                sendMessage,
                messagesRef,
                cleanUp
            }}
        >
            {children}
        </EngageXContext.Provider>
    );
}

export {EngageXProvider, EngageXContext};
