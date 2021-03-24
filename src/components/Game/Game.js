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
    const [aiPrevShot, setAiPrevShot] = useState('');
    const [aiPrevShots, setAiPrevShots] = useState([]);
    const [aiNextShot, setAiNextShot] = useState('');
    const [aiNextShotDirection, setAiNextShotDirection] = useState('');
    const [showOverlay, setShowOverlay] = useState(false);
    const [winner, setWinner] = useState(null);

    const humanPlayer = playerFactory();
    const aiPlayer = playerFactory();

    const generateRandomNumber = (num) => {
        return Math.floor(Math.random() * num);
    };

    const checkIfShipPresent = (gameboard, cell) => {
        let val = parseInt(cell);
        for (let i = 0; i < gameboard.shipYard.length; i++) {
            if (gameboard.shipYard[i].position.includes(val)) {
                return true;
            };
        };
        return false;
    };

    const checkIfShotHit = (gameboard, cell) => {
        let val = parseInt(cell);
        for (let i = 0; i < gameboard.shipYard.length; i++) {
            if (gameboard.shipYard[i].hits.includes(val)) {
                return true;
            };
        };
        return false;
    };

    const checkIfShotMissed = (gameboard, cell) => {
        let val = parseInt(cell);
        if (gameboard.missedShots.includes(val)) {
            return true;
        };
        return false;
    };

    const pauseForAiShot = (ms) => {
        return new Promise(resolve => setTimeout(resolve, ms));
      }

    const aiSelection = () => {

        pauseForAiShot(1).then(() => {
            // Board boundaries
            const leftEdge = [0,10,20,30,40,50,60,70,80,90];
            const rightEdge = [9,19,29,39,49,59,69,79,89,99];
            const topEdge = [0,1,2,3,4,5,6,7,8,9];
            const bottomEdge = [90,91,92,93,94,95,96,97,98,99];

            let cellToHit = null;

            // If there were no previous shots played by the AI, fire an initial shot
            if (aiPrevShot === '') {
                console.log("A")
                cellToHit = generateRandomNumber(100);
                aiPlayer.attack(playerGameboard, cellToHit);
                setAiPrevShot(cellToHit);
                setAiPrevShots([...aiPrevShots, cellToHit]);
                return;
                
            // Else there was a shot played previously by the AI
            } else {
                // Fire a shot at any cell which has not been shot before
                // The previous AI shot missed
                if (!checkIfShotHit(playerGameboard, aiPrevShot)) {
                    console.log("B")
                    while (cellToHit === null || aiPrevShots.includes(cellToHit)) {
                        cellToHit = generateRandomNumber(100);
                    };
                    aiPlayer.attack(playerGameboard, cellToHit);
                    setAiPrevShot(cellToHit);
                    setAiPrevShots([...aiPrevShots, cellToHit]);
                    return;
                };    
                    
                // Else the previous AI shot hit
                // If next shot scheduled
                if (aiNextShot.length !== 0) {
                    if ((checkIfShotHit(playerGameboard, aiNextShot)) || (checkIfShotMissed(playerGameboard, aiNextShot))) {
                        setAiNextShot('');
                        setAiNextShotDirection('');
                        return;
                    }
                    console.log("C")
                    aiPlayer.attack(playerGameboard, aiNextShot);
                    setAiPrevShot(aiNextShot);
                    setAiPrevShots([...aiPrevShots, aiNextShot]);

                    // If this AI shot hit
                    if (checkIfShipPresent(playerGameboard, aiNextShot)) {   // Using this function because of async nature of state
                        if (aiNextShotDirection === 'left') {
                            setAiNextShot(aiPrevShot - 2);
                        } else if (aiNextShotDirection === 'right') {
                            setAiNextShot(aiPrevShot + 2);
                        } else if (aiNextShotDirection === 'up') {
                            setAiNextShot(aiPrevShot - 20);
                        } else if (aiNextShotDirection === 'down') {
                            setAiNextShot(aiPrevShot + 20);
                        };

                    // If this AI shot missed
                    } else {
                        setAiNextShot('');
                        setAiNextShotDirection('');
                    };
                    return;
                };
                
                // If next shot not scheduled
                // Generate primer shots
                let temporaryPrimerShots = [];
                if ((!leftEdge.includes(aiPrevShot - 1)) && (!checkIfShotHit(playerGameboard,(aiPrevShot - 1))) && (!checkIfShotMissed(playerGameboard,(aiPrevShot - 1)))) {
                    temporaryPrimerShots.push(0);
                }
                if ((!rightEdge.includes(aiPrevShot + 1)) && (!checkIfShotHit(playerGameboard,(aiPrevShot + 1))) && (!checkIfShotMissed(playerGameboard,(aiPrevShot + 1)))) {
                    temporaryPrimerShots.push(1);
                }
                if ((!topEdge.includes(aiPrevShot - 10)) && (!checkIfShotHit(playerGameboard,(aiPrevShot - 10))) && (!checkIfShotMissed(playerGameboard,(aiPrevShot - 10)))) {
                    temporaryPrimerShots.push(2);
                }
                if ((!bottomEdge.includes(aiPrevShot + 10)) && (!checkIfShotHit(playerGameboard,(aiPrevShot + 10))) && (!checkIfShotMissed(playerGameboard,(aiPrevShot + 10)))) {
                    temporaryPrimerShots.push(3);
                }

                if (temporaryPrimerShots.length === 0) {
                    while (cellToHit === null || aiPrevShots.includes(cellToHit)) {
                        cellToHit = generateRandomNumber(100);
                    };
                    aiPlayer.attack(playerGameboard, cellToHit);
                    setAiPrevShot(cellToHit);
                    setAiPrevShots([...aiPrevShots, cellToHit]);
                    return;
                }

                cellToHit = temporaryPrimerShots[Math.floor(Math.random() * temporaryPrimerShots.length)]

                switch (cellToHit) {

                    case 0:
                        console.log("D")
                        aiPlayer.attack(playerGameboard, (aiPrevShot - 1));
                        setAiPrevShot(aiPrevShot - 1);
                        setAiPrevShots([...aiPrevShots, (aiPrevShot - 1)]);

                        if (checkIfShipPresent(playerGameboard, (aiPrevShot - 1))) {   // Using this function because of async nature of state
                            setAiNextShot(aiPrevShot - 2);
                            setAiNextShotDirection('left');
                        };
                        return;

                    case 1:
                        console.log("E")
                        aiPlayer.attack(playerGameboard, (aiPrevShot + 1));
                        setAiPrevShot(aiPrevShot + 1);
                        setAiPrevShots([...aiPrevShots, (aiPrevShot + 1)]);

                        if (checkIfShipPresent(playerGameboard, (aiPrevShot + 1))) {
                            setAiNextShot(aiPrevShot + 2);
                            setAiNextShotDirection('right');
                        };
                        return;

                    case 2:
                        console.log("F")
                        aiPlayer.attack(playerGameboard, (aiPrevShot - 10));
                        setAiPrevShot(aiPrevShot - 10);
                        setAiPrevShots([...aiPrevShots, (aiPrevShot - 10)]);

                        if (checkIfShipPresent(playerGameboard, (aiPrevShot - 10))) {
                            setAiNextShot(aiPrevShot - 20);
                            setAiNextShotDirection('up');
                        };
                        return;

                    case 3:
                        console.log("G")
                        aiPlayer.attack(playerGameboard, (aiPrevShot + 10));
                        setAiPrevShot(aiPrevShot + 10);
                        setAiPrevShots([...aiPrevShots, (aiPrevShot + 10)]);

                        if (checkIfShipPresent(playerGameboard, (aiPrevShot + 10))) {
                            setAiNextShot(aiPrevShot + 20);
                            setAiNextShotDirection('down');
                        };
                        return;
                    default:
                        console.log(cellToHit)
                        setAiNextShot('');
                        setAiNextShotDirection('');
                        console.log("BROKEN");
                        return;
                        // Do something
                };
            };
        });  
    };

    const toggleTurn = () => {
        (turn === true) ? setTurn(false) : setTurn(true);
    };

    const onClickHandler = (e) => {
        if (playerGameboard.checkIfAllShipsSunk()) {
            setWinner('ai');
            setShowOverlay(true);
        } else if (aiGameboard.checkIfAllShipsSunk()) {
            setWinner('human');
            setShowOverlay(true);
        };
        if ((turn === true) && (!checkIfShotHit(aiGameboard, e.target.id)) && (!checkIfShotMissed(aiGameboard, e.target.id))) {
            if (checkIfShotHit(aiGameboard, e.target.id)) {
            }
            humanPlayer.attack(aiGameboard, e.target.id);
            aiSelection();
        };
    };

    const createPlayerGrid = (playerGameboard) => {

        if (!!playerGameboard) {

            let ships = [];
            let hitShips = [];
            let missedShots = [];

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

            if (playerGameboard.missedShots.length !== 0) {
                for (let i = 0; i < playerGameboard.missedShots.length; i++) {
                    missedShots.push(playerGameboard.missedShots[i]);
                };
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
                if (missedShots.includes(counter)) {
                    shipStatus = 'miss';
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
            let missedShots = [];

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

            if (aiGameboard.missedShots.length !== 0) {
                for (let i = 0; i < aiGameboard.missedShots.length; i++) {
                    missedShots.push(aiGameboard.missedShots[i]);
                };
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
                if (missedShots.includes(counter)) {
                    shipStatus = 'miss';
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
        };
    };

    const renderOverlay = () => {
        if (showOverlay) {
            if (winner === 'ai') {
                return (
                    <div className="overlay-container">
                        <h1 className="overlay-container__header">AI WON!</h1>
                        <button className="overlay-container__button">Play Again</button>
                    </div>
                );
            };
            return (
                <div className="overlay-container">
                    <h1 className="overlay-container__header">YOU WON!</h1>
                    <button className="overlay-container__button">Play Again</button>
                </div>
            );
        };
    };
   
    useEffect(() => {
        setPlayerGameboard(props.playerSetupGameboard);
        setAiGameboard(props.aiSetupGameboard);
	}, [props]);

    return (
        <>
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
            {renderOverlay()}
        </>
    );
}

export default Game;