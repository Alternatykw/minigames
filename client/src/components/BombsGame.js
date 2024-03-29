import React, { useState, useEffect } from 'react';
import './BombsGame.css';
import gsap from 'gsap'; //import for animations???

const BombsGame = () => {
  // State to hold the buttons array, number of random bombs, game status, and initial game state
  const [buttons, setButtons] = useState([]);
  const [numRandomBombs, setNumRandomBombs] = useState(3);
  const [gameOver, setGameOver] = useState(false);
  const [revealedButtons, setRevealedButtons] = useState([]);
  const [gameInProgress, setGameInProgress] = useState(false);

  // Function to generate random numbers
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

  // Function to reset the game to its initial state
  const resetGame = (bombsAmount) => {
    const newButtons = [];
    const randomIndices = generateRandomNumbers(); // Generate new random bomb indices
    for (let i = 0; i < 25; i++) {
      newButtons.push({ content: '', isBomb: randomIndices.includes(i), revealed: false }); // Set isBomb based on randomIndices
    }
    setButtons(newButtons);
    setNumRandomBombs(bombsAmount);
    setGameOver(false);
    setRevealedButtons([]);
  };


  // Function to handle changing number of random bombs
  const handleRandomBombsChange = (num) => {
    setNumRandomBombs(num);
    setGameOver(false); // Reset game over status when changing the number of bombs
    setRevealedButtons([]); // Reset revealed buttons
  };

  useEffect(() => {
    // Generate buttons and update the buttons array
    const randomIndices = generateRandomNumbers();
    const newButtons = [];
    for (let i = 0; i < 25; i++) {
      newButtons.push({ content: '', isBomb: false, revealed: false }); // Each button is an object with content, isBomb, and revealed properties
    }
    // Replace buttons at random indices with bombs
    randomIndices.forEach(index => {
      newButtons[index] = { content: '', isBomb: true, revealed: false };
    });
    setButtons(newButtons);
  }, [numRandomBombs]);
 
  // Function to handle button click
  const handleClick = (index) => {
    if (buttons[index].isBomb) {
      // Add the animation???
      setGameInProgress(false)
      const updatedButtons = [...buttons];
      updatedButtons[index].revealed = true;
      setButtons(updatedButtons);
      setGameOver(true);
      setTimeout(() => {
        // Update revealed buttons array
        const updatedButtons = buttons.map((button) => ({
          ...button,
          revealed: true
        }));
        setButtons(updatedButtons);
      }, 1000);
    } else {
      if(gameInProgress==false){
        setGameInProgress(true);
      }
      // If it's not a bomb, reveal the clicked button
      const updatedButtons = [...buttons];
      updatedButtons[index].revealed = true;
      setButtons(updatedButtons);
      setRevealedButtons([...revealedButtons, index]);
    }
  };



  // Divide the buttons array into chunks of 5 for each row
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

  // Render the grid and buttons to change number of random bombs
  return (
    <div className="container">
      <div className="sidebar">
        <button onClick={() => resetGame(3)} disabled={gameInProgress}>3 Bombs</button>
        <button onClick={() => resetGame(10)} disabled={gameInProgress}>10 Bombs</button>
        <button onClick={() => resetGame(24)} disabled={gameInProgress}>24 Bombs</button>
      </div>
      <div className="button-grid">
        {rows}
      </div>
      {gameOver && <div>You lose!</div>}
    </div>
  );
}

export default BombsGame;
