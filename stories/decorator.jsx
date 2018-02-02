import React from 'react';

const style = {
    width: '100%',
    height: '100%'
};

export default function Decorator(story) {
    return (
        <div style={style}>
            {story()}
        </div>
    );
}
