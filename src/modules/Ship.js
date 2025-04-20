class Ship {
    static length3Count = 0;

    constructor(length, coordinates = []) {
        this.length = length;
        this.hits = 0;
        this.name = this.assignName();
        this.coordinates = coordinates;
    }

    assignName() {
        switch (this.length) {
            case 5:
                return 'Aircraft Carrier';
            case 4:
                return 'Battleship';
            case 3:
                Ship.length3Count += 1;
                if (Ship.length3Count  === 2) Ship.length3Count = 0;
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

    containsCoordinate([x, y]) {
        return this.coordinates.some(([cx, cy]) => cx === x && cy === y);
    }
}

export default Ship;