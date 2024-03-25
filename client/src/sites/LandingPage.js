import './LandingPage.css';
import Navbar from '../components/Navbar';
import FlyoutMenu from '../components/FlyoutMenu';


const LandingPage = () => {
return(
    <div className="landing-page">
        <Navbar />
        <FlyoutMenu />
    <div className="content">
        <h1>Welcome to our Dark Themed Landing Page</h1>
        <p>This is a sample landing page built with React, featuring a dark theme.</p>
    </div>
    </div>
)
};

export default LandingPage;