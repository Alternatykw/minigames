import './LandingPage.css';
import Navbar from '../components/Navbar';
import FlyoutMenu from '../components/FlyoutMenu';
import BombsGame from '../components/BombsGame';


const Bombs = () => {
return(
    <div className="landing-page">
        <Navbar />
        <FlyoutMenu />
    <div className="content">
        <BombsGame />
    </div>
    </div>
)
};

export default Bombs;