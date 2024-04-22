import './LandingPage.css';
import Navbar from '../components/Navbar';
import FlyoutMenu from '../components/FlyoutMenu';
import { useModal } from '../utils/ModalUtils';
import { useUserData } from '../utils/UserUtils';

const Towers = () => {

    const { isLoggedIn, username, balance, handleLogout, modifyBalance } = useUserData();
const { isModalOpen, isModalClosing, openModal, closeModal } = useModal();

return(
    <div className="landing-page">
        <Navbar
            modifyBalance={modifyBalance}
            handleLogout={handleLogout}
            username={username}
            balance={balance}
            isLoggedIn={isLoggedIn}
            isModalClosing={isModalClosing}
            isModalOpen={isModalOpen}
            openModal={openModal}
            closeModal={closeModal}
        />        <Navbar
        modifyBalance={modifyBalance}
        handleLogout={handleLogout}
        username={username}
        balance={balance}
        isLoggedIn={isLoggedIn}
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