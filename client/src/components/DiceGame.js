import React, { useState } from 'react';
import ReactSlider from 'react-slider';
import './DiceGame.css';

const DiceGame = ({ openModal, isLoggedIn, modifyBalance, user }) => {
  const [activeButton, setActiveButton] = useState(1);
  const [gameOver, setGameOver] = useState(false);
  const [gameWon, setGameWon] = useState(false);
  const [gameValue, setGameValue] = useState(0);
  const [gameInProgress, setGameInProgress] = useState(false);
  const [wonCredits, setWonCredits] = useState(0);
  const [lostCredits, setLostCredits] = useState(0);
  const [errorMessage, setErrorMessage] = useState("");
  const [sliderValue, setSliderValue] = useState(50);
  const balance = user.balance;

  const startGame = () => {
    if (gameValue <= 0 || isNaN(gameValue)) {
      document.getElementById('credits-input').focus();
      setErrorMessage("Choose credits amount.")
    } else if (gameValue<100){
      document.getElementById('credits-input').focus();
      setErrorMessage("Minimum bet is 100.")
    } else {
      modifyBalance(-gameValue, 'game');
      setGameInProgress(true);
    }
    // game logic here
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

  const handleSliderChange = (value) => {
    setSliderValue(value);
  };

  const handleSliderValueLeft = (e) => {
    let newValue = e.target.value;
  
    if (!isNaN(newValue) && newValue >= 0 && newValue <= 100) {
      setSliderValue(newValue);
    }
  };

  const handleSliderValueRight = (e) => {
    let newValue = e.target.value;
  
    if (!isNaN(newValue) && newValue >= 0 && newValue <= 100) {
      setSliderValue(100-newValue);
    }
  };

  const handleCommaPress = (e) => {
    if (e.key === ',') {
      e.preventDefault();
    }
  };

  return (
    <div className="dice-container">
      <div className="top">
        <div className="dice-content">
            <ReactSlider
              className="slider"
              thumbClassName="slider-thumb"
              trackClassName="slider-track"
              value={sliderValue}
              onChange={handleSliderChange}
              min={0}
              max={100}
            />
            <div className="slider-values">
              <input type="number" value={sliderValue} onKeyPress={handleCommaPress} onInput={handleSliderValueLeft}></input>
              <input type="number" value={100-sliderValue} onKeyPress={handleCommaPress} onInput={handleSliderValueRight}></input>
            </div>
        </div>
            {errorMessage==="" ? "" : <div className="errorMessage">{errorMessage}</div>}
            {gameWon && <p className="win">You won: {wonCredits} credits</p>}
            {gameOver && <p className="lose"> You lost: {lostCredits} credits</p>}
      </div>
      <div className="bottombar">
        <div className="bottombar-left">
          <h2>Choose Mode</h2>
          <div className="rowButtons">
            <button className={`sidebutton${activeButton===1 ? '-active' : ''}`} onClick={() => {setActiveButton(1);}} disabled={gameInProgress}>Under</button>
            <button className={`sidebutton${activeButton===2 ? '-active' : ''}`} onClick={() => {setActiveButton(2);}} disabled={gameInProgress}>Over</button>
            <button className={`sidebutton${activeButton===3 ? '-active' : ''}`} onClick={() => {setActiveButton(3);}} disabled={gameInProgress}>Inside</button>
            <button className={`sidebutton${activeButton===4 ? '-active' : ''}`} onClick={() => {setActiveButton(4);}} disabled={gameInProgress}>Outside</button>
          </div>
        </div>
        <div className="bottombar-right">
          <div className="credits">
            <h2>Credits: </h2><input type="number" id="credits-input" disabled={gameInProgress} defaultValue="0" onChange={handleInputChange}></input>
          </div>
          <div className="dice-start">
            <button className="dice-startbutton" onClick={isLoggedIn ? () => startGame() : openModal} disabled={gameInProgress}>
                  {gameInProgress ? "Waiting..." : "Start Game"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DiceGame;
