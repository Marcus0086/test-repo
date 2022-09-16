import React, {useEffect, useRef} from 'react';

export default ({id, peer, name, avatar, videoEnabled}) => {
    const ref = useRef<HTMLVideoElement>();
    useEffect(() => peer && peer.on("stream", stream => ref.current && (ref.current.srcObject = stream)), []);
    return (
        <div
            className="
                        rounded-md overflow-hidden h-full w-full grid place-items-center
                        gap-5 object-contain bg-black
                    "
        >
            <video id={id} className="aspect-video" playsInline style={{pointerEvents: "none"}} autoPlay ref={ref}/>
            {/*{videoEnabled ?*/}
            {/*    <video className="aspect-video" id={id} playsInline style={{pointerEvents: "none"}} autoPlay ref={ref}/> :*/}
            {/*    <div className="h-1/4 w-1/4" id={id}>*/}
            {/*        {avatar && <RandomAvatar {...avatar}/>}*/}
            {/*        {name && <p className="text-white w-full text-center">{name}</p>}*/}
            {/*    </div>*/}
            {/*}*/}
            {/*<div className="h-1/4 w-1/4" id={id}>*/}
            {/*    {avatar && <RandomAvatar {...avatar}/>}*/}
            {/*    {name && <p className="text-white w-full text-center">{name}</p>}*/}
            {/*</div>*/}
        </div>
    );
}