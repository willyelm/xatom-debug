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
import { filter, find } from 'lodash';
const path = require('path');
const levelup = require('levelup');
const sublevel = require('level-sublevel');
const cuid = require('cuid');
const dbPath = path.join(atom['configDirPath'], 'storage', 'xatom-debug');
const db = sublevel(levelup(dbPath, {
    valueEncoding: 'json'
}));
export class Collection {
    constructor(db) {
        this.db = db;
        //
    }
    put(value) {
        return new Promise((resolve, reject) => {
            const uid = cuid();
            this.db.put(uid, value, (err, data) => {
                if (err)
                    reject(err);
                resolve(this.get(uid));
            });
        });
    }
    find(data) {
        return this
            .getItems()
            .then((items) => {
            return filter(items, data);
        });
    }
    findOne(data) {
        return new Promise((resolve, reject) => {
            const stream = this.db.createReadStream();
            stream.on('data', (item) => {
                if (find([item.value], data)) {
                    resolve(this.get(item.key));
                    stream.destroy();
                }
            });
            stream.once('end', () => resolve(null));
        });
    }
    delete(data) {
        return this.findOne(data).then((item) => {
            return this.del(item.uid);
        });
    }
    get(uid) {
        return new Promise((resolve, reject) => {
            this.db.get(uid, (err, data) => {
                if (err)
                    reject(err);
                resolve(Object.assign(data, {
                    uid: uid
                }));
            });
        });
    }
    del(uid) {
        return new Promise((resolve, reject) => {
            this.db.del(uid, (err, data) => {
                if (err)
                    reject(err);
                resolve(uid);
            });
        });
    }
    getItems() {
        return new Promise((resolve, reject) => {
            const getters = [];
            this
                .db
                .createReadStream()
                .on('data', (item) => __awaiter(this, void 0, void 0, function* () {
                getters.push(this.get(item.key));
            }))
                .once('end', () => {
                Promise.all(getters).then((items) => {
                    resolve(items);
                });
            });
        });
    }
}
export class Project extends Collection {
    constructor() {
        super(...arguments);
        this.breakpoints = db.sublevel('breakpoints');
        this.expressions = db.sublevel('expressions');
    }
    get(uid) {
        return super
            .get(uid)
            .then((data) => {
            return Object.assign({}, data, {
                breakpoints: new Collection(this.breakpoints.sublevel(uid)),
                expressions: new Collection(this.expressions.sublevel(uid))
            });
        });
    }
}
export const Storage = new Project(db.sublevel('projects'));
//# sourceMappingURL=Storage.js.map