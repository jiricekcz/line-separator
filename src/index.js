const constants = require('./constants.js');
module.exports = {
    LineSegment: class LineSegment {
        constructor(length) {
            this.length = length;
        }
    },
    Line: class Line extends Array {
        constructor(...lineSegments) {
            super(...lineSegments);
        }
        get lineLength() {
            var s = 0;
            for (var h of this) {
                s += h.length;
            }
            return s;
        }
        static calc(length, inventory) {
            inventory.normalize();
            // If can be represented by a single piece
            var lowestL = Number.POSITIVE_INFINITY;
            for (var l of inventory.keys()) {
                if (l >= length) {
                    if (lowestL > l) lowestL = l;
                }
            }
            if (lowestL != Number.POSITIVE_INFINITY) {
                if (lowestL != length) inventory.addOne(lowestL - length);
                inventory.removeOne(lowestL);
                return new this(new module.exports.LineSegment(length));
            }
            // odds
            var odds = [];
            for (var l of inventory.keys()) {
                var inv = inventory.duplicate();
                inv.deinfinitify(constants.infinity);
                var r = inventory.deinfinitify(constants.infinity);
                var halfInv = inv.half();
                var nl = (length - l) / 2;
                var side = this.calc(nl, halfInv);
                halfInv = halfInv.multiply(2);
                halfInv.removeOne(l);
                odds.push({ l: new this(...side, new module.exports.LineSegment(l), ...side), inv: module.exports.Inventory.findUsed(inventory, halfInv) });
                if (r) inventory.infinitify(constants.infinity);
            }
            // even
            var r = inventory.deinfinitify(constants.infinity);
            var even;
            var halfInv = inventory.half();
            var nl = length / 2;
            var side = this.calc(nl, halfInv);
            halfInv = halfInv.multiply(2);
            even = { l: new this(...side, ...side), inv: module.exports.Inventory.findUsed(inventory, halfInv) };
            if (r) inventory.infinitify(constants.infinity);

            // Find the best
            var alla = [...odds, even];
            var all = alla.map(v => v.l);
            var b = { q: Number.NEGATIVE_INFINITY };
            for (var i = 0; i < all.length; i++) {
                var l = all[i];
                var quall = module.exports.Line.determineQualityIndex(l, alla[i].inv)
                if (b.q < quall) (b.q = quall, b.l = l, b.i = i);
            }
            var final = b.l;
            inventory.updateWithUsed(alla[b.i].inv);
            return final;
        }
        static determineQualityIndex(line, used) {
            var avg = line.lineLength / line.length;
            var maxVariation = null;
            var trashMat = used.sumPositive() - line.lineLength;
            for (var segm of line) {
                if (maxVariation == null || maxVariation > Math.abs(avg - segm.length)) maxVariation = Math.abs(avg - segm.length);
            }
            return (maxVariation + 10) / line.length - 666 * trashMat;
        }
    },
    Inventory: class Inventory extends Map {
        constructor(segements) {
            super();
            for (var s in segements) {
                this.set(Number(s), segements[s]);
            }
        }
        normalize() {
            for (var h of this.keys()) {
                if (this.get(h) < 1) this.delete(h);
                this.set(h, Math.floor(this.get(h)));
            }
        }
        removeZeros() {
            for (var h of this.keys()) {
                if (this.get(h) == 0) this.delete(h);
                this.delete(h, Math.floor(this.get(h)));
            }
        }
        half() {
            var n = {};
            for (var h of this.keys()) {
                n[h] = this.get(h) / 2;
            }
            var f = new module.exports.Inventory(n);
            f.normalize();
            return f;
        }
        multiply(num) {
            var n = {};
            for (var h of this.keys()) {
                n[h] = (this.get(h) || 0) * num;
            }
            var f = new module.exports.Inventory(n);
            return f;
        }
        duplicate() {
            var n = {};
            for (var h of this.keys()) {
                n[h] = this.get(h);
            }
            var f = new module.exports.Inventory(n);
            return f;
        }
        removeOne(key) {
            if (this.has(key)) {
                this.set(key, this.get(key) - 1);

            } else this.set(key, -1);
        }
        addOne(key) {
            if (this.has(key)) {
                this.set(key, this.get(key) + 1);
            } else this.set(key, 1);
        }
        static findUsed(originalInv, newInv) {
            var h = {}
            for (var l of newInv.keys()) {
                if (Number.isNaN((originalInv.get(l) || 0) - newInv.get(l))) {
                    h[l] = 0;
                } else h[l] = (originalInv.get(l) || 0) - newInv.get(l);
            }
            return new this(h);
        }
        updateWithUsed(used) {
            for (var key of used.keys()) {
                if (!this.has(key)) this.set(key, 0);
                this.set(key, this.get(key) - used.get(key));
            }
            this.normalize();
            return this;
        }
        sum() {
            var h = 0;
            for (var f of this.keys()) {
                h += this.get(f) * f;
            }
            return h;
        }
        sumPositive() {
            var h = 0;
            for (var f of this.keys()) {
                if (this.get(f) > 0) h += this.get(f) * f;
            }
            return h;
        }
        deinfinitify(infinity) {
            var r = false;
            for (var h of this.keys()) {
                if (this.get(h) == Number.POSITIVE_INFINITY) { this.set(h, infinity * 5); r = true; }
                if (this.get(h) == Number.NEGATIVE_INFINITY) { this.set(h, -infinity * 5); r = true; }
            }
            return r;
        }
        infinitify(infinity) {
            for (var h of this.keys()) {
                if (this.get(h) > infinity) this.set(h, Number.POSITIVE_INFINITY);
                if (this.get(h) < -infinity) this.set(h, Number.NEGATIVE_INFINITY);
            }
        }
    },
    LinesManager: class LinesManager {
        constructor(lineLengths, inventoryObject) {
            this.lineLengths = lineLengths;
            this.inventory = new module.exports.Inventory(inventoryObject);
            this.segements = [];
            this.lines = [];
            for (var ll of this.lineLengths) {

            }
        }
    }
}