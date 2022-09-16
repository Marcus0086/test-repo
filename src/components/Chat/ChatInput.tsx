import React, {useContext, useState} from 'react';
import {EngageXContext} from "../../core";

export default  () => {
    const {
        user,
        sendMessage
    } = useContext(EngageXContext);

    const [message, setMessage] = useState("");

    return (
        <div className=" w-full grid bg-black p-5">
            <input
                className="rounded" name="message"
                onChange={(e) => setMessage(e.target.value)}
            />
            <button
                className="bg-white rounded-md px-4 py-1 uppercase m-2"
                onClick={() => {
                    sendMessage(user, message);
                    setMessage("");
                }}
            >
                send
            </button>
        </div>
    );
};