import React, { useEffect, useRef, useState, useLayoutEffect } from 'react';
import gameboardFactory from '../../factories/gameboardFactory';
import Table from '../Reusable/Table';
import './GameboardSetup.css';

// -----------------------------------------------
//
// Desc: Gameboard setup phase of game
//
// -----------------------------------------------

let playerGameboard = gameboardFactory();
let aiGameboard = gameboardFactory();

const GameboardSetup = (props) => {

	const [ships,_setShips] = useState([
		{
			name: 'carrier',
			length: 5,
			direction: 'horizontal'
		},
		{
			name: 'battleship',
			length: 4,
			direction: 'horizontal'
		},
		{
			name: 'cruiser',
			length: 3,
			direction: 'horizontal'
		},
		{
			name: 'submarine',
			length: 3,
			direction: 'horizontal'
		},
		{
			name: 'destroyer',
			length: 2,
			direction: 'horizontal'
		}]);

	const [placedShips, setPlacedShips] = useState(0);
 
	const createUiGrid = () => {
		const cells = [];
		for (let i = 0; i < 100; i++) {
		  cells.push(i);
		}
		let counter = -1;
		const result = cells.map((cell) => {
		  counter++;
		  return (
			<div
			  className="cell"
			  id={counter}
			  onClick={onClickHandler}
			  onMouseOut={onMouseOutHandler}
			  onMouseOver={onMouseOverHandler}
			/>
		  );
		});
		return result;
	};

	const generateAiGrid = () => {
		let aiPlacedShips = 0;
		let currentShipLength = null;
		let currentShipDirection = null;

		const generateShipDirection = () => {
			let randomNumber = Math.floor(Math.random() * 2);
			if (randomNumber === 0) {
				return 'horizontal'
			}
			return 'vertical'
		}

		while (aiPlacedShips <= 4) {
			let unavailableCells = [];
			currentShipDirection = generateShipDirection();

			if (aiPlacedShips === 0) {
				currentShipLength = 5;
			} else {
				currentShipLength = ships[aiPlacedShips].length;
				for (let i = 0; i < aiGameboard.shipYard.length; i++) {
					aiGameboard.shipYard[i].position.forEach((val) => {
						unavailableCells.push(val);
					})
				};
			};

			const generateRandom = (min, max) => {
				const num = Math.floor(Math.random() * (max - min + 1)) + min;
				return (unavailableCells.includes(num)) ? generateRandom(min, max) : num;
			}
			
			let currentShipStartCell = generateRandom(0, 99);
			let currentShipEndCell = null;
			
			if (currentShipDirection === 'horizontal') {
				currentShipEndCell = currentShipStartCell + currentShipLength - 1;
			} else {
				currentShipEndCell = currentShipStartCell + ((currentShipLength - 1) * 10);
			};
	
			if ((aiGameboard.checkValidCoordinates(currentShipDirection, currentShipStartCell, currentShipEndCell)) && (!aiGameboard.checkIfShipPresent(currentShipDirection, currentShipStartCell, currentShipEndCell))) {
				aiGameboard.placeShip(aiPlacedShips, currentShipDirection, currentShipStartCell, currentShipEndCell);
				aiPlacedShips++;
			};
		};
	};

	const setUpPlayerGrid = () => {
		createUiGrid();
	};

	const onClickHandler = (e) => {
		const direction = ships[placedShips].direction;
		const start = parseInt(e.target.id);
		const end = start + ships[placedShips].length - 1;
		const gameboardArray = Array.from(document.querySelectorAll(".cell"));
		if ((playerGameboard.checkValidCoordinates(direction, start, end)) && (!playerGameboard.checkIfShipPresent(direction, start, end))) {
			playerGameboard.placeShip(placedShips, direction, start, end);
			setPlacedShips(oldValue => oldValue + 1);
			if (ships[placedShips].direction === 'horizontal') {
				const newShip = [];
				for (let i = start; i <= end; i++) {
					newShip.push(i);
				};
				newShip.forEach((cell) => {
					gameboardArray[cell].classList.add('added-ship');
				});
			};
			} else {
				const newShip = [];
				if (playerGameboard.checkValidCoordinates(direction, start, end)) {
					for (let i = start; i <= end; i += 10) {
						newShip.push(i);  
					};
					newShip.forEach((cell) => {
						gameboardArray[cell].classList.add('added-ship');
					});
				};
			};
		gameboardArray.forEach((cell) => {
			cell.classList.remove('new-ship');
		});
	};

	const onMouseOverHandler = (e) => {
		const direction = ships[placedShips].direction;
		const start = parseInt(e.target.id);
		const end = start + ships[placedShips].length - 1;
		const gameboardArray = Array.from(document.querySelectorAll(".cell"));
		if (ships[placedShips].direction === 'horizontal') {
			const newShip = [];
			if (playerGameboard.checkValidCoordinates(direction, start, end)) {
				for (let i = start; i <= end; i++) {
					newShip.push(i);
				};
				newShip.forEach((cell) => {
					gameboardArray[cell].classList.add('new-ship');
				});
			};
		} else {
			const newShip = [];
			if (playerGameboard.checkValidCoordinates(direction, start, end)) {
				for (let i = start; i <= end; i += 10) {
					newShip.push(i);  
				};
				newShip.forEach((cell) => {
					gameboardArray[cell].classList.add('new-ship');
				});
			};
		};
	};

	const onMouseOutHandler = (e) => {
		const direction = ships[placedShips].direction;
		const start = parseInt(e.target.id);
		const end = start + ships[placedShips].length - 1;
		const gameboardArray = Array.from(document.querySelectorAll(".cell"));
		if (ships[placedShips].direction === 'horizontal') {
			const newShip = [];
			if (playerGameboard.checkValidCoordinates(direction, start, end)) {
				for (let i = start; i <= end; i++) {
					newShip.push(i);
				};
				newShip.forEach((cell) => {
					gameboardArray[cell].classList.remove('new-ship');
				});
			};
		} else {
			const newShip = [];
			if (playerGameboard.checkValidCoordinates(direction, start, end)) {
				for (let i = start; i <= end; i += 10) {
					newShip.push(i);  
				};
				newShip.forEach((cell) => {
					gameboardArray[cell].classList.remove('new-ship');
				});
			};
		};
	};

	useEffect(() => {
		setUpPlayerGrid();
		generateAiGrid();
	}, []);

	useEffect(() => {
		if (placedShips >= 5){
			props.handleNextStepChange();
			props.setPlayerSetupGameboard(playerGameboard);
			props.setAiSetupGameboard(aiGameboard);
		}
	}, [placedShips]);

    return (
        <div className="setup-container">
            <div className="setup-information">
                <p className="setup-information__p">Add your ships{props.name === '' ? '!' : `, ${props.name}!`}</p>
            </div>
			<div className="setup-grid">
				<Table grid={createUiGrid()} />
			</div>
        </div>
    );
}

export default GameboardSetup;