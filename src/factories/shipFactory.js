
// --------------------------------------------------
// Desc: Contains the factory function for ship
// --------------------------------------------------

const shipFactory = (id, position) => {
    const hits = [];

    const hit = (cell) => {
        if (position.includes(cell)) {
            hits.push(cell);
        };
    };

    const isSunk = () => {

        const sortedHits = hits.concat().sort();
        
        if (sortedHits.length === position.length) {
            return true
        };
        return false;
    };

    return { 
        id,
        position,
        hits,
        hit,
        isSunk
    };
};

export default shipFactory;