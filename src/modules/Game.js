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
                const cellContent = gameboard.board[row][col];
                cell.classList.add('cell');
                cell.id = `${boardId}Cell-${row}-${col}`;
    
                if (cellContent !== null) {
                    if (cellContent.hits > 0) {
                        cell.classList.add('hit');
                    } else {
                        cell.classList.add('ship');
                    }
                }
    
                if (isComputer) {
                    if (!gameboard.attacks.some(([x, y]) => x === row && y === col)) {
                        cell.addEventListener('click', () => {

                            if (this.currentPlayer === this.player && !this.gameOver) {
                                const hit = this.handleAttack(row, col, this.computer);
                                const cell = document.getElementById(`computerBoardCell-${row}-${col}`); 

                                if (hit) {
                                    cell.classList.add('hit');
                                } else {
                                    cell.classList.add('miss'); 
                                }
                            }
                        });
                    }
                }

                boardElement.appendChild(cell);
            }
        }
    }
    
    handleAttack(row, col, opponent) {
        if (this.gameOver) return false;
    
        if (opponent.gameboard.attacks.some(([x, y]) => x === row && y === col)) {
            alert("You have already attacked this cell! Please choose another.");
            return false;
        }
    
        const hit = opponent.gameboard.receiveAttack([row, col]);
    
        if (hit) {
            const ship = opponent.gameboard.board[row][col];
            if (ship.isSunk()) {
                if(this.currentPlayer === this.player) {
                    alert(`You have sunk the computer's ${ship.name}!`);
                } else {
                    alert(`The computer has sunk your ${ship.name}!`);
                }
            }
        }
    
        if (opponent.gameboard.allShipsSunk()) {
            alert(`${this.currentPlayer.type} wins!`);
            this.gameOver = true;
            return false;
        }
    
        this.switchTurn();
    
        if (this.currentPlayer === this.computer && !this.gameOver) {
            this.computerTurn();
        }
    
        return hit;
    }

    switchTurn() {
        this.currentPlayer = this.currentPlayer === this.player ? this.computer : this.player;
        console.log(this.currentPlayer);
    }

    computerTurn() {
        setTimeout(() => {
            let attackMade = false;
            while (!attackMade) {
                let row = Math.floor(Math.random() * 10);
                let col = Math.floor(Math.random() * 10);

                if (!this.player.gameboard.attacks.some(([ax, ay]) => ax === row && ay === col)) {
                    const hit = this.handleAttack(row, col, this.player);
                    const cell = document.getElementById(`playerBoardCell-${row}-${col}`);
                    attackMade = true;

                    if (hit) {
                        cell.classList.add('hit');
                        console.log(cell);
                    } else {
                        cell.classList.add('miss');
                        console.log(cell);
                    }
                }
            }
        }, 1000);
    }
}

export default Game;