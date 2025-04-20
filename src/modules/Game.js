import Ship from './Ship.js';
import Gameboard from './Gameboard.js';
import Player from './Player.js';

class Game {
    constructor() {
        this.player = new Player('real');
        this.computer = new Player('computer');
        this.currentPlayer = this.player;
        this.gameOver = false;
        this.setupBoards();
        this.renderBoards();
    }

    setupBoards() {
        const playerShips = [
            new Ship(5),
            new Ship(4),
            new Ship(3),
            new Ship(3),
            new Ship(2),
        ];

        const computerShips = [
            new Ship(5),
            new Ship(4),
            new Ship(3),
            new Ship(3),
            new Ship(2),
        ];

        this.placeShips(this.player.gameboard, playerShips);
        this.placeShips(this.computer.gameboard, computerShips);
    }

    placeShips(gameboard, ships) {
        ships.forEach((ship) => {
            let placed = false;
            while (!placed) {
                const startX = Math.floor(Math.random() * 10);
                const startY = Math.floor(Math.random() * 10);
                const orientation = Math.random() > 0.5 ? 'horizontal' : 'vertical';
                try {
                gameboard.placeShip(ship, [startX, startY], orientation);
                placed = true;
                } catch (error) {
                    console.log(`Cannot place the ${ship.length} length ship in (${startX}, ${startY})`);
                }
            }
        });
    }

    renderBoards() {
        this.renderBoard('playerBoard', this.player.gameboard, false);
        this.renderBoard('computerBoard', this.computer.gameboard, true);
    }

    renderBoard(boardId, gameboard, isComputer) {
        const boardElement = document.getElementById(boardId);
        boardElement.innerHTML = '';

        for (let row = 0; row < 10; row++) {
            for (let col = 0; col < 10; col++) {
                const cell = document.createElement('div');
                cell.classList.add('cell');

                if(gameboard.board[row][col] !== null) {
                    if(gameboard.board[row][col].hits > 0) {
                        cell.classList.add('hit');
                    } else {
                        cell.classList.add('ship');
                    }
                }

                if(isComputer) {
                    cell.addEventListener('click', () => {
                        if(this.currentPlayer === this.player && !this.gameOver) {
                            this.handleAttack(row, col, this.computer);
                        }
                    });
                }

                boardElement.appendChild(cell);
            }
        }
    }

    handleAttack(row, col, opponent) {
        if(this.gameOver) return;

        opponent.gameboard.receiveAttack([row, col]);
        this.renderBoards();

        if(opponent.gameboard.allShipsSunk()) {
            alert(`${this.currentPlayer.type} wins!`);
            this.gameOver = true;
            return;
        }

        this.switchTurn();

        if(this.currentPlayer === this.computer && !this.gameOver) {
            this.computerTurn();
        }
    }

    switchTurn() {
        this.currentPlayer = this.currentPlayer === this.player ? this.computer : this.player;
    }

    computerTurn() {
        setTimeout(() => {
            let attackMade = false;
            while (!attackMade) {
                let x = Math.floor(Math.random() * 10);
                let y = Math.floor(Math.random() * 10);
                if(!this.player.gameboard.board[x][y]) {
                    this.handleAttack(x, y, this.player);
                    attackMade = true;
                }
            }
        }, 1000);
    }
}

export default Game;