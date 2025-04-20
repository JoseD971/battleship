import Ship from './Ship.js';
import Gameboard from './Gameboard.js';
import Player from './Player.js';

class Game {
    constructor() {
        this.eventListeners();
        this.player = new Player('real');
    }

    initGame() {
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

    placeShip(row, col) {
        const board = this.player.gameboard;
    
        if (this.selectedOrientation === 'horizontal') {
            if (col + this.selectedShipLength <= 10) {
                for (let i = 0; i < this.selectedShipLength; i++) {
                    board.board[row][col + i] = new Ship(this.selectedShipLength);
                }
            }
        } else if (this.selectedOrientation === 'vertical') {
            if (row + this.selectedShipLength <= 10) {
                for (let i = 0; i < this.selectedShipLength; i++) {
                    board.board[row + i][col] = new Ship(this.selectedShipLength);
                }
            }
        }
    
        this.highlightPossiblePlacements(row, col);
    }

    renderBoards() {
        this.renderBoard('playerBoard', this.player.gameboard, false);
        this.renderBoard('computerBoard', this.computer.gameboard, true);
    }

    renderInitialBoard(boardId) {
        const boardElement = document.getElementById(boardId);
        boardElement.innerHTML = '';

        for (let row = 0; row < 10; row++) {
            for (let col = 0; col < 10; col++) {
                const cell = document.createElement('div');
                cell.classList.add('cell');
                cell.id = `${boardId}Cell-${row}-${col}`;
                cell.setAttribute('data-row', row);
                cell.setAttribute('data-col', col);
                cell.addEventListener('mouseenter', () => {
                    if (this.selectedShipLength) {
                        this.highlightPossiblePlacements(row, col);
                    }
                });
                cell.addEventListener('click', () => {
                    if (this.selectedShipLength) {
                        this.placeShip(row, col);
                    }
                });
                boardElement.appendChild(cell);
            }
        }
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
                    } else {
                        cell.classList.add('miss');
                    }
                }
            }
        }, 1000);
    }

    eventListeners() {
        var gameBtn = document.getElementById('startNewGame');
        const orientation = document.querySelectorAll('input[name="orientation"]');
        const ships = ['aircraft', 'battleship', 'submarine', 'destroyer', 'patrol'];

        gameBtn.addEventListener('click', () => {
            var playground = document.getElementById('playground');
            var config = document.getElementById('game-config');

            playground.style.cssText = 'display: flex; justify-content: center; gap: 100px;';
            config.style.cssText = 'display: none;'
            this.initGame();
        });

        ships.forEach(ship => {
            const element = document.getElementById(ship);
            if (element) {
                element.addEventListener('click', () => {
                    this.selectedShip(element);
                });
            }
        });

        orientation.forEach(radioButton => {
            radioButton.addEventListener('change', () => {
                this.selectedOrientation = document.querySelector('input[name="orientation"]:checked').value;

                this.highlightPossiblePlacements();
            });
        });
    }

    selectedShip(ship) {
        const ids = ['aircraft', 'battleship', 'submarine', 'destroyer', 'patrol'];

        ids.forEach(id => {
            const elemento = document.getElementById(id);
            if (elemento) {
                elemento.classList.remove('selected');
            }
        });
        
        ship.classList.add('selected');

        this.selectedShipLength = this.getShipLength(ship.id);
        this.selectedOrientation = document.querySelector('input[name="orientation"]:checked').value;

        this.highlightPossiblePlacements();
    }

    getShipLength(shipId) {
        switch (shipId) {
            case 'aircraft': return 5;
            case 'battleship': return 4;
            case 'submarine': return 3;
            case 'destroyer': return 3;
            case 'patrol': return 2;
            default: return 0;
        }
    }

    highlightPossiblePlacements(row, col) {
        const board = document.getElementById('initial-board');
        const cells = board.getElementsByClassName('cell');

        Array.from(cells).forEach(cell => {
            cell.classList.remove('highlighted');
        });
    
        if (this.selectedOrientation === 'horizontal') {
            if (col + this.selectedShipLength <= 10) {
                for (let i = 0; i < this.selectedShipLength; i++) {
                    const cell = document.getElementById(`initial-boardCell-${row}-${col + i}`);
                    if (cell) {
                        cell.classList.add('highlighted');
                    }
                }
            }
        } else if (this.selectedOrientation === 'vertical') {
            if (row + this.selectedShipLength <= 10) {
                for (let i = 0; i < this.selectedShipLength; i++) {
                    const cell = document.getElementById(`initial-boardCell-${row + i}-${col}`);
                    if (cell) {
                        cell.classList.add('highlighted');
                    }
                }
            }
        }
    }    
}

export default Game;