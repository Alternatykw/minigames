import React, { useState, useEffect } from 'react';
import './BombsGame.css';
import './Sidebar.css';
import { useGameUtils } from '../utils/GameUtils';

const BombsGame = ({ openModal, isLoggedIn, modifyBalance, user }) => {
  const {
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
  } = useGameUtils();
  const [buttons, setButtons] = useState([]);
  const [activeButton, setActiveButton] = useState(1);
  const [clickedCount, setClickedCount] = useState(0);
  const [bombsAmount, setBombsAmount] = useState(3);
  const [currentCashout, setCurrentCashout] = useState(0);
  
  const generateRandomNumbers = (bombsAmount) => {
    const randomIndices = [];
    while (randomIndices.length < bombsAmount) {
      const randomIndex = Math.floor(Math.random() * 25);
      if (!randomIndices.includes(randomIndex)) {
        randomIndices.push(randomIndex);
      }
    }
    return randomIndices;
  };

  const resetGame = (bombsAmount) => {
    const newButtons = [];
    const randomIndices = generateRandomNumbers(bombsAmount);
    for (let i = 0; i < 25; i++) {
      newButtons.push({ content: '', isBomb: randomIndices.includes(i), revealed: false, exploded: false, clicked: false});
    }
    setButtons(newButtons);
    if (user.permissions === 'admin'){
      console.clear();
      console.log("Full grid look:");
      for (let i = 0; i < 5; i++) {
        let row = "";
        for (let j = 0; j < 5; j++) {
          const index = i * 5 + j;
          row += newButtons[index].isBomb ? '💣' : '💚';
        }
        console.log((i+1) + ". " + row);
      }
    }
    setGameOver(false);
    setGameWon(false);
    setClickedCount(0);
    setCurrentCashout(gameValue);
    setStartingGame(false);
  }; 

  const startGame = (bombsAmount) => {
    if (gameValue <= 0 || isNaN(gameValue)) {
      document.getElementById('credits-input').focus();
      setErrorMessage("Choose credits amount.")
    } else if (gameValue<100){
      document.getElementById('credits-input').focus();
      setErrorMessage("Minimum bet is 100.")
    }else{
      setStartingGame(true);
      setTimeout(() => {
      switch(bombsAmount){
        default : 
          setMultiplier(1.1);
          break;
        case 5:
          setMultiplier(1.2);
          break;
        case 10: 
          setMultiplier(1.5);
          break;
        case 24: 
          setMultiplier(21.37);
          break;
      }
        modifyBalance(-gameValue, 'game');
        resetGame(bombsAmount);
        setGameInProgress(true);
      },1000);
    }
  }

  const handleWin = () =>{
    setWonCredits(currentCashout);
    setGameWon(true);
    revealButtons(500);
    modifyBalance((Math.round((parseFloat(currentCashout))*100)/100), 'game');
  }

  useEffect(() => {
    resetGame(3);
  }, []);

  useEffect(() => {
    if (clickedCount === (25-bombsAmount)) {
      handleWin();
    }
  }, [clickedCount, bombsAmount]);

  const revealButtons = (timeoutDuration) => {
      setTimeout(() => {
        const updatedButtons = buttons.map((button) => ({
          ...button,
          revealed: true,
        }));
        setButtons(updatedButtons);
        setGameInProgress(false);
      }, timeoutDuration);
  }

  const handleClick = (index) => {
    if (buttons[index].isBomb) {
      setGameOver(true);
      setLostCredits(gameValue);
      const updatedButtons = [...buttons];
      updatedButtons[index].revealed = true;
      updatedButtons[index].clicked = true;
      setTimeout(() => {
        updatedButtons[index].exploded = true;
        setButtons(updatedButtons);
        revealButtons(1000);
      },3000);
    } else {
      const updatedButtons = [...buttons];
      updatedButtons[index].revealed = true;
      updatedButtons[index].clicked = true;
      setButtons(updatedButtons);
      setClickedCount(clickedCount + 1);
      setCurrentCashout(Math.round((gameValue * (multiplier ** (clickedCount+1)))*100)/100);
    }
  };

  const rows = [];
  for (let i = 0; i < buttons.length; i += 5) {
    rows.push(
      <div className="row" key={i}>
        {buttons.slice(i, i + 5).map((button, index) => (
          <button key={i + index} onClick={() => handleClick(i + index)} disabled={gameOver || !gameInProgress || button.revealed}>
            <span className={(button.revealed && gameInProgress) ? (button.isBomb ? 'bomb-animate' : 'appear-animate') : (button.revealed && !button.clicked ? 'fade' : '')}>
              {button.revealed ? (button.exploded ? '💥' : (button.isBomb ? '💣' : '💚')) : ''}
            </span>
          </button>
        ))}
      </div>
    );
  }

  return (
    <div className="container">
      <div className="sidebar">
        <h2>Choose Difficulty:</h2>
        <div className="rowButtons">
          <button className={`sidebutton${activeButton===1 ? '-active' : ''}`} onClick={() => {setBombsAmount(3); setActiveButton(1);}} disabled={gameInProgress}>Easy</button>
          <button className={`sidebutton${activeButton===2 ? '-active' : ''}`} onClick={() => {setBombsAmount(5); setActiveButton(2);}} disabled={gameInProgress}>Medium</button>
          <button className={`sidebutton${activeButton===3 ? '-active' : ''}`} onClick={() => {setBombsAmount(10); setActiveButton(3);}} disabled={gameInProgress}>Hard</button>
          <button className={`sidebutton${activeButton===4 ? '-active' : ''}`} onClick={() => {setBombsAmount(24); setActiveButton(4);}} disabled={gameInProgress}>Crazy</button>
        </div>
        <div className="rowButtons">
          <p>Credits: <input type="number" id="credits-input" disabled={gameInProgress} defaultValue="0" onKeyPress={handleBalancePress} onChange={handleInputChange}></input></p>
          {gameInProgress?
            <button className="cashoutButton" onClick={() => handleWin()} disabled={!gameInProgress || gameOver || gameWon}>Cashout {currentCashout} </button> 
              :
            <button className="startbutton" onClick={isLoggedIn ? () => startGame(bombsAmount) : openModal} disabled={startingGame}>
              {startingGame ? "Starting..." : "Start Game"}
            </button>
          }
        </div>
        {errorMessage==="" ? "" : <div className="errorMessage">{errorMessage}</div>}
        {gameWon && <p className="win">You won: {wonCredits} credits</p>}
        {gameOver && <p className="lose"> You lost: {lostCredits} credits</p>}
      </div>
      <div className="bot">
        <div className="button-grid">
          {rows}
          <div className={`multiplier ${gameOver ? 'red' : 'green'}`}>X{(multiplier ** clickedCount).toFixed(2)}</div>  
        </div>  
      </div>
    </div>
  );
}

export default BombsGame;
