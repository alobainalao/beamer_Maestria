import React, { useEffect } from 'react';
import { FaPlayCircle } from 'react-icons/fa';
import './SlideShow.css';

const AnimationButtons = ({ metodo }) => {
    const videoMap = {
        1: 'h.mp4',
        2: 'v.mp4',
        3: 'c.mp4'
    };

    const openAnimation = (metodo, filename) => {
        const width = window.screen.availWidth;
        const height = window.screen.availHeight;
        window.open(
            `${process.env.PUBLIC_URL}/#/video-player?metodo=${metodo}&video=${filename}`,
            '_blank',
            `width=${width},height=${height},left=0,top=0,toolbar=no,menubar=no,scrollbars=no,resizable=no`
        );
    };

    // Evento para activar el primer video con una tecla
    useEffect(() => {
        const handleKeyDown = (event) => {
            event.preventDefault();
            // Por ejemplo, tecla "a" o "1"
            if (event.key === 'Tab' || event.key === 'b' || event.key === 'B') {
                openAnimation(videoMap[1]);
            }
        };

        window.addEventListener('keydown', handleKeyDown);

        return () => {
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [metodo]);

    return (
        <div className="animation-buttons-vertical">
            {[1, 2, 3].map((n) => (
                <button
                    key={n}
                    className="animation-icon-button"
                    onClick={() => openAnimation(metodo,videoMap[n])}
                    title={`Simulación ${n}`}
                >
                    <FaPlayCircle size={40} />
                </button>
            ))}
        </div>
    );
};

export default AnimationButtons;
