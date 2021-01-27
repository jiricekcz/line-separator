declare namespace LineSeparator {
    class LineSegment {
        constructor(length: number);
        readonly length: number;
    }
    class Line extends Array<LineSegment> {
        constructor(...lineSegments: LineSegment[]);
        readonly lineLength: number;
        static calc(length: number, inventory: Inventory);
        static determineQualityIndex(line: Line): number;
    }
    class Inventory extends Map<number, number> {
        constructor(lines: Object);
        normalize(): void;
        half(): Inventory;
        duplicate(): Inventory;
        removeOne(key: number): void;
        addOne(key: number): void;
        updateWithUsed(used: Inventory): void;
        removeZeros(): void;
        multiply(n: number): Inventory;
        deinfinitify(n: number): boolean;
        static findUsed(originalInv: Inventory, newInv: Inventory): Inventory;
    }
    class LinesManager {
        constructor(lineLengths: Array<number>, inventoryObject: Object);
        readonly lineLengths: Array<number>;
        readonly inventory: Inventory;
        readonly segments: Array<LineSegment>;
        readonly lines: Array<Line>;
    }
}
export = LineSeparator;