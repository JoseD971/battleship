class Gameboard {
    constructor() {
        this.board = Array(10).fill().map(() => Array(10).fill(null));
        this.attacks = [];
    }

    placeShip(ship, coordinates, orientation) {
        const [x, y] = coordinates;
    
        if (!this.canPlaceShip(ship, x, y, orientation)) {
            throw new Error('The ship cannot be placed in that position.');
        }
    
        let shipCoordinates = [];
    
        for (let i = 0; i < ship.length; i++) {
            if (orientation === 'horizontal') {
                this.board[x][y + i] = ship;
                shipCoordinates.push([x, y + i]);
            } else if (orientation === 'vertical') {
                this.board[x + i][y] = ship;
                shipCoordinates.push([x + i, y]);
            }
        }
    
        ship.coordinates = shipCoordinates;
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
    
        if (ship === null) {
            this.attacks.push([x, y]);
            return false;
        } else {
            ship.hit();
            this.attacks.push([x, y]);
            return true;
        }
    }
    
    allShipsSunk() {
        return this.board.flat().every(cell => cell === null || cell.isSunk());
    }    
}

export default Gameboard;