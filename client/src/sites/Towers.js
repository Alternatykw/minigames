import './LandingPage.css';
import Navbar from '../components/Navbar';
import FlyoutMenu from '../components/FlyoutMenu';


const Towers = () => {
return(
    <div className="landing-page">
        <Navbar />
        <FlyoutMenu />
    <div className="content">
        <h1>Welcome to our Dark Themed Landing Page</h1>
        <p>There will be towers.</p>
    </div>
    </div>
)
};

export default Towers;