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

    const playLink = () => {
        window.location.href = games[1].link;
    }

    const moveRight = () => {
        setGames(prevGames => {
            const rotatedGames = [...prevGames.slice(-1), ...prevGames.slice(0, -1)];
            return rotatedGames;
        });
    };

    const moveLeft = () => {
        setGames(prevGames => {
            const rotatedGames = [...prevGames.slice(1), ...prevGames.slice(0, 1)];
            return rotatedGames;
        });
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
                        <div className={`${index === 1 ? 'middle-' : ''}game-link`}>
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