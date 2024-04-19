import './Slider.css';
import bomb from "../images/bomb.svg";
import towers from "../images/towers.svg";
import { useState, useEffect } from 'react';

const Slider = () => {

    const [games, setGames] = useState([
        { title: "RANDOM GAME", image: bomb, link: ""},
        { title: "TOWERS", image: towers, link: "/towers" },
        { title: "BOMBS", image: bomb, link: "/bombs" }
    ]);

    const [position, setPosition] = useState(0);
    const [transformValue, setTransformValue] = useState(`translateX(0rem)`);

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
        moveGames("right");
    };

    const moveLeft = () => {
        moveGames("left");
    };

    
    useEffect(() => {
        setTransformValue(`translateX(${position * -15.75}rem)`);
    }, [position]);

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
                        className={`${index === (position+1) ? 'middle-' : ''}game-link`}
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