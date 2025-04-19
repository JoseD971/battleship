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

    placeShip(ship, startCoordinates, orientation) {
        const [x, y] = startCoordinates;
        const shipLength = ship.length;

        for (let i = 0; i < shipLength; i++) {
            if(orientation === 'horizontal') {
                this.board[x][y + i] = ship;
            } else if(orientation === 'vertical') {
                this.board[x + i][y] = ship;
            } 
        }
        this.ships.push(ship);
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