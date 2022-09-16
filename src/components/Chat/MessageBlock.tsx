import React from 'react';

export default ({sender, message, isUser}) => {
    return (
        <div className={`w-full ${isUser ? 'text-right' : 'text-left'} text-green-600`}>
            {sender.name || sender.id} : {message}
        </div>
    );
};