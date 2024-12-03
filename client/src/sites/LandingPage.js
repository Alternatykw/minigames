import React from 'react';
import './LandingPage.css';
import Navbar from '../components/Navbar';
import FlyoutMenu from '../components/FlyoutMenu';
import Slider from '../components/Slider';
import { useModal } from '../utils/ModalUtils';
import { useUserData } from '../utils/UserUtils';

const LandingPage = () => {
    
    const { isLoggedIn, user, handleLogout, modifyBalance } = useUserData();
    const { isModalOpen, isModalClosing, openModal, closeModal } = useModal();

    return (
        <div className="landing-page">
        <Navbar
            modifyBalance={modifyBalance}
            handleLogout={handleLogout}
            user={user}
            isLoggedIn={isLoggedIn}
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
