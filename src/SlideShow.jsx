import React, { useState, useEffect } from 'react';
import Controls from './Controls.jsx';
import ProgressIndicator from './ProgressIndicator.jsx';
import AnimationButtons from './AnimationButtons.jsx';
import './SlideShow.css';

const Slideshow = () => {
    const totalSlides = 31;

    // ⏱ Tiempo total esperado (30 minutos en ms)
    const totalExpectedTime = 1800000;

    // ⏱ Tiempos por slide (en segundos)
    const slideDurations = [
        24, 59, 88, 59, 47, 24, 35, 71, 77, 71,
        65, 106, 71, 71, 35, 71, 53, 24, 59, 65,
        53, 35, 65, 212, 53, 59, 65, 59, 12, 12, 12
    ]; // 31 slides

    const [index, setIndex] = useState(0);
    const [startTime] = useState(Date.now());
    const [elapsedTime, setElapsedTime] = useState(0);
    const [fullscreen, setFullscreen] = useState(false);

    const next = () => setIndex((prev) => (prev + 1) % totalSlides);
    const prev = () => setIndex((prev) => (prev - 1 + totalSlides) % totalSlides);


    // 🔁 Actualiza el tiempo transcurrido cada segundo
    useEffect(() => {
        const interval = setInterval(() => {
            setElapsedTime(Date.now() - startTime);
        }, 1000);
        return () => clearInterval(interval);
    }, [startTime]);

    // 🔴 Tiempo acumulado real por slides
    const realProgressTime = slideDurations
        .slice(0, index)
        .reduce((acc, val) => acc + val * 1000, 0);

    // 🟢 Tiempo transcurrido desde inicio
    const expectedProgressTime = elapsedTime;

    // ⌨ y 🖱 navegación
    useEffect(() => {
        const handleKey = (e) => {
            e.preventDefault();

            if (['ArrowRight', 'ArrowDown','PageDown'].includes(e.key)) next();
            else if (['ArrowLeft', 'ArrowUp', 'PageUp'].includes(e.key)) prev();
            else if (['f', 'Enter', , 'AudioVolumeUp'].includes(e.key)) {
                const elem = document.documentElement;
                if (!document.fullscreenElement) {
                    elem.requestFullscreen();
                    setFullscreen(true);
                } else {
                    document.exitFullscreen();
                    setFullscreen(false);
                }
            }
        };

        const handleClick = (e) => {
            const isInteractive = e.target.closest('button, a, [role="button"], [tabindex]');
            if (isInteractive) return;
            if (e.button === 0) prev();
            else if (e.button === 2) next(); 
        };

        window.addEventListener('keydown', handleKey);
        window.addEventListener('mousedown', handleClick);
        window.addEventListener('contextmenu', (e) => e.preventDefault());

        return () => {
            window.removeEventListener('keydown', handleKey);
            window.removeEventListener('mousedown', handleClick);
            window.removeEventListener('contextmenu', (e) => e.preventDefault());
        };
    }, []);


    useEffect(() => {
        const handleVideoClosed = () => {
            const el = document.documentElement;
            if (!document.fullscreenElement) {
                el.requestFullscreen?.();
                setFullscreen(true);
            }
        };

        window.addEventListener('videoClosed', handleVideoClosed);

        return () => {
            window.removeEventListener('videoClosed', handleVideoClosed);
        };
    }, []);

    return (

        <div className="slideshow-container">
            <Controls onNext={next} onPrev={prev} fullscreen={fullscreen} handleFullscreen={setFullscreen}/>
            <div className="image-wrapper">
                {index === 23 && <AnimationButtons />}
                <ProgressIndicator
                    time={expectedProgressTime}
                    totalTime={totalExpectedTime}
                    top="7.9vh"
                    color="cyan"
                />
                <ProgressIndicator
                    time={realProgressTime}
                    totalTime={totalExpectedTime}
                    top="6.2vh"
                    color="red"
                />
                <img
                    src={`/slides/slide${index + 1}.png`}
                    alt="Slide"
                    className="slide-image"
                />
            </div>
        </div>
    );
};

export default Slideshow;
