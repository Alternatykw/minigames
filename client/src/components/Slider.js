
import './Slider.css';
import question_mark from "../images/question_mark.svg";
import bomb from "../images/bomb.svg";
import towers from "../images/towers.svg";
import dice from "../images/dice.svg";
import { useState, useEffect } from 'react';

const Slider = () => {

    const [games, setGames] = useState([
        { title: "RANDOM GAME", image: question_mark, link: ""},
        { title: "DICE", image: dice, link: "/dice"},
        { title: "BOMBS", image: bomb, link: "/bombs" },
        { title: "TOWERS", image: towers, link: "/towers" }
    ]);

    const [position, setPosition] = useState(0);
    const [visibleCards, setVisibleCards] = useState([]);
    const [isAnimating, setIsAnimating] = useState(false);

    const randomGame = () => {
        let randomIndex = Math.floor(Math.random() * (games.length - 1)) + 1;
        games[0].link=games[randomIndex].link;
    };

    randomGame();

    const playLink = () => {
        window.location.href = games[position].link;
    }

    const moveGames = (direction) => {
        setGames(prevGames => {
            setIsAnimating(true);
            const gameLinks = document.querySelectorAll('.game-link, .middle-game-link');
            if (direction === "right") {
                gameLinks.forEach((gameLink, index) => {
                        if (index === visibleCards.length - 1) {
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
                        else if (index === 0){
                            gameLink.style.animation = 'fadeIn 0.5s ease-in forwards, moveRight 1s forwards';
                        }
                        else if (index === visibleCards.length - 1){
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

    const updateVisibleCards = () => {
        const visibleCards = [];
        for (let i = position; i < position + 4; i++) {
            visibleCards.push(games[i % games.length]);
        }
        setVisibleCards(visibleCards);
    };
    
    useEffect(() => {
        updateVisibleCards();
    }, [position]);

    return (
        <div className="content">
            <h1>Welcome to my Minigames Website</h1>
            <div className="games">
                <div className="arrow" onClick={isAnimating ? null : moveLeft}>
                    &lt;
                </div> 
                {visibleCards.map((game, index) => (
                    <a href={game.link} key={index}>
                        <div className={`${index === 0 ? "invisible" : ""} ${index === 2 ? 'middle-' : ''}game-link`}>
                            <div className="photo">
                                <img src={game.image} alt={game.title} />
                            </div>
                            <div>
                                <h2>{game.title}</h2>
                            </div>
                        </div>
                    </a>
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