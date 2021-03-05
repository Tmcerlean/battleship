import gameboardFactory from '../factories/gameboardFactory';

// --------------------------------------------------
// Test for gameboardFactory.js
// --------------------------------------------------
  
describe('gameboard functions', () => {

    // Create gameboard before each test
    let gameboard;

    beforeEach(() => {
        gameboard = gameboardFactory();
	});

    test('Place ship in a coordinate', () => {
        gameboard.placeShip(0,'horizontal',0,4);

        expect(gameboard.shipYard[0].position).toStrictEqual([
            0,1,2,3,4
        ]);
    });
    
    test('Attacked a ship', () => {
        gameboard.placeShip(1,'vertical',10,40);
        gameboard.receiveAttack(30);
        const testShip = gameboard.shipYard[0];
    
        expect(testShip.hits).toStrictEqual([30]);
    });
    
    test('Missed hit on ship', () => {
        gameboard.placeShip(2,'horizontal',95,99);
        gameboard.receiveAttack(25);
        const testShip = gameboard.shipYard[0];

        expect(testShip.hits).toStrictEqual([]);
    });
      
    test('All Ships are sunk', () => {
        gameboard.placeShip(3,'vertical',25,55);
        gameboard.placeShip(4,'horizontal',15,16);
        gameboard.receiveAttack(25);
        gameboard.receiveAttack(35);
        gameboard.receiveAttack(45);
        gameboard.receiveAttack(55);
        gameboard.receiveAttack(15);
        gameboard.receiveAttack(16);

        const result = gameboard.checkIfAllShipsSunk();

        expect(result).toBeTruthy();
        expect(gameboard.shipYard[0].hits).toStrictEqual([
            25,
            35,
            45,
            55
        ]);
        expect(gameboard.shipYard[1].hits).toStrictEqual([
            15,
            16
        ]);
    }); 
});