import React, { useState } from 'react';
import './LandingPage.css';
import Navbar from '../components/Navbar';
import FlyoutMenu from '../components/FlyoutMenu';
import Slider from '../components/Slider';
import { useModal } from '../utils/ModalUtils';

const LandingPage = () => {
    
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const { isModalOpen, isModalClosing, openModal, closeModal } = useModal();

    return (
        <div className="landing-page">
            <Navbar
                isLoggedIn={isLoggedIn}
                setIsLoggedIn={setIsLoggedIn}
                isModalClosing={isModalClosing}
                isModalOpen={isModalOpen}
                openModal={openModal}
                closeModal={closeModal}
            />
            <FlyoutMenu /> 
            <Slider />
        </div>
    );
};

export default LandingPage;
