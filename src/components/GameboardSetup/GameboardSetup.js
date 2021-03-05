import React, { useEffect, useState, useLayoutEffect } from 'react';
import gameboardFactory from '../../factories/gameboardFactory';
import Table from '../Reusable/Table';
import './GameboardSetup.css';

// -----------------------------------------------
//
// Desc: Gameboard setup phase of game
//
// -----------------------------------------------

let playerGameboard = gameboardFactory();

const GameboardSetup = () => {
	const [humanSetupGrid, setHumanSetupGrid] = useState([]);
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

	const createGrid = () => {
		const cells = [];
		for (let i = 0; i < 100; i++) {
			cells.push(0);
		};
    };
    
	const createUiGrid = () => {
        const cells = [];
		for (let i = 0; i < 100; i++) {
				cells.push(i);
        }
        let counter = -1;
        const result = cells.map((cell) => {
            counter++;
            return <div className='cell' id={counter} />;
		});
		setHumanSetupGrid(result);
	};

	const setUpPlayerGrid = () => {
		// createGrid('grid');
		createUiGrid();
	}

	const currentShip = () => {
		return ships[placedShips];
	};

	const clickListener = (e) => {
		e.stopImmediatePropagation();
		let direction = currentShip().direction;
		let start = parseInt(e.target.id);
		let end = start + currentShip().length - 1;
		if (playerGameboard.checkValidCoordinates(direction, start, end)) {
			playerGameboard.placeShip(placedShips, direction, start, end);
			setPlacedShips(oldValue => oldValue + 1);
			console.log(placedShips);
		}
	};

	const setEventListeners = () => {
		const gameboardArray = Array.from(document.querySelectorAll(".cell"));
		gameboardArray.forEach((cell) => {
			cell.addEventListener("click", (e) => {
				clickListener(e);
			});
			cell.addEventListener("mouseover", (e) => {
				e.stopImmediatePropagation();
				let direction = currentShip().direction;
				let start = parseInt(cell.id);
				let end = start + currentShip().length - 1;
				if (currentShip().direction === 'horizontal') {
					const newShip = [];
					if (playerGameboard.checkValidCoordinates(direction, start, end)) {
						for (let i = start; i <= end; i++) {
							newShip.push(i);
						};
						newShip.forEach((cell) => {
							gameboardArray[cell].classList.add('test');
						})
					}
				} else {
					const newShip = [];
					if (playerGameboard.checkValidCoordinates(direction, start, end)) {
						for (let i = start; i <= end; i += 10) {
							newShip.push(i);  
						};
						newShip.forEach((cell) => {
							gameboardArray[cell].classList.add('test');
						})
					}
				}
			})
			cell.addEventListener("mouseleave", (e) => {
				e.stopImmediatePropagation();
				let direction = currentShip().direction;
				let start = parseInt(cell.id);
				let end = start + currentShip().length - 1;
				if (currentShip().direction === 'horizontal') {
					const newShip = [];
					if (playerGameboard.checkValidCoordinates(direction, start, end)) {
						for (let i = start; i <= end; i++) {
							newShip.push(i);
						};
						newShip.forEach((cell) => {
							gameboardArray[cell].classList.remove('test');
						})
					}
				} else {
					const newShip = [];
					if (playerGameboard.checkValidCoordinates(direction, start, end)) {
						for (let i = start; i <= end; i += 10) {
							newShip.push(i);  
						};
						newShip.forEach((cell) => {
							gameboardArray[cell].classList.remove('test');
						})
					}
				}
			})
		});
	};

	const removeEventListeners = () => {
		const gameboardArray = Array.from(document.querySelectorAll(".cell"));
		gameboardArray.forEach((cell) => {
			cell.removeEventListener("click", (e) => {
				clickListener(e);
			});
		});
	};

	useEffect(() => {
		setUpPlayerGrid();
		// setUpComputerGrid();
	}, []);

	useEffect(() => {
		console.log(humanSetupGrid)
	}, [humanSetupGrid]);

	// Re-render the component to enable event listeners to be added to generated grid
	useLayoutEffect(() => {
		setEventListeners();
	});

	useEffect(() => {
		removeEventListeners();
		setEventListeners();
		console.log(placedShips)
	}, [placedShips])

    return (
        <div className="setup-container">
            <div className="setup-information">
                <p className="setup-information__p">Add your ships!</p>
                <button className="setup-information__btn" onClick={() => console.log(placedShips)}>Rotate</button>
            </div>
            <div className="setup-grid">
				<Table grid={humanSetupGrid} />
            </div>
        </div>
    );
}

export default GameboardSetup;