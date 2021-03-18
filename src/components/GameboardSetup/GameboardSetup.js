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
			cell.classList.remove('test');
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
					gameboardArray[cell].classList.add('test');
				});
			};
		} else {
			const newShip = [];
			if (playerGameboard.checkValidCoordinates(direction, start, end)) {
				for (let i = start; i <= end; i += 10) {
					newShip.push(i);  
				};
				newShip.forEach((cell) => {
					gameboardArray[cell].classList.add('test');
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
					gameboardArray[cell].classList.remove('test');
				});
			};
		} else {
			const newShip = [];
			if (playerGameboard.checkValidCoordinates(direction, start, end)) {
				for (let i = start; i <= end; i += 10) {
					newShip.push(i);  
				};
				newShip.forEach((cell) => {
					gameboardArray[cell].classList.remove('test');
				});
			};
		};
	};

	useEffect(() => {
		setUpPlayerGrid();
		// setUpComputerGrid();
	}, []);

	useEffect(() => {
		if (placedShips >= 5){
			props.handleNextStepChange();
			props.setPlayerSetupGameboard(playerGameboard);
		}

		// Generate computer ships into a gameboard (same as with the player)
		// Add all 5 player ships once completed then trigger next step by incrementing handleNextStepChange
		// Pass player's gameboard up to App so it can be passed into Game
		// Create the gameboards so the game is ready to play

	}, [placedShips]);

    return (
        <div className="setup-container">
            <div className="setup-information">
                <p className="setup-information__p">Add your ships!</p>
                <button className="setup-information__btn" onClick={() => console.log(placedShips)}>Rotate</button>
            </div>
			<div className="setup-grid">
				<Table grid={createUiGrid()} />
			</div>
        </div>
    );
}

export default GameboardSetup;