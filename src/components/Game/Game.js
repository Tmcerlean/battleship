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
    const [aiNextPrimerShots, setAiNextPrimerShots] = useState([]);

    const humanPlayer = playerFactory();
    const aiPlayer = playerFactory();
    
    // Game loop (fire function after every move)
        // Check if player who made move won
        // If not then toggle turn

    const generateRandomNumber = (num) => {
        return Math.floor(Math.random() * num);
    };

    const checkIfShipPresent = (cell) => {
        console.log(cell)
        for (let i = 0; i < playerGameboard.shipYard.length; i++) {
            for (let j = 0; j < playerGameboard.shipYard[i].position[j]; j++) {
                console.log(playerGameboard.shipYard[i].position[j])
                if (cell === playerGameboard.shipYard[i].position[j]) {
                    return true;
                };
            };
        };
        return false;
    };

    const checkIfShotHit = (cell) => {
        for (let i = 0; i < playerGameboard.shipYard.length; i++) {
            for (let j = 0; j < playerGameboard.shipYard[i].hits[j]; j++) {
                if (cell === playerGameboard.shipYard[i].hits[j]) {
                    return true;
                };
            };
        };
        return false;
    };

    const checkIfShotMissed = (cell) => {
        for (let i = 0; i < playerGameboard.missedShots.length; i++) {
            if (cell === playerGameboard.missedShots[i]) {
                return true;
            };
        };
        return false;
    };

    useEffect(() => {
        console.log(aiNextShot);
	}, [aiNextShot]);

    const aiSelection = () => {

        console.log(`aiPrevShot: ${aiPrevShot}`)
        console.log(`aiPrevShots: ${aiPrevShots}`)
        console.log(`aiNextShot: ${aiNextShot}`)
        console.log(`aiNextShotDirection: ${aiNextShotDirection}`)
        console.log(`aiNextPrimerShots: ${aiNextPrimerShots}`)

        // Board boundaries
        const leftEdge = [0,10,20,30,40,50,60,70,80,90];
        const rightEdge = [9,19,29,39,49,59,69,79,89,99];
        const topEdge = [0,1,2,3,4,5,6,7,8,9];
        const bottomEdge = [90,91,92,93,94,95,96,97,98,99];

        let cellToHit = null;

        // If there were no previous shots played by the AI, fire an initial shot
        if (aiPrevShot === '') {
            cellToHit = generateRandomNumber(100);
            aiPlayer.attack(playerGameboard, cellToHit);
            setAiPrevShot(cellToHit);
            setAiPrevShots([...aiPrevShots, cellToHit]);
            return;
            
        // Else there was a shot played previously by the AI
        } else {
            // Fire a shot at any cell which has not been shot before
            // The previous AI shot missed
            if (!checkIfShotHit(aiPrevShot)) {
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
                if ((checkIfShotHit(aiNextShot)) || (checkIfShotMissed(aiNextShot))) {
                    setAiNextShot('');
                    setAiNextShotDirection('');
                    return;
                }
                aiPlayer.attack(playerGameboard, aiNextShot);
                setAiPrevShot(aiNextShot);
                setAiPrevShots([...aiPrevShots, aiNextShot]);

                // If this AI shot hit
                if (checkIfShipPresent(aiNextShot)) {   // Using this function because of async nature of state
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
            if (aiNextPrimerShots.length === 0) {
                // Generate primer shots
                let temporaryPrimerShots = [];
                if ((!leftEdge.includes(aiPrevShot - 1)) && (!checkIfShotHit(aiPrevShot - 1)) && (!checkIfShotMissed(aiPrevShot - 1))) {
                    // setAiNextPrimerShots(...aiNextPrimerShots, 0);
                    temporaryPrimerShots.push(0);
                }
                if ((!rightEdge.includes(aiPrevShot + 1)) && (!checkIfShotHit(aiPrevShot + 1)) && (!checkIfShotMissed(aiPrevShot + 1))) {
                    // setAiNextPrimerShots(...aiNextPrimerShots, 1);
                    temporaryPrimerShots.push(1);
                }
                if ((!topEdge.includes(aiPrevShot - 10)) && (!checkIfShotHit(aiPrevShot - 10)) && (!checkIfShotMissed(aiPrevShot - 10))) {
                    // setAiNextPrimerShots(...aiNextPrimerShots, 2);
                    temporaryPrimerShots.push(2);
                }
                if ((!bottomEdge.includes(aiPrevShot + 10)) && (!checkIfShotHit(aiPrevShot + 10)) && (!checkIfShotMissed(aiPrevShot + 10))) {
                    // setAiNextPrimerShots(...aiNextPrimerShots, 3);
                    temporaryPrimerShots.push(3);
                }

                cellToHit = temporaryPrimerShots[Math.floor(Math.random() * temporaryPrimerShots.length)];
                let newPrimerShots = '';

                switch (cellToHit) {

                    case 0:
                        console.log(checkIfShipPresent(aiPrevShot - 1));
                        aiPlayer.attack(playerGameboard, (aiPrevShot - 1));
                        setAiPrevShot(aiPrevShot - 1);
                        setAiPrevShots([...aiPrevShots, (aiPrevShot - 1)]);

                        if (checkIfShipPresent(aiPrevShot - 1)) {   // Using this function because of async nature of state
                            setAiNextShot(aiPrevShot - 2);
                            setAiNextShotDirection('left');
                        };
                        break;

                    case 1:
                        console.log(checkIfShipPresent(aiPrevShot + 1));
                        aiPlayer.attack(playerGameboard, (aiPrevShot + 1));
                        setAiPrevShot(aiPrevShot + 1);
                        setAiPrevShots([...aiPrevShots, (aiPrevShot + 1)]);

                        if (checkIfShipPresent(aiPrevShot + 1)) {
                            setAiNextShot(aiPrevShot + 2);
                            setAiNextShotDirection('right');
                        };
                        break;

                    case 2:
                        console.log(checkIfShipPresent(aiPrevShot - 10));
                        aiPlayer.attack(playerGameboard, (aiPrevShot - 10));
                        setAiPrevShot(aiPrevShot - 10);
                        setAiPrevShots([...aiPrevShots, (aiPrevShot - 10)]);

                        if (checkIfShipPresent(aiPrevShot - 10)) {
                            setAiNextShot(aiPrevShot - 20);
                            setAiNextShotDirection('up');
                        };
                        break;

                    case 3:
                        console.log(checkIfShipPresent(aiPrevShot + 10));
                        aiPlayer.attack(playerGameboard, (aiPrevShot + 10));
                        setAiPrevShot(aiPrevShot + 10);
                        setAiPrevShots([...aiPrevShots, (aiPrevShot + 10)]);

                        if (checkIfShipPresent(aiPrevShot + 10)) {
                            setAiNextShot(aiPrevShot + 20);
                            setAiNextShotDirection('down');
                        };
                        break;
                    default:
                        // Do something
                }
                return;
            };
        };
    };

    const toggleTurn = () => {
        (turn === true) ? setTurn(false) : setTurn(true);
    };

    const onClickHandler = (e) => {
   
        // If winner
        if (playerGameboard.checkIfAllShipsSunk()) {
            props.setWinner('ai');
            props.handleNextStepChange();
        } else if (aiGameboard.checkIfAllShipsSunk()) {
            props.setWinner('human');
            props.handleNextStepChange();
        };
        if (turn === true) {
            console.log("player fired");
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