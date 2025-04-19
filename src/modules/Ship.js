class Ship {
    static length3Count = 0;

    constructor(length) {
        this.length = length;
        this.hits = 0;
        this.name = this.assignName();
    }

    assignName() {
        switch (this.length) {
            case 5:
                return 'Aircraft Carrier';
            case 4:
                return 'Battleship';
            case 3:
                Ship.length3Count += 1;
                return Ship.length3Count === 1 ? 'Submarine' : 'Destroyer';
            case 2:
                return 'Patrol Boat';
            default:
                return 'Unknown Ship';
        }
    }

    hit() {
        this.hits += 1;
    }

    isSunk() {
        return this.hits === this.length;
    }
}

export default Ship;