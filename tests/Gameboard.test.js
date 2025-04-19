import Ship from '../src/modules/Ship.js';
import Gameboard from '../src/modules/Gameboard.js';

describe('Gameboard', () => {
    let gameboard;
    let ship1;
    let ship2;

    beforeEach(() => {
        gameboard = new Gameboard();
        ship1 = new Ship(4);
        ship2 = new Ship(3);
        gameboard.placeShip(ship1, [0, 0], 'horizontal');
        gameboard.placeShip(ship2, [5, 5], 'vertical');
    });

    test('should place ships correctly on the gameboard', () => {
        expect(gameboard.board[0][0]).toBe(ship1);
        expect(gameboard.board[0][1]).toBe(ship1);
        expect(gameboard.board[0][2]).toBe(ship1);
        expect(gameboard.board[0][3]).toBe(ship1);

        expect(gameboard.board[5][5]).toBe(ship2);
        expect(gameboard.board[6][5]).toBe(ship2);
        expect(gameboard.board[7][5]).toBe(ship2);        
    });

    test('should register a hit on a ship', () => {
        gameboard.receiveAttack([0, 0]);
        expect(ship1.hits).toBe(1);
    });

    test('should register a miss correctly', () => {
        gameboard.receiveAttack([9, 9]);
        expect(gameboard.missedAttacks).toContainEqual([9, 9]);
    });

    test('should correctly report if all ships are sunk', () => {
        for (let i = 0; i < 4; i++) {
            gameboard.receiveAttack([0, i]);            
        }
        for (let i = 0; i < 3; i++) {
            gameboard.receiveAttack([5 + i, 5]);            
        }
        expect(gameboard.allShipsSunk()).toBe(true);
    });

    test('should return false if not all ships are sunk', () => {
        gameboard.receiveAttack([0, 0]);
        expect(gameboard.allShipsSunk()).toBe(false);
    });
});