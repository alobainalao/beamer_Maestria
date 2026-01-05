import React from 'react';
import './SlideShow.css';
import { FaExpandArrowsAlt, FaCompressArrowsAlt } from 'react-icons/fa';

const Controls = ({ onNext, onPrev, fullscreen, handleFullscreen}) => {

    const toggleFullscreen = () => {
        const elem = document.documentElement;
        if (!document.fullscreenElement) {
            elem.requestFullscreen();
            handleFullscreen(true);
        } else {
            document.exitFullscreen();
            handleFullscreen(false);
        }
    };

    return (
        <div className="controls-overlay">
            {/*<button className="icon-button" onClick={onPrev} title="Anterior">*/}
            {/*    ⬅*/}
            {/*</button>*/}

            {/*<button className="icon-button" onClick={onNext} title="Siguiente">*/}
            {/*    ➡*/}
            {/*</button>*/}

            <button className="icon-button" onClick={toggleFullscreen} title="Modo presentación">
                {fullscreen ? <FaCompressArrowsAlt size={20} /> : <FaExpandArrowsAlt size={20} />}
            </button>
        </div>
    );
};

export default Controls;
