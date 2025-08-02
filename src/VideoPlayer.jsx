import React, { useEffect, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';
import './VideoPlayer.css';

const videos = [
    { file: '/videos/h.mp4', label: 'Altura piezométrica' },
    { file: '/videos/hv.mp4', label: 'Flujo y piezometría' },
    { file: '/videos/v.mp4', label: 'Flujo del agua' },
    { file: '/videos/cv.mp4', label: 'Flujo y contaminante' },
    { file: '/videos/c.mp4', label: 'Contaminante' }
];

const VideoPlayer = () => {
    const videoRef = useRef(null);
    const location = useLocation();
    const [selected, setSelected] = useState('');
    const [fullscreen, setFullscreen] = useState(false);
    const [isReady, setIsReady] = useState(false);

    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const videoParam = params.get('video');

        if (videoParam && videos.some(v => v.file.endsWith(videoParam))) {
            setSelected(`/videos/${videoParam}`);
        }
    }, [location.search]);

    useEffect(() => {
        if (videoRef.current) {
            videoRef.current.requestFullscreen?.().catch(() => { });
        }
    }, []);


    const handleChange = (e) => {
        setSelected(e.target.value);
    };

    const nextVideo = () => {
        const currentIndex = videos.findIndex(v => v.file === selected);
        if (currentIndex === videos.length - 1) {
            // Notifica a la ventana que abrió esta
            //if (window.opener) {
                //window.opener.dispatchEvent(new Event('videoClosed'));
            //}

            // Intenta cerrar la ventana
            if (window.close) {
                window.close();
            } else {
                setTimeout(() => {
                    alert('Fin del último video. Puedes cerrar la ventana manualmente.');
                }, 500);
            }
        }else {
            const nextIndex = (currentIndex + 1) % videos.length;
            setSelected(videos[nextIndex].file);
        }
    };

    const prevVideo = () => {
        const currentIndex = videos.findIndex(v => v.file === selected);
        const prevIndex = (currentIndex - 1 + videos.length) % videos.length;
        setSelected(videos[prevIndex].file);
    };

    useEffect(() => {
        const handleKey = (e) => {
            if (['ArrowRight', 'ArrowDown', 'PageDown'].includes(e.key)) {
                nextVideo();
            } else if (['ArrowLeft', 'ArrowUp', 'PageUP'].includes(e.key)) {
                prevVideo();
            } else if (['f', 'Enter', 'Tab', 'AudioVolumeUp'].includes(e.key)) {
                const elem = document.documentElement;
                if (!document.fullscreenElement) {
                    elem.requestFullscreen?.().then(() => setFullscreen(true)).catch(() => { });
                } else {
                    document.exitFullscreen?.().then(() => setFullscreen(false)).catch(() => { });
                }
            }
        };

        const handleClick = (e) => {
            const isInteractive = e.target.closest('button, a, [role="button"], [tabindex]');
            if (isInteractive) return;
            if (e.button === 0) {
                prevVideo();
            } else if (e.button === 2) {
                nextVideo();
            }
        };

        window.addEventListener('keydown', handleKey);
        window.addEventListener('mousedown', handleClick);

        return () => {
            window.removeEventListener('keydown', handleKey);
            window.removeEventListener('mousedown', handleClick);
        };
    }, [selected]);

    useEffect(() => {
        setIsReady(false);
    }, [selected]);

    return (
        <div>
            <header className="video-header">
                <h1>Simulaciones en Video</h1>
                <div className="select-wrapper">
                    <select onChange={handleChange} value={selected || ''}>
                        <option value="" disabled hidden>Selecciona un video...</option>
                        {videos.map(({ file, label }) => (
                            <option key={file} value={file}>{label}</option>
                        ))}
                    </select>
                </div>
            </header>

            <main>
                <div className="video-container">
                    {selected && (
                        <video
                            key={selected}
                            ref={videoRef}
                            controls
                            autoPlay
                            muted
                            loop
                            onLoadedData={() => setIsReady(true)}
                            style={{
                                opacity: isReady ? 1 : 0,
                                transition: 'opacity 0.2s ease',
                                position: 'absolute',
                                top: 0,
                                left: 0,
                                height: '100%',
                                width: '100%',
                                backgroundColor: 'white',
                            }}
                        >
                            <source src={selected} type="video/mp4" />
                            Tu navegador no soporta video HTML5.
                        </video>
                    )}
                    <button className="video-button left" onClick={prevVideo}>◀</button>
                    <button className="video-button right" onClick={nextVideo}>▶</button>
                </div>
            </main>

            <footer className="video-footer">
                <p style={{ margin: '1vw'}}>Alexander Lobaina La'O</p>
            </footer>
        </div>
    );
};

export default VideoPlayer;
