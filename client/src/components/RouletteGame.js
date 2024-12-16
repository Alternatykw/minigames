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
    const [placingBet, setPlacingBet] = useState(false);
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
            setBetAmounts((prev) => {
                const updatedColorBets = [...prev[data.color]];
        
                const existingBetIndex = updatedColorBets.findIndex((bet) => bet.name === data.name);
        
                if (existingBetIndex !== -1) {
                    updatedColorBets[existingBetIndex] = {
                        ...updatedColorBets[existingBetIndex],
                        amount: parseFloat(updatedColorBets[existingBetIndex].amount) + parseFloat(data.amount),
                    };
                } else {
                    updatedColorBets.push({ name: data.name, amount: parseFloat(data.amount) });
                }
        
                return {
                    ...prev,
                    [data.color]: updatedColorBets,
                };
            });
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
            socket.off('previousArray');
            clearInterval(timerInterval);
        };
    }, []);

    const handleBet = (color) => {
        if (!betAmount || isNaN(betAmount) || betAmount <= 0) {
            setErrorMessage('Enter a bet value.')
            return;
        }

        if (!betAmount || isNaN(betAmount) || betAmount < 100) {
            setErrorMessage('Minimum bet is 100.');
            return;
        }

        setPlacingBet(true);
        
        socket.emit('placeBet', { color, name: playerName, amount: betAmount });
        setUser(prevUser => ({
            ...prevUser,
            balance: prevUser.balance - betAmount 
        }));
        setTimeout(() => {
            setPlacingBet(false);
        }, 300);
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
                <div className="roulette-numbers">
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
                </div>
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
            {errorMessage==="" ? "" : <div className="bet-error">{errorMessage}</div>}

            <div className="roulette-bet-columns">
                <div>
                    <button className="roulette-red" disabled={timer > 35 || placingBet === true}
                        onClick={isLoggedIn ? () => handleBet('red') : openModal}
                    >
                        Bet on Red
                    </button>
                    <div className="bet-list">
                        {betAmounts.red.map((bet, index) => (
                            <p key={index}>{`${bet.name}: ${bet.amount}`}</p>
                        ))}
                    </div>
                </div>
                <div>
                    <button className="roulette-green" disabled={timer > 35 || placingBet === true}
                        onClick={isLoggedIn ? () => handleBet('green') : openModal}
                    >
                        Bet on Green
                    </button>
                    <div className="bet-list">
                        {betAmounts.green.map((bet, index) => (
                            <p key={index}>{`${bet.name}: ${bet.amount}`}</p>
                        ))}
                    </div>
                </div>
                <div>
                    <button className="roulette-black" disabled={timer > 35 || placingBet === true}
                        onClick={isLoggedIn ? () => handleBet('black') : openModal}
                    >
                        Bet on Black
                    </button>
                    <div className="bet-list">
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
