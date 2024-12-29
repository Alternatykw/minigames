import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './AccountModal.css';
import axios from 'axios';

const PasswordChange = ({ userId, username }) => {
    const [loading, setLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [repeatNewPassword, setRepeatNewPassword] = useState('');
    const [passwordsMatch, setPasswordsMatch] = useState(true);
    const [passwordChanged, setPasswordChanged] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        if(newPassword!==repeatNewPassword){
            setPasswordsMatch(false);
            setErrorMessage("Passwords don't match")
        }else{
            setPasswordsMatch(true);
            setErrorMessage('');
        }
    }, [newPassword, repeatNewPassword]);


    const handlePasswordSubmit = async (event) => {
        event.preventDefault();
        setErrorMessage('');
        try {
            let response;
            const body = { newPassword };
            if (userId) body.userId = userId;
            if (username) body.username = username;
            response = await axios.post('http://localhost:5000/passreset', body, {
            });

            if (response.status === 200) {
                setPasswordChanged(true);
                setTimeout(() => {
                    navigate('/');
                    window.location.reload(false);
                }, 3000);
            } else {
                console.error('Error changing password: ', response.data.message);
                setErrorMessage("Error changing the password");
            }
        } catch (error) {
            if (error.response) {
                setErrorMessage("Error changing the password");
            } else {
                setErrorMessage('Server is not available right now, sorry.');
            }
        } finally {
            setLoading(false);
        }
    };

    const handleNewPasswordChange = (event) => {
        setNewPassword(event.target.value);
    };
    const handleRepeatNewPasswordChange = (event) => {
        setRepeatNewPassword(event.target.value);
    };

    return (
        <div className="acc-container">
            { passwordChanged ? (
                <p className="success">Your password has been successfully changed</p>
            ) : (
            <>
                <h2>Enter your new password</h2>
                <form onSubmit={handlePasswordSubmit} method="post" className="password-form">
                    <input
                        type="password"
                        placeholder="New password"
                        value={newPassword}
                        onChange={handleNewPasswordChange}
                        required
                    />
                    <input
                        type="password"
                        placeholder="Repeat new password"
                        value={repeatNewPassword}
                        onChange={handleRepeatNewPasswordChange}
                        required
                    />
                    <button type="submit" disabled={loading || passwordsMatch === false}>
                        {loading ? <div className="spinner"></div> : 'Proceed'}
                    </button>
                    {errorMessage && <p className="error-message">{errorMessage}</p>}
                </form>
            </>
            )}
        </div>
    );
    
     
}

export default PasswordChange;