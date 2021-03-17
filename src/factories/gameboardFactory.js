import shipFactory from './shipFactory';

// --------------------------------------------------
// Desc: Contains the factory function for gameboard
// --------------------------------------------------

const gameboardFactory = () => {
    const shipYard = [];
	const missedShots = [];
    
    const placeShip = (id, direction, start, end) => {

        if (!checkValidCoordinates(direction, start, end)) {
            return false;
        };

        if (checkIfShipPresent(direction, start, end)) {
            return false;
        };
        
        const newShip = [];

        if (direction === 'horizontal') {
            for (let i = start; i <= end; i++) {
                newShip.push(i);
            };
        } else {
            for (let i = start; i <= end; i += 10) {
                newShip.push(i);  
            };
        };
        
        shipYard.push(shipFactory(id, newShip));
    };

    const checkValidCoordinates = (direction, start, end) => {
        if (direction === 'horizontal') {
            if ((start <= 9) && (end <= 9)) {
                return true;
            } else {
                let newStart = (start/10).toString(10);
                let newEnd = (end/10).toString(10);
                if ((newStart.charAt(0)) === (newEnd.charAt(0))) {
                    return true;
                };
            };
        } else {
            if ((start <= 9) && (end <= 9)) {
                return false
            } else if (start <= 9) {
                let newStart = start.toString(10);
                let newEnd = end.toString(10);
                if ((newStart.charAt(0)) === (newEnd.charAt(1))) {
                    return true;
                };
            } else {
                let newStart = start.toString(10);
                let newEnd = end.toString(10);
                if ((newStart.charAt(1)) === (newEnd.charAt(1))) {
                    return true;
                };
            };
        };
        return false
    };

    const checkIfShipPresent = (direction, start, end) => {
        if (direction === 'horizontal') {
            for (let i = start; i <= end; i++) {
                for (const ship of shipYard) {
                    if (ship.position.includes(i)) {
                        return true;
                    }
                }
            };
            return false;
        } else {
            for (let i = start; i <= end; i += 10) {
                for (const ship of shipYard) {
                    if (ship.position.includes(i)) {
                        return true;
                    }
                }
            };
            return false;
        };
    };

    const receiveAttack = (cell) => {

        cell = parseInt(cell, 10);

        shipYard.forEach((ship) => {
            const shipPosition = ship.position;
            const shipHits = ship.hits;

            if (shipPosition.includes(cell)) {
                if (shipHits.includes(cell)) {
                    return 'Cannot Hit Same Coordinate';
                } else {
                    ship.hit(cell);
                };
            } else {
                missedShots.push(cell);
            };
        });
    };

    const checkIfAllShipsSunk = () => {
        let allShipsSunk = true;
        shipYard.forEach((ship) => {
            if (ship.isSunk() === false) {
                allShipsSunk = false;
            };
        });
        return allShipsSunk;
    };

    return { 
        checkValidCoordinates,
        checkIfShipPresent,
        placeShip,
        receiveAttack,
        shipYard,
        missedShots,
        checkIfAllShipsSunk
    };
};

export default gameboardFactory;