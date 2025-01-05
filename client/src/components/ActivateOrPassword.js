import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import './AccountModal.css';
import axios from 'axios';
import PasswordChange from './PasswordChange';

const ActivateOrPassword = ({ codeAction }) => {
    const [loading, setLoading] = useState(false);
    const [code, setCode] = useState('');
    const [codeCorrect, setCodeCorrect] = useState(false);
    const [userId, setUserId] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [activated, setActivated] = useState(false);
    const [infoMessage, setInfoMessage] = useState('Send code again');
    const [loggedIn, setLoggedIn] = useState(true);
    const navigate = useNavigate();

    const checkCode = useCallback(async (codeToCheck) => {
        setLoading(true);
        try {
            let response;
            const body = { code: codeToCheck }; 
            if(codeAction==="reset"){
                response = await axios.post('http://localhost:5000/passcode', body, {});
            }else if(codeAction==="activate"){
                const token = localStorage.getItem('token'); 
                response = await axios.post('http://localhost:5000/activate', body, {
                  headers: {
                    Authorization: `Bearer ${token}`
                  }
                });
            }

            if (response.status === 200) {
                if(codeAction==="reset"){
                    setCodeCorrect(true);
                    setUserId(response.data.userId);
                }else if (codeAction==="activate"){
                    setActivated(true);
                    setTimeout(() => {
                        navigate('/');
                        window.location.reload(false);
                    }, 3000);
                }
            }else if(response.status === 201){
                navigate('/');
            }else if(response.status === 401){
                setLoggedIn(false);
            } else {
                console.error('Error checking the code: ', response.data.message);
                setErrorMessage("The code you provided isn't correct");
            }
        } catch (error) {
            if (error.response) {
                console.log(error.response.data.message);
                setErrorMessage(error.response.data.message);
              } else {
                setErrorMessage("The code you provided isn't correct");
              }
        } finally {
            setLoading(false);
        }

    }, [codeAction, navigate]);

    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        const queryCode = urlParams.get('code');
        if (queryCode) {
            const correctedCode = queryCode.replace(' ', '+');
            const decodedCode = decodeURIComponent(correctedCode); 
            setCode(decodedCode);
            if(!loading){
                checkCode(decodedCode);
            }
        }
    }, []);

    const handleSubmit = async (event) => {
        event.preventDefault();
        setErrorMessage('');
        checkCode(code);
    };

    const handleCodeChange = (event) => {
        setCode(event.target.value);
    };

    const handleSendCode = async () => {
        try {
            const token = localStorage.getItem('token'); 
    
            let response = await axios.post('http://localhost:5000/sendagain', null, { 
                headers: {
                    Authorization: `Bearer ${token}`
                }
             });
            if (response.status === 200) {
                setInfoMessage('Code has been sent')
                setTimeout(() => {
                    setInfoMessage('Send code again');
                }, 5000);
            } else {
                console.error('Error sending the code: ', response.data.message);
                setErrorMessage("There was an error sending the code");
            }
        }catch (error) {
            if (error.response) {
                setErrorMessage("There was an error sending the code");
            } else {
                setErrorMessage('Server is not available right now, sorry.');
            }
        }
    };

    return (
        <div className={codeCorrect ? "" : "acc-container"}>
            {codeCorrect ? (
                <PasswordChange 
                    userId={userId}
                />
            ) : (
                loggedIn ? (
                    activated ? (
                        <p className="success">Your account has been successfully activated</p>
                    ) : (
                    <>
                        {codeAction==="activate" ? <h2>Enter code sent to your email to activate your account</h2> : <h2>Enter code sent to your email to reset your password</h2>}
                        <form onSubmit={handleSubmit} method="post" className="password-form">
                            <input
                                type="text"
                                placeholder="Code"
                                value={code}
                                onChange={handleCodeChange}
                                required
                            />
                            <button type="submit" disabled={loading}>
                                {loading ? <div className="spinner"></div> : 'Proceed'}
                            </button>
                            {errorMessage && <p className="error-message">{errorMessage}</p>}
                            {codeAction === "activate" && (
                                <p className="pass-forgot" onClick={handleSendCode}>
                                    {infoMessage}
                                </p>
                            )}
                        </form>
                    </>
                    )
                ) : (
                    <p className="error">You need to be logged in to activate an account</p>
                )
            )}
        </div>
    );
    
     
}

export default ActivateOrPassword;