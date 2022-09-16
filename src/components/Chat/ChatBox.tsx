import React, {useContext} from 'react';
import {EngageXContext} from "../../core";
import ChatInput from "./ChatInput";
import MessageBlock from "./MessageBlock";

export default ({isChatBoxVisible, showChatBox}) => {
    const {
        user,
        messages
    } = useContext(EngageXContext);

    return (
        <div className={`fixed flex flex-col h-screen w-1/4 right-0 bg-white ${isChatBoxVisible ? 'block' : 'hidden'}`}>
            <div className=" w-full grid bg-black p-1">
                <button
                    className="bg-white rounded-md px-4 py-1 uppercase m-2"
                    aria-valuenow={0}
                    onClick={() => showChatBox(!isChatBoxVisible)}
                >
                    Close
                </button>
            </div>

            <div className="h-full w-full p-5">
                {messages?.map(({sender, message}, idx) => (
                    <MessageBlock key={`${sender.id}_${idx}`} sender={sender} message={message}
                                  isUser={user?.id === sender?.id}/>
                ))}
            </div>

            <ChatInput/>
        </div>
    );
};