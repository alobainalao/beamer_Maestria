import React, { useEffect } from 'react';
import { FaPlayCircle } from 'react-icons/fa';
import './SlideShow.css';

const AnimationButtons = () => {
    const videoMap = {
        1: 'h.mp4',
        2: 'hv.mp4',
        3: 'v.mp4',
        4: 'cv.mp4',
        5: 'c.mp4'
    };

    const openAnimation = (filename) => {
        const width = window.screen.availWidth;
        const height = window.screen.availHeight;
        window.open(
            `/video-player?video=${filename}`,
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
    }, []);

    return (
        <div className="animation-buttons-vertical">
            {[1, 2, 3, 4, 5].map((n) => (
                <button
                    key={n}
                    className="animation-icon-button"
                    onClick={() => openAnimation(videoMap[n])}
                    title={`Simulación ${n}`}
                >
                    <FaPlayCircle size={40} />
                </button>
            ))}
        </div>
    );
};

export default AnimationButtons;
