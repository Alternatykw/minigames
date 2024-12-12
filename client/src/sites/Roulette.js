import './LandingPage.css';
import Navbar from '../components/Navbar';
import FlyoutMenu from '../components/FlyoutMenu';
import { useModal } from '../utils/ModalUtils';
import { useUserData } from '../utils/UserUtils';
import RouletteGame from '../components/RouletteGame';

const Roulette = () => {

const { isLoggedIn, user, handleLogout, modifyBalance, setUser } = useUserData();
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
        <RouletteGame
            user={user}
            setUser={setUser}
            isLoggedIn={isLoggedIn}
            openModal={openModal}
        />
    </div>
    </div>
)
};

export default Roulette;