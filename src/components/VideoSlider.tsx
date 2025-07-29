import React, { useState, useEffect } from 'react';
import Slider from 'react-slick';
import styles from '../styles/VideoSlider.module.css';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

const VideoSlider = () => {
    const [videos] = useState([
        { 
            src: '/video1.mp4', 
            title: 'AI Job Interview Preparation',
            thumbnail: '/images/ai-solutions/interview.png',
            description: 'Get AI-powered mock interviews and feedback to ace your next job interview.'
        },
        { 
            src: '/video2.mp4', 
            title: 'College Ranking Based on Placements',
            thumbnail: '/images/ai-solutions/college.png',
            description: 'Discover the best colleges based on placement statistics and alumni success.'
        },
        { 
            src: 'video3.mp4', 
            title: 'Stock Decision-Making Assistance',
            thumbnail: '/images/ai-solutions/stocks.png',
            description: 'AI-driven insights for smarter investment decisions in the stock market.'
        },
    ]);

    const [activeSlide, setActiveSlide] = useState(0);
    const [isPlaying, setIsPlaying] = useState(true);

    const settings = {
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1,
        autoplay: true,
        autoplaySpeed: 5000,
        pauseOnHover: true,
        beforeChange: (current: number, next: number) => setActiveSlide(next),
        responsive: [
            {
                breakpoint: 768,
                settings: {
                    arrows: false,
                    dots: true
                }
            }
        ]
    };

    return (
        <div className={styles.videoSlider}>
            <h2>Watch Our Solutions in Action</h2>
            <Slider {...settings}>
                {videos.map((video, index) => (
                    <div key={index} className={styles.slide}>
                        <div className={styles.videoContainer}>
                            <video 
                                controls 
                                autoPlay={isPlaying && activeSlide === index}
                                muted
                                loop
                                playsInline
                                poster={video.thumbnail}
                                onPlay={() => setIsPlaying(true)}
                                onPause={() => setIsPlaying(false)}
                            >
                                <source src={video.src} type="video/mp4" />
                                Your browser does not support the video tag.
                            </video>
                        </div>
                        <div className={styles.videoInfo}>
                            <h3>{video.title}</h3>
                            <p>{video.description}</p>
                        </div>
                    </div>
                ))}
            </Slider>
        </div>
    );
};

export default VideoSlider;