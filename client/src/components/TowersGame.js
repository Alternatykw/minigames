import React, { useState, useEffect } from 'react';
import './BombsGame.css';
import towers from './TowersGame.module.css';

const TowersGame = ({ openModal, isLoggedIn, modifyBalance, balance }) => {
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
  const [currentCashout, setCurrentCashout] = useState(0);
  const [errorMessage, setErrorMessage] = useState("");
  const [startingGame, setStartingGame] = useState(false);
  const [clickedRow, setClickedRow] = useState(null);
  const [columns, setColumns] = useState(3);
  const [rows, setRows] = useState([]);

  const handleDifficulty = (number) => {
    setActiveButton(number);
    setColumns(number === 2 ? 2 : 3);
  }

  const resetGame = () => {
    const newButtons = [];
    const bombIndices = [];
    const bombsPerRow = activeButton === 3 ? 2 : 1;

    const numColumns = columns;

    for (let i = 0; i < 8; i++) {
      for (let j = 0; j < bombsPerRow; j++) {
        const randomIndex = Math.floor(Math.random() * numColumns) + i * numColumns;
        bombIndices.push(randomIndex);
      }
    }

    for (let i = 0; i < 8 * numColumns; i++) {
      newButtons.push({ content: '', isBomb: bombIndices.includes(i), revealed: false, exploded: false, clicked: false });
    }
    setButtons(newButtons);
    setGameOver(false);
    setGameWon(false);
    setClickedCount(0);
    setCurrentCashout(gameValue);
    setStartingGame(false);
    setClickedRow(null);
  };

  const startGame = () => {
    if (gameValue <= 0 || isNaN(gameValue)) {
      document.getElementById('credits-input').focus();
      setErrorMessage("Choose credits amount.")
    } else if (gameValue<100){
      document.getElementById('credits-input').focus();
      setErrorMessage("Minimum bet is 100.")
    } else {
      setStartingGame(true);
      setTimeout(() => {
        modifyBalance(-gameValue);
        resetGame();
        setGameInProgress(true);
      }, 1000);
    }
  }

  const handleWin = () => {
    setWonCredits(currentCashout);
    setGameWon(true);
    revealButtons(500);
    modifyBalance(Math.round((parseFloat(currentCashout)) * 100) / 100);
  }

  const handleInputChange = (e) => {
    if (!gameInProgress) {
      setGameValue(parseFloat(e.target.value));
    }
    if (errorMessage !== '' && (e.target.value !== 0 || isNaN(e.target.value))) {
      setErrorMessage('');
    }
    if (e.target.value > parseFloat(balance)) {
      e.target.value = parseFloat(balance);
      setGameValue(parseFloat(balance));
    }
    if (e.target.value > 10000) {
      e.target.value = 10000;
      setGameValue(10000);
    }
    if (e.target.value < 0) {
      e.target.value = 0;
    }
  };

  useEffect(() => {
    switch (activeButton) {
      default:
        setMultiplier(1.1);
        break;
      case 2:
        setMultiplier(1.2);
        break;
      case 3:
        setMultiplier(1.5);
        break;
    }
    resetGame();
  }, [activeButton]);

  useEffect(() => {
    const newRows = [];
    for (let i = buttons.length; i >= 0; i -= columns) {
      const rowIndex = Math.floor(i / columns);
      newRows.push(
        <div className="row">
          {buttons.slice(i, i + columns).map((button, index) => (
            <button 
              key={i + index} 
              onClick={() => handleClick(i + index)} 
              disabled={rowIndex !== clickedCount || gameOver || !gameInProgress || button.revealed || clickedRow === rowIndex}
            >   
              <span className={(button.revealed && gameInProgress) ? (button.isBomb ? 'bomb-animate' : 'appear-animate') : (button.revealed && !button.clicked ? 'fade' : '')}>
                {button.revealed ? (button.exploded ? '💥' : (button.isBomb ? '💣' : '💚')) 
                  : 
                ((!buttons.slice(i, i + columns).some(btn => btn.clicked && btn.revealed)) ? ( (multiplier ** (rowIndex+1)).toFixed(2)+"x" ) : (''))}
              </span>          
            </button>
          ))}
        </div>
      );
    }
    setRows(newRows);
  }, [buttons, columns, clickedCount, gameOver, gameInProgress, clickedRow, multiplier]);

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
    const rowIndex = Math.floor(index / columns);
    if (rowIndex === clickedCount) {
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
        }, 3000);
      } else {
        const updatedButtons = [...buttons];
        updatedButtons[index].revealed = true;
        updatedButtons[index].clicked = true;
        setButtons(updatedButtons);
        setClickedRow(rowIndex);
        setClickedCount(clickedCount + 1);
        setCurrentCashout(Math.round((gameValue * (multiplier ** (clickedCount + 1))) * 100) / 100);
      }
    }
  };

  return (
    <div className="container">
      <div className="sidebar">
        <h2>Choose Difficulty:</h2>
        <div className="rowButtons">
          <button className={`sidebutton${activeButton === 1 ? '-active' : ''}`} onClick={() => { handleDifficulty(1) }} disabled={gameInProgress}>Easy</button>
          <button className={`sidebutton${activeButton === 2 ? '-active' : ''}`} onClick={() => { handleDifficulty(2) }} disabled={gameInProgress}>Medium</button>
          <button className={`sidebutton${activeButton === 3 ? '-active' : ''}`} onClick={() => { handleDifficulty(3) }} disabled={gameInProgress}>Hard</button>
        </div>
        <div className="rowButtons">
          <p>Credits: <input type="number" id="credits-input" disabled={gameInProgress} defaultValue="0" onChange={handleInputChange}></input></p>
          {gameInProgress ?
            <button className="cashoutButton" onClick={() => handleWin()} disabled={!gameInProgress || gameOver}>Cashout {currentCashout} </button>
            :
            <button className="startbutton" onClick={isLoggedIn ? () => startGame() : openModal} disabled={startingGame}>
              {startingGame ? "Starting..." : "Start Game"}
            </button>
          }
        </div>
        {errorMessage === "" ? "" : <div className="errorMessage">{errorMessage}</div>}
        {gameWon && <p className="win">You won: {wonCredits} credits</p>}
        {gameOver && <p className="lose"> You lost: {lostCredits} credits</p>}
      </div>
      <div className="bot">
      <div className={`${towers['button-grid']}`}>
          {rows}
        </div>
      </div>
    </div>
  );
}

export default TowersGame;
