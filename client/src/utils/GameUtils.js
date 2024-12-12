import { useState } from 'react';
import { useUserData } from './UserUtils';
export const useGameUtils = () => {
    const { user } = useUserData();
    const balance = user.balance;
    const [gameOver, setGameOver] = useState(false);
    const [gameWon, setGameWon] = useState(false);
    const [gameValue, setGameValue] = useState(0);
    const [gameInProgress, setGameInProgress] = useState(false);
    const [multiplier, setMultiplier] = useState(1.1);
    const [wonCredits, setWonCredits] = useState(0);
    const [lostCredits, setLostCredits] = useState(0);
    const [errorMessage, setErrorMessage] = useState("");
    const [startingGame, setStartingGame] = useState(false);

    const handleInputChange = (e) => {
        let zeroCheck = e.target.value;

        if (e.target.value !== '0') {
            zeroCheck = zeroCheck.replace(/^0+/, '0');
            e.target.value = zeroCheck;
            }
            if (!gameInProgress) {
                setGameValue(parseFloat(e.target.value));
            }
            if (errorMessage !== '' && (e.target.value !== 0 || isNaN(e.target.value))) {
                setErrorMessage('');
            }
            if (e.target.value > parseFloat(balance)){
                e.target.value=parseFloat(balance);
                setGameValue(parseFloat(balance));
            }
            if (e.target.value > 100000) {
                e.target.value=100000;
                setGameValue(100000);
            }
            if (e.target.value < 0){
                e.target.value=0;
            }
    };

    const handleBalancePress = (e) => {
        if (['-', '+', 'e', 'E'].includes(e.key)) {
          e.preventDefault();
        }
    };

    return {
        handleInputChange,
        handleBalancePress,
        gameOver,
        setGameOver,
        gameWon,
        setGameWon,
        gameValue,
        gameInProgress,
        setGameInProgress,
        multiplier,
        setMultiplier,
        wonCredits,
        setWonCredits,
        lostCredits,
        setLostCredits,
        errorMessage,
        setErrorMessage,
        startingGame,
        setStartingGame
    };

};
