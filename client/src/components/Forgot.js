import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './AccountModal.css';
import axios from 'axios';

const Forgot = () => {
    const [loading, setLoading] = useState(false);
    const [email, setEmail] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (event) => {
        event.preventDefault();
        setLoading(true);
        setErrorMessage('');
        const token = localStorage.getItem('token');

        try {
            let response;
            const body = { email }; 
            response = await axios.post('http://localhost:5000/passlink', body, {
                headers: {
                  Authorization: `Bearer ${token}`
                }
            })

            if (response.status === 200) {
                navigate('/passreset');
            } else {
                console.error('Error sending password link: ', response.data.error);
                setErrorMessage("This email hadn't been registered yet");
            }
        } catch (error) {
            if (error.response) {
                setErrorMessage("This email hadn't been registered yet");
            } else {
                setErrorMessage('Server is not available right now, sorry.');
            }
        } finally {
            setLoading(false);
        }
    };

    const handleEmailChange = (event) => {
        setEmail(event.target.value);
    };

    return (
        <div className="acc-container">
            <h2>Enter the email to reset your password</h2>
            <form onSubmit={handleSubmit} method="post" className="password-form">
                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={handleEmailChange}
                    required
                />
                <button type="submit" disabled={loading}>
                    {loading ? <div className="spinner"></div> : 'Proceed'}
                </button>
                {errorMessage && <p className="error-message">{errorMessage}</p>}
            </form>
        </div>
    );   
}

export default Forgot;