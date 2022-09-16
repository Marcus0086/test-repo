import {useContext, useState} from "react";
import {EngageXContext} from "../core";
import {v1 as uuid} from "uuid";
import {Avatar} from "@bigheads/core";

export default () => {
    const [id, setId] = useState("");
    const [userName, setUserName] = useState("");

    const {
        joinRoom,
        userPic
    } = useContext(EngageXContext);

    return (
        <div className="flex flex-col md:flex-row items-center justify-center w-screen h-screen bg-neutral-800 p-10">
            <div className="grid w-96 gap-20 h-full md:w-4/5 place-items-center">
                <h1 className="text-white font-bold font-sans text-8xl">
                    EngageX
                </h1>
                <img className="w-4/5 hidden md:block" src="/4782112.jpg" alt="svg"/>
            </div>
            <div className="grid w-4/5 place-items-center gap-10 h-full md:h-2/3 md:w-96">
                <div className="grid place-items-center w-full h-full rounded-md bg-neutral-900 gap-10 p-5">
                    <div className="w-48 h-48 bg-white rounded-full overflow-hidden">
                        <Avatar {...userPic}/>
                    </div>
                    <div className="grid grid-cols-1 place-items-center justify-center w-full h-full gap-5">
                        <div className="grid place-items-center w-3/4 gap-2">
                            <p className="text-white">Enter Name: </p>
                            <input
                                className="bg-white rounded px-4 py-1 w-full"
                                type="text"
                                onChange={(e) => setUserName(e.target.value)}
                            />
                        </div>
                        <div className="grid place-items-center w-3/4 gap-2">
                            <p className="text-white">Enter Room ID:</p>
                            <input
                                className="bg-white rounded px-4 py-1 w-full"
                                type="text"
                                onChange={(e) => setId(e.target.value)}
                            />
                        </div>
                    </div>
                    <div className="grid grid-cols-2 place-items-center justify-center w-full h-full">
                        <button
                            className="bg-white rounded-md px-4 py-1 uppercase"
                            onClick={joinRoom.bind(null, uuid(), userName)}
                        >
                            Create Room
                        </button>
                        <button
                            className="bg-white rounded-md px-4 py-1 uppercase"
                            onClick={joinRoom.bind(null, id, userName)}
                        >
                            Join Room
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};
