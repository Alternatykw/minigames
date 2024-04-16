import './LandingPage.css';
import Navbar from '../components/Navbar';
import FlyoutMenu from '../components/FlyoutMenu';
import BombsGame from '../components/BombsGame';
import { useState } from 'react';
import { useModal } from '../utils/ModalUtils';

const Bombs = () => {

const [isLoggedIn, setIsLoggedIn] = useState(false);
const { isModalOpen, isModalClosing, openModal, closeModal } = useModal();

return(
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
    <div className="content">
        <BombsGame
            isLoggedIn={isLoggedIn}
            openModal={openModal}
        />
    </div>
    </div>
)
};

export default Bombs;