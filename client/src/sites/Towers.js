import './LandingPage.css';
import Navbar from '../components/Navbar';
import FlyoutMenu from '../components/FlyoutMenu';
import { useState } from 'react';
import { useModal } from '../utils/ModalUtils';

const Towers = () => {

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
        <h1>Welcome to our Dark Themed Landing Page</h1>
        <p>There will be towers.</p>
    </div>
    </div>
)
};

export default Towers;