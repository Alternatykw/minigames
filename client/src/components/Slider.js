import './Slider.css';
import question_mark from "../images/question_mark.svg";
import bomb from "../images/bomb.svg";
import towers from "../images/towers.svg";
import dice from "../images/dice.svg";
import roulette from "../images/roulette.svg";
import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';

const Slider = () => {

    const [games, setGames] = useState([
        { title: "RANDOM GAME", image: question_mark, link: ""},
        { title: "DICE", image: dice, link: "/dice"},
        { title: "BOMBS", image: bomb, link: "/bombs" },
        { title: "TOWERS", image: towers, link: "/towers" },
        { title: "ROULETTE", image: roulette, link: "/roulette" }
    ]);

    const [position, setPosition] = useState(0);
    const [visibleCards, setVisibleCards] = useState([]);
    const [isAnimating, setIsAnimating] = useState(false);
    const [playClicked, setPlayClicked] = useState(false);

    const randomGame = () => {
        let randomIndex = Math.floor(Math.random() * (games.length - 1)) + 1;
        games[0].link=games[randomIndex].link;
    };

    randomGame();

    useEffect(() => {
        if(playClicked){
            if(isAnimating){
                return;
            }
            window.location.href = visibleCards[2].link;
        }
        
    }, [playClicked, isAnimating, visibleCards]);

    const playLink = async () => {
        setPlayClicked(true);
    }

    const moveGames = (direction) => {
        setGames(prevGames => {
            setIsAnimating(true);
            const gameLinks = document.querySelectorAll('.game-link, .middle-game-link');
            if (direction === "right") {
                gameLinks.forEach((gameLink, index) => {
                        if (index === visibleCards.length - 2) {
                            gameLink.style.animation = 'moveRight 0.5s forwards, fadeOut 0.33s ease-out forwards';
                        }
                        else if (gameLink.classList.contains('middle-game-link')) {
                            gameLink.style.animation = 'moveRightAndScaleDown 1s forwards';
                        }
                        else if (index === 0){
                            gameLink.style.animation = 'fadeIn 0.5s ease-in forwards, moveLeft 1s forwards';
                        }
                        else if (index === 1){
                            gameLink.style.animation = 'moveRightAndScaleUp 1s forwards';
                        }
                        setTimeout(() => {
                            gameLink.style.animation = '';
                            setPosition((position - 1 + games.length) % games.length);  
                            setIsAnimating(false);
                        }, 1050);    
                });
            } else if (direction === "left") {
                gameLinks.forEach((gameLink, index) => {
                        if (index === 1) {
                            gameLink.style.animation = 'moveLeft 0.5s forwards, fadeOut 0.33s ease-out forwards';
                        }
                        else if (gameLink.classList.contains('middle-game-link')) {
                            gameLink.style.animation = 'moveLeftAndScaleDown 1s forwards';
                        }
                        else if (index === visibleCards.length - 1){
                            gameLink.style.animation = 'fadeIn 0.5s ease-in forwards, moveRight 1s forwards';
                        }
                        else if (index === visibleCards.length - 2){
                            gameLink.style.animation = 'moveLeftAndScaleUp 1s forwards';
                        }
                        setTimeout(() => {
                            gameLink.style.animation = '';
                            setPosition((position + 1) % games.length);
                            setIsAnimating(false);
                        }, 1050);    
                });
            }
            return prevGames;
        });
    };

    const moveRight = () => {
        moveGames("right");
    };

    const moveLeft = () => {
        moveGames("left");
    };

    const updateVisibleCards = useCallback(() => {
        const visibleCards = [];
        for (let i = position; i < position + games.length; i++) {
            visibleCards.push(games[i % games.length]);
        }
        setVisibleCards(visibleCards);
    }, [position, games, setVisibleCards]);
    
    useEffect(() => {
        updateVisibleCards();
    }, [updateVisibleCards]);

    return (
        <div className="content">
            <h1>Welcome to my Minigames Website</h1>
            <div className="games">
                <div className="arrow" onClick={isAnimating ? null : moveLeft}>
                    &lt;
                </div> 
                {visibleCards.map((game, index) => (
                    <Link to={game.link} key={index}>
                        <div className={`${index === 0 ? "invisible-left" : ""} ${index === 4 ? "invisible-right" : ""} ${index === 2 ? 'middle-' : ''}game-link`}>
                            <div className="photo">
                                <img src={game.image} alt={game.title} />
                            </div>
                            <div>
                                <h2>{game.title}</h2>
                            </div>
                        </div>
                    </Link>
                ))}
                <div className="arrow" onClick={isAnimating ? null : moveRight}>
                    &gt;
                </div>   
            </div>
            <div className="play-button">
                <button onClick={playLink}>Play Game</button>
            </div>
        </div>
    )
}

export default Slider;
