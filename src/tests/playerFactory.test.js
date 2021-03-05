import playerFactory from '../factories/playerFactory';

// --------------------------------------------------
// Test for playerFactory.js
// --------------------------------------------------
  
describe('player functions', () => {

    // Create player before each test
    let humanPlayer;
    let aiPlayer;

    beforeEach(() => {
        humanPlayer = playerFactory("human");
        aiPlayer = playerFactory("ai");
	});

    test('Human attacks Ai player', () => {
        aiPlayer.playerBoard.placeShip(0,'horizontal',5,8);
        humanPlayer.attack(8,aiPlayer);

        expect(aiPlayer.playerBoard.shipYard[0].hits).toStrictEqual([8]);
    });

    test('Ai attacks Human Player', () => {
        humanPlayer.playerBoard.placeShip(1,'vertical',67,77);
        aiPlayer.attack(77,humanPlayer);
        
        expect(humanPlayer.playerBoard.shipYard[0].hits).toStrictEqual([77]);
    });

    test('Human misses attack to Ai player', () => {
        aiPlayer.playerBoard.placeShip(2,'horizontal',31,34);
        humanPlayer.attack(35,aiPlayer);

        expect(aiPlayer.playerBoard.missedShots).toStrictEqual([35]);
    });

    test('Ai misses attack to Human player', () => {
        humanPlayer.playerBoard.placeShip(3,'vertical',78,88);
        aiPlayer.attack(98,humanPlayer);

        expect(humanPlayer.playerBoard.missedShots).toStrictEqual([98]);
    });

    test('Human destroys Ai player ships', () => {
        aiPlayer.playerBoard.placeShip(4,'horizontal',0,4);
        humanPlayer.attack(0,aiPlayer);
        humanPlayer.attack(1,aiPlayer);
        humanPlayer.attack(2,aiPlayer);
        humanPlayer.attack(3,aiPlayer);
        humanPlayer.attack(4,aiPlayer);

        const result = aiPlayer.playerBoard.shipYard[0].isSunk();

        expect(result).toBeTruthy();
    });

    test('Ai destroys Human player ships', () => {
        humanPlayer.playerBoard.placeShip(5,'vertical',30,70);
        aiPlayer.attack(30,humanPlayer);
        aiPlayer.attack(40,humanPlayer);
        aiPlayer.attack(50,humanPlayer);
        aiPlayer.attack(60,humanPlayer);
        aiPlayer.attack(70,humanPlayer);

        const result = humanPlayer.playerBoard.shipYard[0].isSunk();

        expect(result).toBeTruthy();
    });
});

