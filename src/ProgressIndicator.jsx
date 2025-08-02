import React from 'react';
import './SlideShow.css';

const ProgressIndicator = ({ time, totalTime, top = '8vh', color= 'blue' }) => {
    const percent = Math.min((time / totalTime) * 100, 100);

    return (
        <div className="progress-indicator" style={{ top }}>
            <div className="progress-bar-bg">
                <div
                    className="progress-bar-actual"
                    style={{
                        left: `${percent}%`,
                        backgroundColor: color
                    }}
                ></div>
            </div>
        </div>
    );
};

export default ProgressIndicator;
