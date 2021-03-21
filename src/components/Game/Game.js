import React, { useEffect, useState } from 'react';
import playerFactory from '../../factories/playerFactory';
import Table from '../Reusable/Table';
import './Game.css';

// -----------------------------------------------
//
// Desc: Game phase of game
//
// -----------------------------------------------

const Game = (props) => {

    const [playerGameboard, setPlayerGameboard] = useState(false);
    const [aiGameboard, setAiGameboard] = useState(false);
    const [turn, setTurn] = useState(true);

    const humanPlayer = playerFactory();
	const aiPlayer = playerFactory();

    const toggleTurn = () => {
        (turn === true) ? setTurn(false) : setTurn(true);
    };

    const onClickHandler = (e) => {
        if (turn === true) {
            humanPlayer.attack(aiGameboard, e.target.id);
        };
    };
    
    useEffect(() => {
        console.log(aiGameboard);
	}, [aiGameboard]);

    const createPlayerGrid = (playerGameboard) => {

        if (!!playerGameboard) {

            let ships = [];
            let hitShips = [];

            for (let i = 0; i < playerGameboard.shipYard.length; i++) {
                playerGameboard.shipYard[i].position.forEach((cell) => {
                    ships.push(cell);
                });
            };

            for (let i = 0; i < playerGameboard.shipYard.length; i++) {
                playerGameboard.shipYard[i].hits.forEach((cell) => {
                    hitShips.push(cell);
                });
            };

            const cells = [];
            for (let i = 0; i < 100; i++) {
                cells.push(i);
            }
            let counter = -1;
            const result = cells.map((cell) => {
                let shipStatus = '';
                counter++;
                if (ships.includes(counter)) {
                    shipStatus = 'ship';
                }
                if (hitShips.includes(counter)) {
                    shipStatus = 'hit-ship';
                }
                return (
                    <div
                        className={`player-cell ${shipStatus}`}
                        id={counter}
                    />
                );
            });
            return result;  
        }
    };

    const createAiGrid = (aiGameboard) => {

        if (!!aiGameboard) {

            let ships = [];
            let hitShips = [];

            for (let i = 0; i < aiGameboard.shipYard.length; i++) {
                aiGameboard.shipYard[i].position.forEach((cell) => {
                    ships.push(cell);
                })
            }
            for (let i = 0; i < aiGameboard.shipYard.length; i++) {
                aiGameboard.shipYard[i].hits.forEach((cell) => {
                    hitShips.push(cell);
                });
            };

            const cells = [];
            for (let i = 0; i < 100; i++) {
                cells.push(i);
            }
            let counter = -1;
            const result = cells.map((cell) => {
                let shipStatus = '';
                counter++;
                if (ships.includes(counter)) {
                    shipStatus = 'ship';
                }
                if (hitShips.includes(counter)) {
                    shipStatus = 'hit-ship';
                }
                return (
                    <div
                        className={`ai-cell ${shipStatus}`}
                        id={counter}
                        onClick={onClickHandler}
                    />
                );
            });
            return result;  
        }
    };
    
    useEffect(() => {
        setPlayerGameboard(props.playerSetupGameboard);
        setAiGameboard(props.aiSetupGameboard);
	}, [props]);

    return (
        <div className="main-container">
            <div className="player-container">
                <div className="player-grid">
                    <Table grid={createPlayerGrid(playerGameboard)} />
                </div>
            </div>
            <div className="ai-container">
                <div className="ai-grid">
                    <Table grid={createAiGrid(aiGameboard)} />
                </div>
            </div>
        </div>
    );
}

export default Game;