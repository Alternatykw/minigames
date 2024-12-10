import './LandingPage.css';
import Navbar from '../components/Navbar';
import FlyoutMenu from '../components/FlyoutMenu';
import { useModal } from '../utils/ModalUtils';
import { useUserData } from '../utils/UserUtils';
import Account from '../components/Account';

const AccountPage = () => {

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
        <Account
            user={user}
        />
    </div>
    </div>
)
};

export default AccountPage;