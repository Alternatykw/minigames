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
        <h1>Welcome to our Dark Themed Landing Page</h1>
        <p>There will be bombs.</p>
    </div>
    </div>
)
};

export default Bombs;