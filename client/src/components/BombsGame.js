import React, { useState, useEffect } from 'react';
import './BombsGame.css';

const BombsGame = () => {
  const [buttons, setButtons] = useState([]);
  const [activeButton, setActiveButton] = useState(1);
  const [numRandomBombs, setNumRandomBombs] = useState(3);
  const [gameOver, setGameOver] = useState(false);
  const [gameWon, setGameWon] = useState(false);
  const [gameValue, setGameValue] = useState(0);
  const [revealedButtons, setRevealedButtons] = useState([]);
  const [gameInProgress, setGameInProgress] = useState(false);
  const [clickedCount, setClickedCount] = useState(0);
  const [multiplier, setMultiplier] = useState(1.1);
  const [wonCredits, setWonCredits] = useState(0);
  const [lostCredits, setLostCredits] = useState(0);
  const [bombsAmount, setBombsAmount] = useState(3);
  const [currentCashout, setCurrentCashout] = useState(0);
  const [errorMessage, setErrorMessage] = useState("");
  
  const generateRandomNumbers = () => {
    const randomIndices = [];
    while (randomIndices.length < numRandomBombs) {
      const randomIndex = Math.floor(Math.random() * 25);
      if (!randomIndices.includes(randomIndex)) {
        randomIndices.push(randomIndex);
      }
    }
    return randomIndices;
  };

  const resetGame = (bombsAmount) => {
    const newButtons = [];
    const randomIndices = generateRandomNumbers();
    for (let i = 0; i < 25; i++) {
      newButtons.push({ content: '', isBomb: randomIndices.includes(i), revealed: false });
    }
    setButtons(newButtons);
    setNumRandomBombs(bombsAmount);
    setGameOver(false);
    setGameWon(false);
    setRevealedButtons([]);
    setClickedCount(0);
    setCurrentCashout(0);
  };

  const StartGame = (bombsAmount) => {
    if(gameValue<=0 || isNaN(gameValue)){
      document.getElementById('credits-input').focus();
      setErrorMessage("Choose credits amount.")
    }else{
      setGameInProgress(true);
      switch(bombsAmount){
        default : 
          setMultiplier(1.1);
          break;
        case 10: 
          setMultiplier(1.5);
          break;
        case 24: 
          setMultiplier(21.37);
          break;
      }
      resetGame(bombsAmount);
    }
  }

  const handleWin = () =>{
    setWonCredits(currentCashout);
    setGameWon(true);
    revealButtons();
  }

  useEffect(() => {
    const randomIndices = generateRandomNumbers();
    const newButtons = [];
    for (let i = 0; i < 25; i++) {
      newButtons.push({ content: '', isBomb: false, revealed: false });
    }
    randomIndices.forEach(index => {
      newButtons[index] = { content: '', isBomb: true, revealed: false };
    });
    setButtons(newButtons);
  }, [numRandomBombs]);

  const revealButtons = () => {
      setTimeout(() => {
        const updatedButtons = buttons.map((button) => ({
          ...button,
          revealed: true
        }));
        setButtons(updatedButtons);
        setGameInProgress(false);
      }, 1000);
  }

  const handleClick = (index) => {
    if (buttons[index].isBomb) {
      setGameOver(true);
      setLostCredits(gameValue);
      const updatedButtons = [...buttons];
      updatedButtons[index].revealed = true;
      setButtons(updatedButtons);
      revealButtons();
    } else {
      const updatedButtons = [...buttons];
      updatedButtons[index].revealed = true;
      setButtons(updatedButtons);
      setRevealedButtons([...revealedButtons, index]);
      setClickedCount(clickedCount + 1);
      setCurrentCashout((gameValue * (multiplier ** (clickedCount+1))-gameValue).toFixed(2));
    }
  };

  const rows = [];
  for (let i = 0; i < buttons.length; i += 5) {
    rows.push(
      <div className="row">
        {buttons.slice(i, i + 5).map((button, index) => (
          <button key={i + index} onClick={() => handleClick(i + index)} disabled={gameOver || !gameInProgress || revealedButtons.includes(i + index)}>
            {button.revealed ? button.isBomb ? '💣' : '💚' : ''}
          </button>
        ))}
      </div>
    );
  }

  return (
    <div className="container">
      <div className="sidebar">
        <h4>Number of Bombs:</h4>
        <div className="rowButtons">
          <button className={`sidebutton${activeButton===1 ? '-active' : ''}`} onClick={() => {setBombsAmount(3); setActiveButton(1);}} disabled={gameInProgress}>3 Bombs</button>
          <button className={`sidebutton${activeButton===2 ? '-active' : ''}`} onClick={() => {setBombsAmount(10); setActiveButton(2);}} disabled={gameInProgress}>10 Bombs</button>
          <button className={`sidebutton${activeButton===3 ? '-active' : ''}`} onClick={() => {setBombsAmount(24); setActiveButton(3);}} disabled={gameInProgress}>24 Bombs</button>
        </div>
        <div className="rowButtons">
          <p>Credits: <input type="number" id="credits-input" disabled={gameInProgress} defaultValue="0" onChange={(e) => {if(!gameInProgress) setGameValue(parseFloat(e.target.value)); if(errorMessage!='' && e.target.value!=0 || isNaN(e.target.value)) setErrorMessage("");}}></input></p>
          {gameInProgress? <button className="cashoutButton" onClick={() => handleWin()}disabled={!gameInProgress || gameOver}>Cashout {currentCashout} </button> : <button className="startbutton" onClick={() => StartGame(bombsAmount)}>Start Game</button>}
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
