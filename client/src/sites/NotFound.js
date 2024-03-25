import './LandingPage.css';
import Navbar from '../components/Navbar';
import FlyoutMenu from '../components/FlyoutMenu';


const NotFound = () => {
return(
    <div className="landing-page">
        <Navbar />
        <FlyoutMenu />
    <div className="content">
        <h1>Oops, something went wrong.</h1>
        <p>Looks like page you want to visit doesn't exist.</p>
    </div>
    </div>
)
};

export default NotFound;