import './LandingPage.css';
import Navbar from '../components/Navbar';
import FlyoutMenu from '../components/FlyoutMenu';
import { useState } from 'react';
import { useModal } from '../utils/ModalUtils';

const NotFound = () => {

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
        <h1>Oops, something went wrong.</h1>
        <p>Looks like the page you want to visit doesn't exist.</p>
    </div>
    </div>
)
};

export default NotFound;