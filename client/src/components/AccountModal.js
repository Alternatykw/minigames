import { useState } from 'react';
import './AccountModal.css';
import axios from 'axios';
import { useUserData } from '../utils/UserUtils';

const AccountModal = ({ action, setAction }) => {
    const { setIsLoggedIn } = useUserData();
    const [forgot, setForgot] = useState(false);
    const [loading, setLoading] = useState(false);
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [message, setMessage] = useState('');
    const [passwordReset, setPasswordReset] = useState(false);

    const handleSubmit = async (event) => {
        event.preventDefault();
        setLoading(true);
        setErrorMessage('');
        const token = localStorage.getItem('token');

        try {
            let response;
            const body = { password }; 
            response = await axios.post('http://localhost:5000/check-password', body, {
                headers: {
                  Authorization: `Bearer ${token}`
                }
            })

            // Check if the response is successful
            if (response.status === 200) {
                if (action === 'daccount') {
                    axios.delete('http://localhost:5000/user', {
                        headers: {
                          Authorization: `Bearer ${token}`
                        }
                    }).then(response => {
                        setMessage(response.message);
                        setTimeout(() => {
                            setAction('');
                            setIsLoggedIn(false);
                            localStorage.removeItem('token');
                            window.location.reload(false);
                        }, 5000);
                    }).catch(error => {
                        console.error('Error deleting user: ', error);
                        setErrorMessage('Error deleting user');
                      });
                } else if(action === 'cpassword') {
                    setPasswordReset(true);
                }
            } else {
                setErrorMessage(response.data.error || 'Something went wrong');
            }
        } catch (error) {
            if (error.response) {
                setErrorMessage(error.response.data.error || 'Something went wrong');
            } else {
                setErrorMessage('Server is not available right now, sorry.');
            }
        } finally {
            setLoading(false);
        }
    };

    const handleForgotClick = () => {
        setForgot(true);
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