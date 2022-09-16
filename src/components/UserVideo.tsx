import React, {useContext} from 'react';
import {EngageXContext} from "../core";
import {Avatar} from "@bigheads/core";

export default () => {
    const {
        localVideo,
        videoEnabled,
        user
    } = useContext(EngageXContext);

    return (
        <div
            className="absolute right-5 bottom-5 w-2/12 aspect-video rounded-md
            overflow-hidden max-w-screen-md bg-black grid place-items-center gap-5"
        >
            {videoEnabled ?
                <video muted ref={localVideo} style={{pointerEvents: "none"}} autoPlay playsInline/> :
                <div className="h-2/3 w-1/3">
                    <div className="w-full h-11/12 bg-white rounded-full overflow-hidden">
                        <Avatar {...user.avatar}/>
                    </div>
                    <p className="text-white w-full text-center">{user.name}</p>
                </div>
            }
        </div>
    );
};