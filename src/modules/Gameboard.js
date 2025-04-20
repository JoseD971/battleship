class Gameboard {
    constructor() {
        this.board = [];
        this.missedAttacks = [];
        this.ships = [];
        this.createEmptyBoard();
    }

    createEmptyBoard() {
        for (let i = 0; i < 10; i++) {
            this.board[i] = [];
            for (let j = 0; j < 10; j++) {
                this.board[i][j] = null;
            }
        }
    }

    placeShip(ship, coordinates, orientation) {
        const [x, y] = coordinates;

        if (!this.canPlaceShip(ship, x, y, orientation)) {
            throw new Error('The ship cannot be placed in that position..');
        }

        for (let i = 0; i < ship.length; i++) {
            if (orientation === 'horizontal') {
                this.board[x][y + i] = ship;
            } else if (orientation === 'vertical') {
                this.board[x + i][y] = ship;
            }
        }
    }

    canPlaceShip(ship, x, y, orientation) {
        if (orientation === 'horizontal') {
            if (y + ship.length > 10) return false;
            for (let i = 0; i < ship.length; i++) {
                if (this.board[x][y + i] !== null) return false;
            }
        } else if (orientation === 'vertical') {
            if (x + ship.length > 10) return false;
            for (let i = 0; i < ship.length; i++) {
                if (this.board[x + i][y] !== null) return false;
            }
        }
    
        return true;
      }

    receiveAttack(coordinates) {
        const [x, y] = coordinates;
        const ship = this.board[x][y];

        if(ship) {
            ship.hit();
        } else {
            this.missedAttacks.push(coordinates);
        }
    }

    allShipsSunk() {
        return this.ships.every(ship => ship.isSunk());
    }
}

export default Gameboard;