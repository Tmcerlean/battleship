import shipFactory from '../factories/shipFactory';

// --------------------------------------------------
// Test for shipFactory.js
// --------------------------------------------------
  
describe('ship functions', () => {

    // Create test ship
    let testShip;

	beforeEach(() => {
		testShip = shipFactory(2,[0, 1, 2, 3, 4]);
	});

    test('creates ship objects with hit function', () => {
        expect(testShip).toHaveProperty('hit');
    });

    test('ship does not accept a miss', () => {
        testShip.hit(12);
        expect(testShip.hits).toEqual([]);
    });

    test('ship accepts a hit', () => {
        testShip.hit(1);
        expect(testShip.hits).toEqual([1]);
    });

    test('ship accepts multiple hits', () => {
        testShip.hit(1);
        testShip.hit(4);
        expect(testShip.hits).toEqual([1,4]);
    });

    test('ship confirms the ship is sunk', () => {
        testShip.hit(0);
        testShip.hit(1);
        testShip.hit(2);
        testShip.hit(3);
        testShip.hit(4);
        expect(testShip.isSunk()).toBe(true);
    })
});

