import Gameboard from './Gameboard.js';
import Ship from './Ship.js';

class Player {
    constructor(type) {
        this.type = type;
        this.gameboard = new Gameboard();
    }

    attack(coordinates, opponent) {
        opponent.gameboard.receiveAttack(coordinates);
    }

    randomAttack(opponent) {
        let x = Math.floor(Math.random() * 10);
        let y = Math.floor(Math.random() * 10);
        opponent.gameboard.receiveAttack([x, y]);
    }
}

export default Player;