import React, { useState } from 'react';
import './LandingPage.css';
import Navbar from '../components/Navbar';
import FlyoutMenu from '../components/FlyoutMenu';
import bomb from "./bomb.svg";
import towers from "./towers.svg";

const LandingPage = () => {
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
        <div className="landing-page">
            <Navbar />
            <FlyoutMenu /> 
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
        </div>
    );
};

export default LandingPage;
