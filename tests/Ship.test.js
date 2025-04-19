import Ship  from '../src/modules/Ship.js';

describe('Ship', () => {
    let ship;

    beforeEach(() => {
        ship = new Ship(4);
    });

    test('should be created with the correct length', () => {
        expect(ship.length).toBe(4);
    });

    test('should have 0 hits when created', () => {
        expect(ship.hits).toBe(0);
    });

    test('should increase hits when hit() is called', () => {
        ship.hit();
        expect(ship.hits).toBe(1);
        ship.hit();
        expect(ship.hits).toBe(2);
    });

    test('should be sunk when the number of hits equals the length of the ship', () => {
        for (let i = 0; i < 4; i++) {
            ship.hit();
        }
        expect(ship.isSunk()).toBe(true);
    });

    test('should not be sunk before reaching its length in hits', () => {
        ship.hit();
        expect(ship.isSunk()).toBe(false);
    });
});