'use babel';
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
/*!
 * XAtom Debug
 * Copyright(c) 2017 Williams Medina <williams.medinaa@gmail.com>
 * MIT Licensed
 */
const path = require('path');
const Datastore = require('nedb');
const storagePath = path.resolve(atom['configDirPath'], 'storage', 'xatom');
export class Collection {
    constructor(filename) {
        this.filename = filename;
        this.db = new Datastore(path.join(storagePath), `${filename}.db`);
    }
    connect() {
        return new Promise((resolve, reject) => {
            return this.db.loadDatabase((err) => {
                if (err) {
                    reject();
                }
                else {
                    resolve(this.db);
                }
            });
        });
    }
    insert(data) {
        return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
            const db = yield this.connect();
            db.insert(data, (err, data) => {
                if (err)
                    reject(err);
                resolve(data);
            });
        }));
    }
    remove(data) {
        return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
            const db = yield this.connect();
            db.remove(data, (err, data) => {
                if (err)
                    reject(err);
                resolve(data);
            });
        }));
    }
    findOne(options) {
        return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
            const db = yield this.connect();
            db.findOne(options, (err, data) => {
                if (err)
                    reject(err);
                resolve(data);
            });
        }));
    }
    find(options) {
        return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
            const db = yield this.connect();
            db.find(options, (err, data) => {
                if (err)
                    reject(err);
                resolve(data);
            });
        }));
    }
}
//# sourceMappingURL=Collection.js.map