import React, { useState, useEffect } from 'react';
import './BombsGame.css';

const BombsGame = () => {
  const [buttons, setButtons] = useState([]);
  const [numRandomBombs, setNumRandomBombs] = useState(3);
  const [gameOver, setGameOver] = useState(false);
  const [gameWon, setGameWon] = useState(false);
  const [gameValue, setGameValue] = useState(0);
  const [revealedButtons, setRevealedButtons] = useState([]);
  const [gameInProgress, setGameInProgress] = useState(false);
  const [clickedCount, setClickedCount] = useState(0);
  const [multiplier, setMultiplier] = useState(1.1);
  const [wonCredits, setWonCredits] = useState(0);
  
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
  };

  const handleBombButton = (bombsAmount) => {
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

  const handleWin = () =>{
    setWonCredits((gameValue * (multiplier ** clickedCount)).toFixed(2));
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
      const updatedButtons = [...buttons];
      updatedButtons[index].revealed = true;
      setButtons(updatedButtons);
      revealButtons();
    } else {
      if (!gameInProgress) {
        setGameInProgress(true);
      }
      const updatedButtons = [...buttons];
      updatedButtons[index].revealed = true;
      setButtons(updatedButtons);
      setRevealedButtons([...revealedButtons, index]);
      setClickedCount(clickedCount + 1); // Increment clicked count when a non-bomb button is clicked
    }
  };

  const rows = [];
  for (let i = 0; i < buttons.length; i += 5) {
    rows.push(
      <div className="row">
        {buttons.slice(i, i + 5).map((button, index) => (
          <button key={i + index} onClick={() => handleClick(i + index)} disabled={gameOver || revealedButtons.includes(i + index)}>
            {button.revealed ? button.isBomb ? '💣' : '💚' : ''}
          </button>
        ))}
      </div>
    );
  }

  return (
    <div className="container">
      <div className="sidebar">
        <button onClick={() => handleBombButton(3)} disabled={gameInProgress}>3 Bombs</button>
        <button onClick={() => handleBombButton(10)} disabled={gameInProgress}>10 Bombs</button>
        <button onClick={() => handleBombButton(24)} disabled={gameInProgress}>24 Bombs</button>
        <p>Credits: <input type="number" disabled={gameInProgress} defaultValue="0" onChange={(e) => {if(!gameInProgress) setGameValue(parseFloat(e.target.value))}}></input></p>
      </div>
      <div className="bot">
        <div className="button-grid">
          {rows}
        </div> 
        <div className={`multiplier ${gameOver ? 'red' : 'green'}`}>X{(multiplier ** clickedCount).toFixed(2)}</div>   
        <div className="cashout"><button onClick={() => handleWin()}disabled={!gameInProgress || gameOver}>Cashout</button></div>
        {gameWon && <div className="win">Congrats! You won: {wonCredits} credits</div>}
      </div>
    </div>
  );
}

export default BombsGame;
