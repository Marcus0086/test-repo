import {useContext, useEffect, useState} from "react";
import {EngageXContext} from "../core";
import {BottomButtonStrip, ChatBox, PeerVideo, UserVideo} from "../components";

export default () => {
    const {
        init,
        peers
    } = useContext(EngageXContext);

    const [isChatBoxVisible, showChatBox] = useState(false);

    useEffect(init, []);

    return (
        <div className="grid">
            <div className={`relative h-[92.5vh] bg-neutral-800 ${isChatBoxVisible ? 'w-3/4' : 'w-full'}`}>
                <div id="videos" className="grid grid-rows-2 grid-cols-2 w-full h-full gap-4 p-10 place-items-center">
                    {peers && peers.map(({peerID, peer, peerName, peerPic, videoEnabled}, index) =>
                        <PeerVideo id={peerID} key={index} peer={peer} name={peerName} avatar={peerPic}
                                   videoEnabled={videoEnabled}/>
                    )}
                </div>
                <UserVideo />
            </div>

            <BottomButtonStrip isChatBoxVisible={isChatBoxVisible} showChatBox={showChatBox}/>

            <ChatBox isChatBoxVisible={isChatBoxVisible} showChatBox={showChatBox}/>
        </div>
    );
}

