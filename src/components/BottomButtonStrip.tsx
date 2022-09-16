import React, {useContext} from 'react';
import {EngageXContext} from "../core";

export default ({ isChatBoxVisible, showChatBox }) => {
    const {
        toggleAudio,
        toggleVideo,
        toggleScreen
    } = useContext(EngageXContext);

    return (
        <div className="flex h-[7.5vh] items-center justify-between bg-neutral-900 px-5">
            <div/>
            <div className="flex h-full items-center justify-center gap-5">
                <button
                    id="toggle-audio"
                    className="bg-white rounded-md px-4 py-1 uppercase"
                    onClick={toggleAudio}
                >
                    Unmuted
                </button>
                <button
                    id="toggle-video"
                    className="bg-white rounded-md px-4 py-1 uppercase"
                    onClick={toggleVideo}
                >
                    Video Enabled
                </button>
                <button
                    id="toggle-screen"
                    className="bg-white rounded-md px-4 py-1 uppercase"
                    aria-valuenow={0}
                    onClick={toggleScreen}
                >
                    SCREEN SHARE
                </button>
                <button
                    id="leave"
                    className="bg-red-600 text-white rounded-md px-4 py-1 uppercase"
                    onClick={() => history.back()}
                >
                    Leave
                </button>
            </div>
            <div>
                <button
                    className="bg-sky-200 rounded-md px-4 py-1 uppercase"
                    aria-valuenow={0}
                    onClick={() => showChatBox(!isChatBoxVisible)}
                >
                    Chat
                </button>
            </div>
        </div>
    );
};