import Player from '../src/modules/Player.js';
import Ship from '../src/modules/Ship.js';
import Gameboard from '../src/modules/Gameboard.js';

describe('Player', () => {
    let realPlayer;
    let computerPlayer;
    let ship1;
    let ship2;

    beforeEach(() => {
        realPlayer = new Player('real');
        computerPlayer = new Player('computer');
        ship1 = new Ship(4);
        ship2 = new Ship(3);
        realPlayer.gameboard.placeShip(ship1, [0, 0], 'horizontal');
        computerPlayer.gameboard.placeShip(ship2, [5, 5], 'vertical');
    });

    test('should create a real player with a gameboard', () => {
        expect(realPlayer.gameboard).toBeTruthy();
    });

    test('should create a computer player with a gameboard', () => {
        expect(computerPlayer.gameboard).toBeTruthy();
    });

    test('should allow real player to attack', () => {
        realPlayer.attack([5, 5], computerPlayer);
        expect(computerPlayer.gameboard.board[5][5].hits).toBe(1);
    });

    test('should allow computer to attak', () => {
        computerPlayer.attack([0, 0], realPlayer);
        expect(realPlayer.gameboard.board[0][0].hits).toBe(1);
    });

    test('should track missed attacks for real player', () => {
        realPlayer.attack([9, 9], computerPlayer);
        expect(computerPlayer.gameboard.attacks).toContainEqual([9, 9]);
    });
});