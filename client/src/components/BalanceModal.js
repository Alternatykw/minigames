import { useState } from 'react';
import './BalanceModal.css';
const BalanceModal = ({ modifyBalance }) => {
    const [isButtonClicked, setIsButtonClicked] = useState(false);
    const [money, setMoney] = useState();

    const handleBalanceButton = (value) => {
        modifyBalance(value, 'topup');
        setIsButtonClicked(true);
        setMoney(value);
    }
    return (
        <div onClick={(event) => event.stopPropagation()}>
            {isButtonClicked? (
                <div className="balance-added">
                    <p>Balance ({money}) has been added.</p>
                    <button onClick={() => setIsButtonClicked(false)}>OK</button>
                </div>
            ) :  
                <div className="b-container">
                    <h1>How much balance to add?</h1>
                    <button onClick={() => handleBalanceButton(1000)}>1000</button>
                    <button onClick={() => handleBalanceButton(2500)}>2500</button>
                    <button onClick={() => handleBalanceButton(10000)}>10000</button>
                </div>
            }

        </div>
    );   
}

export default BalanceModal;