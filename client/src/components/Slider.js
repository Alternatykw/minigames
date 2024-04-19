import './Slider.css';
import bomb from "../images/bomb.svg";
import towers from "../images/towers.svg";
import { useState } from 'react';

const Slider = () => {

    const [games, setGames] = useState([
        { title: "RANDOM GAME", image: bomb, link: ""},
        { title: "TOWERS", image: towers, link: "/towers" },
        { title: "BOMBS", image: bomb, link: "/bombs" }
    ]);

    const [direction, setDirection] = useState();
    const [position, setPosition] = useState(1);
    const [transformValue, setTransformValue] = useState();

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
            if (direction === "right") {
                setPosition((position + 1) % games.length);
            } else if (direction === "left") {
                setPosition((position - 1 + games.length) % games.length);
            }
            return prevGames;
        });
    };

    const moveRight = () => {
        setDirection("right");
        moveGames(direction);
        setTransformValue(`translateX(${position * 15.75}rem)`); //change this and one below
    };

    const moveLeft = () => {
        setDirection("left");
        moveGames(direction);
        setTransformValue(`translateX(${position * -15.75}rem)`);
    };

    return (
        <div className="content">
            <h1>Welcome to my Minigames Website</h1>
            <div className="games">
                <div className="arrow" onClick={moveLeft}>
                    &lt;
                </div> 
                {games.map((game, index) => (
                    <a href={game.link} key={index}>
                        <div 
                        className={`${index === position ? 'middle-' : ''}game-link`}
                        style={{ transform: transformValue, transition:'transform 0.66s ease'}}
                        >
                            <div className="photo">
                                <img src={game.image} alt={game.title} />
                            </div>
                            <div>
                                <h2>{game.title}</h2>
                            </div>
                        </div>
                    </a>
                ))}
                <div className="arrow" onClick={moveRight}>
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