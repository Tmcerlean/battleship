// --------------------------------------------------
// Desc: Contains the factory function for player
// --------------------------------------------------

const playerFactory = () => {

    const attack = (gameboard, cell) => {
        gameboard.receiveAttack(cell);
    };

    return {
        attack
    }
};

export default playerFactory;