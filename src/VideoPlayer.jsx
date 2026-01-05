import React, { useEffect, useRef, useState, useMemo } from 'react';
import { useLocation } from 'react-router-dom';
import './VideoPlayer.css';

const base = process.env.PUBLIC_URL;

const videos = [
  { filename: 'h.mp4', label: 'Altura piezométrica' },
  { filename: 'v.mp4', label: 'Flujo del agua' },
  { filename: 'c.mp4', label: 'Contaminante' }
];

const VideoPlayer = () => {
  const videoRef = useRef(null);
  const location = useLocation();

  const [folder, setFolder] = useState('videos');
  const [selected, setSelected] = useState('');
  const [isReady, setIsReady] = useState(false);
  const [fullscreen, setFullscreen] = useState(false);

  // 👉 leer metodo y video desde la URL
  useEffect(() => {
    const params = new URLSearchParams(location.search);

    const metodoParam = params.get('metodo');
    const videoParam = params.get('video');
    const flder = metodoParam === 'mef' ? 'videos' : 'videos_bfr';

    if (metodoParam) {
      setFolder(flder);
    }

    if (videoParam) {
      setSelected(`${process.env.PUBLIC_URL}/${flder}/${videoParam}`);
    }
  }, [location.search]);

  // 👉 construir rutas finales
  const videosFinal = useMemo(
    () =>
      videos.map(v => ({
        ...v,
        file: `${base}/${folder}/${v.filename}`
      })),
    [folder]
  );

  // 👉 cuando cambia metodo o filename, resolver video real
  useEffect(() => {
    if (!selected) return;

    const found = videosFinal.find(v => v.filename === selected);
    if (found) {
      setSelected(found.file);
    }
  }, [videosFinal]);

  // fullscreen inicial
  useEffect(() => {
    videoRef.current?.requestFullscreen?.().catch(() => {});
  }, []);

  const handleChange = (e) => {
        setSelected(e.target.value);
    };

    const nextVideo = () => {
        const currentIndex = videos.findIndex(v => selected.endsWith(v.filename));

        if (currentIndex === videos.length - 1) {

            // Intenta cerrar la ventana
            if (window.close) {
                window.close();
            } else {
                setTimeout(() => {
                    alert('Fin del último video. Puedes cerrar la ventana manualmente.');
                }, 500);
            }
        }else {
            const nextIndex = (currentIndex + 1 + videosFinal.length) % videosFinal.length;
            setSelected(videosFinal[nextIndex].file);
        }
    };

    const prevVideo = () => {
        const currentIndex = videos.findIndex(v => selected.endsWith(v.filename));
        const prevIndex = (currentIndex - 1 + videosFinal.length) % videosFinal.length;
        setSelected(videosFinal[prevIndex].file);
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
            {videosFinal.map(({ file, label }) => (
                <option key={file} value={file}>{label}</option>
            ))}
            </select>
        </div>
      </header>

      <main>
        <div className="video-container">
          {selected && selected.endsWith('.mp4') && (
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
            </video>
          )}
          <button className="video-button left" onClick={prevVideo}>◀</button>
          <button className="video-button right" onClick={nextVideo}>▶</button>
        </div>
      </main>

      <footer className="video-footer">
        <p style={{ margin: '1vw' }}>Alexander Lobaina La'O</p>
      </footer>
    </div>
  );
};

export default VideoPlayer;
