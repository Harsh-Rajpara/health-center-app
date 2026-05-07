// src/pages/Home.jsx
import React from 'react';
import HeroSlider from '../../components/HeroSlider';
import About from './About';
import Appointment from './Appointment';
import Contact from './Contact';
import DoctorsSection from './DoctorsSection';
import NewsSection from './NewsSection';

const Home = () => {
    return (
        <div>
            <section id="home"><HeroSlider /></section>
            
            <section id="about"><About /></section>
            
            <section id="doctors"><DoctorsSection /></section>

            <section id="news"><NewsSection /></section>

            <section id="appointment"><Appointment /></section>
            
            <section id="contact"><Contact /></section>
        </div>
    );
};

export default Home;