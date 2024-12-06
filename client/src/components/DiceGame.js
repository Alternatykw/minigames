import React, { useEffect, useState } from 'react';
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
  const [sliderValues, setSliderValues] = useState([25, 75]);
  const [previousValues, setPreviousValues] = useState([25, 75]);
  const balance = user.balance;

  useEffect(() => {
    setPreviousValues(sliderValues);
    if((sliderValues[0]>=sliderValues[1]) && (sliderValues[1] === previousValues[1])){
      setPreviousValues([sliderValues[1] - 1, sliderValues[1]]);
      setSliderValues([sliderValues[1] - 1, sliderValues[1]]);
    }else if((sliderValues[1]<=sliderValues[0]) && (sliderValues[0] === previousValues[0])){
      setPreviousValues([sliderValues[0], sliderValues[0] + 1]);
      setSliderValues([sliderValues[0], sliderValues[0] + 1]);
    }
  }, [sliderValues, previousValues]);

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
    let zeroCheck = e.target.value;

    if (e.target.value !== '0') {
      zeroCheck = zeroCheck.replace(/^0+/, '');
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

  const handleSlider2Change = (value) => {
    setSliderValues(value);
  };

  const handleSliderValue = (e) => {
    let newValue = e.target.value;

    if (newValue === ''){
      setSliderValue(0);
    }

    if (newValue !== "0") {
      newValue = newValue.replace(/^0+/, '');
      e.target.value = newValue;
    }
  
    if (!isNaN(newValue) && newValue >= 0 && newValue <= 100) {
      setSliderValue(newValue);
    }
  };

  const handleSliderValuesLeft = (e) => {
    let newValue = e.target.value;

    if (newValue === ''){
      setSliderValues(0, sliderValues[1]);
    }

    if (newValue !== "0") {
      newValue = newValue.replace(/^0+/, '');
      e.target.value = newValue;
    }

    if (newValue >= sliderValues[1]) {
      newValue = sliderValues[1] - 1; 
    }

    const newValues = [newValue, sliderValues[1]];
  
    if (!isNaN(newValue) && newValue >= 0 && newValue <= 100) {
      setSliderValues(newValues);
    }
  };

  const handleSliderValuesRight = (e) => {
    let newValue = e.target.value;

    if (newValue !== "0") {
      newValue = newValue.replace(/^0+/, '');
      e.target.value = newValue;
    }

    if (newValue <= sliderValues[0]) {
      newValue = sliderValues[0] + 1; 
    }

    const newValues = [sliderValues[0], newValue];
  
    if (!isNaN(newValue) && newValue >= 0 && newValue <= 100) {
      setSliderValues(newValues);
    }
  };

  const handleCommaPress = (e) => {
    if (['.', ',', '-', '+', 'e', 'E'].includes(e.key)) {
      e.preventDefault();
    }
  };

  const handleBalancePress = (e) => {
    if (['-', '+', 'e', 'E'].includes(e.key)) {
      e.preventDefault();
    }
  };

  return (
    <div className="dice-container">
      <div className="top">
        <div className="dice-content">
          {activeButton <= 2 ? (
            <>
              <ReactSlider
                className="slider"
                thumbClassName="slider-thumb"
                trackClassName={ activeButton === 1 ? "slider-track-green" : "slider-track-red" }
                value={sliderValue}
                onChange={handleSliderChange}
                min={0}
                max={100}
              />
              <p className="roll-label">{activeButton === 1 ? "Roll under: ":"Roll over: "}</p>
              <div className="slider-values">
                <input type="number" value={sliderValue} onKeyPress={handleCommaPress} onInput={handleSliderValue}></input>
              </div>
            </>
          ) : (
            <>
              <ReactSlider
                className="slider"
                thumbClassName="slider-thumb"
                trackClassName={ activeButton === 4 ? "slider-track-green" : "slider-track-red" }
                value={sliderValues}
                onChange={handleSlider2Change}
                min={0}
                max={100}
                step={1} 
                allowCross={false} 
              />
              <p className="roll-label">{activeButton === 3 ? "Roll between: ":"Roll outside: "}</p>
              <div className="slider-values">
                <input type="number" value={sliderValues[0]} onKeyPress={handleCommaPress} onInput={handleSliderValuesLeft}></input>
                <input type="number" value={sliderValues[1]} onKeyPress={handleCommaPress} onInput={handleSliderValuesRight}></input>
              </div>
            </>
          )}
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
            <h2>Credits: </h2><input type="number" id="credits-input" disabled={gameInProgress} defaultValue="0" onKeyPress={handleBalancePress} onChange={handleInputChange}></input>
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
