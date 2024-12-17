import { useState } from 'react';
import './AccountModal.css';
const AccountModal = ({ action, setAction }) => {
    const [isButtonClicked, setIsButtonClicked] = useState(false);
    const [loading, setLoading] = useState(false);
    const [password, setPassword] = useState(false);
    const [errorMessage, setErrorMessage] = useState(false);
    const handleSubmit = () => {

    }

    const handleForgotClick = () => {

    }

    const handlePasswordChange = (event) => {
        setPassword(event.target.value);
    };

    return (
        <div className="acc-container">
            <h2>Enter your password to proceed</h2>
            <form onSubmit={handleSubmit} method="post" className="password-form">
                <input
                    type="password"
                    placeholder="password"
                    value={password}
                    onChange={handlePasswordChange}
                    required
                />

                <button type="submit" disabled={loading}>
                    {loading ? <div className="spinner"></div> : 'Proceed'}
                </button>
                {errorMessage && <p className="error-message">{errorMessage}</p>}
                <p onClick={handleForgotClick} className="pass-forgot">
                    Forgot your password?
                </p>
            </form>
        </div>
    );   
}

export default AccountModal;