import React, { useEffect, useState } from 'react';
import ReactSlider from 'react-slider';
import './DiceGame.css';
import { useGameUtils } from '../utils/GameUtils';

const DiceGame = ({ openModal, isLoggedIn, modifyBalance, user }) => {
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
    setErrorMessage
  } = useGameUtils();
  const [activeButton, setActiveButton] = useState(1);
  const [sliderValue, setSliderValue] = useState(50);
  const [sliderValues, setSliderValues] = useState([25, 75]);
  const [previousValues, setPreviousValues] = useState([25, 75]);
  const [indicatingArrow, setIndicatingArrow] = useState(50);
  const [changingInput, setChangingInput] = useState(false);

  useEffect(() => {
    if(!changingInput){
      setPreviousValues(sliderValues);
      if((sliderValues[0]>=sliderValues[1]) && (sliderValues[1] === previousValues[1])){
        setPreviousValues([sliderValues[1] - 1, sliderValues[1]]);
        setSliderValues([sliderValues[1] - 1, sliderValues[1]]);
      }else if((sliderValues[1]<=sliderValues[0]) && (sliderValues[0] === previousValues[0])){
        setPreviousValues([sliderValues[0], sliderValues[0] + 1]);
        setSliderValues([sliderValues[0], sliderValues[0] + 1]);
      }else if(sliderValues[0]===0 && sliderValues[1]===100){
        setSliderValues([1,100]);
      }
    }
    
    let formula;
    switch(activeButton){
      default: 
        formula=sliderValue;
        break;
      case 2:
        formula=(100-sliderValue);
        break;
      case 3: 
        formula=(sliderValues[1]-sliderValues[0]);
        break;
      case 4: 
        formula=(100-(sliderValues[1]-sliderValues[0]));
        break;
    }
    if (formula>75){
      setMultiplier((100+(100-formula+(0.1*(100-formula))))/100);
    }else{
      setMultiplier(100/(formula+(100/(100-formula))));
    }
  }, [activeButton, sliderValue, sliderValues, previousValues, setMultiplier]);

  const handleWin = () => {
    setGameWon(true);
    setWonCredits((parseFloat(gameValue*multiplier)).toFixed(2));
    modifyBalance((Math.round((parseFloat(gameValue*multiplier))*100)/100), 'game');
  }

  const handleLose = () => {
    setGameOver(true);
    setLostCredits(gameValue);
  }

  const startGame = () => {
    if (gameValue <= 0 || isNaN(gameValue)) {
      document.getElementById('credits-input').focus();
      setErrorMessage("Choose credits amount.");
    } else if (gameValue < 100) {
      document.getElementById('credits-input').focus();
      setErrorMessage("Minimum bet is 100.");
    } else {
      setGameOver(false);
      setGameWon(false);
      setWonCredits(0);
      setLostCredits(0);
      modifyBalance(-gameValue, 'game');
      setGameInProgress(true);
  
      const randomValue = Math.floor(Math.random() * 10001) / 100;
  
      const animationSteps = [
        { value: 0 },  
        { value: 100 },
        { value: 0 },  
        { value: 100 },
        { value: randomValue },
        { value: randomValue }
      ];
  
      let totalDelay = 0;

      animationSteps.forEach((step, index) => {
        totalDelay += 500;
        setTimeout(() => {
          setIndicatingArrow(step.value);
  
          if (index === animationSteps.length - 1) {
            setGameInProgress(false);
            switch (activeButton) {
              default:
                if (randomValue <= sliderValue) {
                  handleWin();
                } else {
                  handleLose();
                }
                break;
              case 2:
                if (randomValue >= sliderValue) {
                  handleWin();
                } else {
                  handleLose();
                }
                break;
              case 3:
                if (randomValue >= sliderValues[0] && randomValue <= sliderValues[1]) {
                  handleWin();
                } else {
                  handleLose();
                }
                break;
              case 4:
                if (randomValue <= sliderValues[0] || randomValue >= sliderValues[1]) {
                  handleWin();
                } else {
                  handleLose();
                }
                break;
            }
          }
        }, totalDelay);
      });
    }
  };

  const handleSliderInvalid = (e) => {
    if (e.target.value === "" || parseInt(e.target.value)<=0 ) {
      setSliderValue(1);
    }
  };

  const handleSliderInvalidLeft = (e) => {
    if (e.target.value === "" || parseInt(e.target.value)<0 ) {
      if(sliderValues[1]===100){
        setSliderValues([1, sliderValues[1]]);
      }else{
        setSliderValues([0, sliderValues[1]]);
      }
    }
    setChangingInput(false);
  }

  const handleSliderInvalidRight = (e) => {
    if (e.target.value === "" || parseInt(e.target.value)<0 ) {
      if(sliderValues[0]===0){
        setSliderValues([sliderValues[0], 99]);
      }else{
        setSliderValues([sliderValues[0], 100]);
      }
    }
    setChangingInput(false);
  }


  const handleSliderChange = (value) => {
    setSliderValue(value);
  };

  const handleSlider2Change = (value) => {
    setSliderValues(value);
  };

  const handleSliderValue = (e) => {
    let newValue = e.target.value;

    if (newValue !== "0") {
      newValue = newValue.replace(/^0+/, '0');
      e.target.value = newValue;
    }
  
    if (!isNaN(newValue) && newValue >= 0 && newValue < 100) {
      setSliderValue(parseInt(newValue));
    }
  };

  const handleSliderValuesLeft = (e) => {
    setChangingInput(true);
    let newValue = e.target.value;

    if (newValue !== "0") {
      newValue = newValue.replace(/^0+/, '0');
      e.target.value = newValue;
    }

    let newValues;

    if(parseInt(e.target.value) >= sliderValues[1]){
      if(parseInt(newValue)<100){
        newValues = [parseInt(newValue), parseInt(newValue)+1];
      }else{
        newValues = [99, 100];
      }
    }else{
      newValues = [parseInt(newValue), sliderValues[1]];
    }
  
    if (!isNaN(newValue) && newValue >= 0 && newValue <= 100) {
      setSliderValues(newValues);
    }
  };

  const handleSliderValuesRight = (e) => {
    setChangingInput(true);
    let newValue = e.target.value;

    if (newValue !== "0") {
      newValue = newValue.replace(/^0+/, '0');
      e.target.value = newValue;
    }

    let newValues;

    if(parseInt(newValue) <= sliderValues[0]){
      if(parseInt(newValue)>0){
        newValues = [parseInt(newValue)-1, parseInt(newValue)];
      }else{
        newValues = [0, 1];
      }
    }else{
      newValues = [sliderValues[0], parseInt(newValue)];
    }
  
    if (!isNaN(newValue) && newValue >= 0 && newValue <= 100) {
      setSliderValues(newValues);
    }
  };

  const handleCommaPress = (e) => {
    if (['.', ',', '-', '+', 'e', 'E'].includes(e.key)) {
      e.preventDefault();
    }
  };

  return (
    <div className="dice-container">
      <div className="top">
        <div className="dice-content">
              <ReactSlider
                className="slider"
                thumbClassName="indicating-arrow"
                value={indicatingArrow}
                min={0}
                max={100}
                disabled={true}
              />
          {activeButton <= 2 ? (
            <>
              <ReactSlider
                className="slider"
                thumbClassName="slider-thumb"
                trackClassName={ activeButton === 1 ? "slider-track-green" : "slider-track-red" }
                value={isNaN(sliderValue) ? 1 : sliderValue}
                onChange={handleSliderChange}
                min={1}
                max={99}
                disabled={gameInProgress===true}
              />
              <div>

              </div>
              <div className='dice-under-track'>
                <div>
                  <p className="roll-label">{activeButton === 1 ? "Roll under: ":"Roll over: "}</p>
                  <div className="slider-values">
                    <input type="number" value={sliderValue} onKeyPress={handleCommaPress} onBlur={handleSliderInvalid} onInput={handleSliderValue}></input>
                  </div>
                </div>
                <div>
                  <p className="dice-multiplier-label">Multiplier: </p>
                  <div className={`dice-multiplier ${gameOver ? 'red' : 'green'}`}>x{(multiplier).toFixed(2)}</div>  
                </div>
              </div>
            </>
          ) : (
            <>
              <ReactSlider
                className="slider"
                thumbClassName="slider-thumb"
                trackClassName={ activeButton === 4 ? "slider-track-green" : "slider-track-red" }
                value={isNaN(sliderValues[0]) ? [1, sliderValues[1]] : isNaN(sliderValues[0]) ? [sliderValues[0], 100] : sliderValues}
                onChange={handleSlider2Change}
                min={0}
                max={100}
                step={1} 
                allowCross={false} 
                disabled={gameInProgress===true}
              />
              <div className='dice-under-track'>
                <div>
                  <p className="roll-label">{activeButton === 3 ? "Roll between: ":"Roll outside: "}</p>
                <div className="slider-values">
                  <input type="number" value={sliderValues[0]} onKeyPress={handleCommaPress} onBlur={handleSliderInvalidLeft} onInput={handleSliderValuesLeft}></input>
                  <input type="number" value={sliderValues[1]} onKeyPress={handleCommaPress} onBlur={handleSliderInvalidRight} onInput={handleSliderValuesRight}></input>
                </div> 
                </div>
                <div>
                  <p className="dice-multiplier-label">Multiplier: </p>
                  <div className={`dice-multiplier ${gameOver ? 'red' : 'green'}`}>x{(multiplier).toFixed(2)}</div>  
                </div>
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
