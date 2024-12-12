import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';
import { useGameUtils } from '../utils/GameUtils';
import './RouletteGame.css';

const socket = io('http://localhost:5000'); 

const RouletteGame = ({ user, setUser, isLoggedIn, openModal }) => {
    const {
        handleInputChange,
        handleBalancePress,
        gameInProgress,
        setGameInProgress,
        errorMessage,
        setErrorMessage,
        startingGame,
        setStartingGame
      } = useGameUtils();
    const [betAmounts, setBetAmounts] = useState({ red: [], green: [], black: [] });
    const [betAmount, setBetAmount] = useState();
    const [spinResult, setSpinResult] = useState(null);
    const [rouletteArray, setRouletteArray] = useState([]);
    const [previousArray, setPreviousArray] = useState([]);
    const [timer, setTimer] = useState();
    const [barValue, setBarValue] = useState();
    const [checkingWinnings, setCheckingWinnings] = useState(false);
    const playerName = user.username;

    useEffect(() => {
        const fetchRouletteInfo = async () => {
            try {
                const response = await fetch('http://localhost:5000/rouletteInfo', {
                    method: 'GET'
                });
                const data = await response.json();
                if (response.ok) {
                    setSpinResult(data.rouletteArray[4]);
                    setRouletteArray(data.rouletteArray);
                    setPreviousArray(data.previousArray);
                    setTimer(data.spinInterval);
                    setBarValue(40-data.spinInterval);
                    setBetAmounts(data.allBets);
                } else {
                    console.error('Error fetching roulette info:', data.message);
                }
            } catch (error) {
                console.error('Error fetching roulette info:', error);
            }
        };
    
        fetchRouletteInfo();

        socket.on('betPlaced', (data) => {
            setBetAmounts((prev) => ({
                ...prev,
                [data.color]: [...prev[data.color], { name: data.name, amount: data.amount }],
            }));
        });

        socket.on('spinResult', (data) => {
            setSpinResult(data.result);
        });

        socket.on('rouletteArray', (rouletteArray) => {
            setRouletteArray(rouletteArray);
        });

        socket.on('previousArray', (previousArray) => {
            setTimeout(() => {
                setPreviousArray(previousArray);
            }, 5000);
        });

        const timerInterval = setInterval(() => {
            setTimer((prev) => (prev > 0 ? prev - 1 : 40));
            setBarValue((prev) => (prev < 40 ? prev + 1 : 0));
        }, 1000);

        return () => {
            socket.off('timerUpdate');
            socket.off('betPlaced');
            socket.off('spinResult');
            socket.off('rouletteArray');
            clearInterval(timerInterval);
        };
    }, []);

    const handleBet = (color) => {
        if (!isLoggedIn){
            openModal();
            return;
        }

        if (!betAmount || isNaN(betAmount) || betAmount <= 0) {
            alert('Please enter a valid name and bet amount.');
            return;
        }

        socket.emit('placeBet', { color, name: playerName, amount: betAmount });
        setUser(prevUser => ({
            ...prevUser,
            balance: prevUser.balance - betAmount 
        }));
    };

    useEffect(() => {
        if (timer === 0) {
            if(checkingWinnings){
                return;
            }
            setCheckingWinnings(true);
            let winningColor;
            if (spinResult === 0) {
                winningColor = 'green';
            } else if (spinResult % 2 === 0) {
                winningColor = 'red';
            } else {
                winningColor = 'black';
            }
    
            betAmounts[winningColor].forEach((bet) => {
                if(bet.name.includes(playerName)){
                    setTimeout(() => {
                        setUser(prevUser => ({
                            ...prevUser,
                            balance: parseFloat(prevUser.balance) + (2*bet.amount)
                        }));
                    }, 5000);
                }
            });
        }
    }, [timer, spinResult, betAmounts, setUser, playerName, checkingWinnings]); 

    useEffect(() => {
        if (timer === 35){
            setCheckingWinnings(false);
            setBetAmounts({ red: [], green: [], black: [] }); 
        }
    }, [timer]); 

    return (
        <div className="roulette-content">
            <div className="roulette-row">
                {rouletteArray.map((number, index) => (
                    <div
                        key={index}
                        className="roulette-number"
                        style={{
                            backgroundColor: number === 0 ? 'green' : number % 2 === 0 ? 'rgb(209, 41, 41)' : 'rgb(30, 30, 30)',
                        }}
                    >
                        {number}
                    </div>
                ))}
                <div className="roulette-indicator"></div>
            </div>
            <div className="roulette-row">
                {previousArray.map((number, index) => (
                    <div
                        key={index}
                        className="previous-roulette-number"
                        style={{
                            backgroundColor: number === 0 ? 'green' : number % 2 === 0 ? 'rgb(209, 41, 41)' : 'rgb(30, 30, 30)',
                        }}
                    >
                        {number}
                    </div>
                ))}
            </div>
            <div className="roulette-progress-div">
                <div className="roulette-progress-bar" style={{ width: `${(barValue / 40) * 100}%` }}></div>
            </div>
            <p>Next spin in: {timer} seconds</p>
            <p><input type="number" placeholder="Bet Amount" id="credits-input" value={betAmount} onKeyPress={handleBalancePress} onChange={(e) => {handleInputChange(e); setBetAmount(e.target.value);}}></input></p>

            <div className="roulette-bet-columns">
                <div>
                    <button className="roulette-red"
                        onClick={() => handleBet('red')}
                    >
                        Bet on Red
                    </button>
                    <div>
                        {betAmounts.red.map((bet, index) => (
                            <p key={index}>{`${bet.name}: ${bet.amount}`}</p>
                        ))}
                    </div>
                </div>
                <div>
                    <button className="roulette-green"
                        onClick={() => handleBet('green')}
                    >
                        Bet on Green
                    </button>
                    <div>
                        {betAmounts.green.map((bet, index) => (
                            <p key={index}>{`${bet.name}: ${bet.amount}`}</p>
                        ))}
                    </div>
                </div>
                <div>
                    <button className="roulette-black"
                        onClick={() => handleBet('black')}
                    >
                        Bet on Black
                    </button>
                    <div>
                        {betAmounts.black.map((bet, index) => (
                            <p key={index}>{`${bet.name}:${bet.amount}`}</p>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RouletteGame;
