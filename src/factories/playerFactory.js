import gameboardFactory from './gameboardFactory';

// --------------------------------------------------
// Desc: Contains the factory function for player
// --------------------------------------------------

const playerFactory = (name) => {

    const playerBoard = gameboardFactory();

    const attack = (cell, player) => {
        player.playerBoard.receiveAttack(cell);
    };

    return {
        name,
        playerBoard,
        attack
    }

};

export default playerFactory;