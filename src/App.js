import React from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import Slideshow from './SlideShow';
import VideoPlayer from './VideoPlayer';

const App = () => {
    return (
        <Router >
            <Routes>
                <Route path="/" element={<Slideshow />} />
                <Route path="/video-player" element={<VideoPlayer />} />
            </Routes>
        </Router>
    );
};

export default App;
