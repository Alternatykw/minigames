import React, { useState, useEffect } from 'react';
import './BombsGame.css';

const BombsGame = ({ openModal, isLoggedIn, modifyBalance, balance }) => {
  const [buttons, setButtons] = useState([]);
  const [activeButton, setActiveButton] = useState(1);
  const [gameOver, setGameOver] = useState(false);
  const [gameWon, setGameWon] = useState(false);
  const [gameValue, setGameValue] = useState(0);
  const [gameInProgress, setGameInProgress] = useState(false);
  const [clickedCount, setClickedCount] = useState(0);
  const [multiplier, setMultiplier] = useState(1.1);
  const [wonCredits, setWonCredits] = useState(0);
  const [lostCredits, setLostCredits] = useState(0);
  const [bombsAmount, setBombsAmount] = useState(3);
  const [currentCashout, setCurrentCashout] = useState(0);
  const [errorMessage, setErrorMessage] = useState("");
  const [startingGame, setStartingGame] = useState(false);
  
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
        modifyBalance(-gameValue);
        resetGame(bombsAmount);
        setGameInProgress(true);
      },1000);
    }
  }

  const handleWin = () =>{
    setWonCredits(currentCashout);
    setGameWon(true);
    revealButtons(500);
    modifyBalance(Math.round((parseFloat(currentCashout))*100)/100);
  }

  const handleInputChange = (e) => {
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
    if (e.target.value > 10000) {
      e.target.value=10000;
      setGameValue(10000);
    }
    if (e.target.value < 0){
      e.target.value=0;
    }
  };

  useEffect(() => {
    resetGame(3);
  }, []);

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
      <div className="row">
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
          <p>Credits: <input type="number" id="credits-input" disabled={gameInProgress} defaultValue="0" onChange={handleInputChange}></input></p>
          {gameInProgress?
            <button className="cashoutButton" onClick={() => handleWin()} disabled={!gameInProgress || gameOver}>Cashout {currentCashout} </button> 
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
