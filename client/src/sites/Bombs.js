import './LandingPage.css';
import Navbar from '../components/Navbar';
import FlyoutMenu from '../components/FlyoutMenu';
import BombsGame from '../components/BombsGame';
import { useModal } from '../utils/ModalUtils';
import { useUserData } from '../utils/UserUtils';

const Bombs = () => {

const { isLoggedIn, user, handleLogout, modifyBalance } = useUserData();
const { isModalOpen, isModalClosing, openModal, closeModal } = useModal();

return(
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
    <div className="content">
        <BombsGame
            user={user}
            isLoggedIn={isLoggedIn}
            openModal={openModal}
            modifyBalance={modifyBalance}
        />
    </div>
    </div>
)
};

export default Bombs;