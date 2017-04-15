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
 * Atom Bugs
 * Copyright(c) 2017 Williams Medina <williams.medinaa@gmail.com>
 * MIT Licensed
 */
import { mkdir, stat, writeFile, readFile } from 'fs';
import { join } from 'path';
export class Storage {
    constructor() {
        this.storagePath = join(atom['configDirPath'], 'storage', 'xatom-debug');
        // create path if does not exists
        this.isPathPresent().then((exists) => {
            if (exists === false) {
                this.createPath();
            }
        });
    }
    setPath(configFile) {
        let token = btoa(configFile);
        this.filePath = join(this.storagePath, `${token}.json`);
    }
    isPathPresent() {
        return new Promise((resolve, reject) => {
            stat(this.storagePath, (err, stats) => {
                if (err) {
                    resolve(false);
                }
                else {
                    resolve(stats);
                }
            });
        });
    }
    createPath() {
        return new Promise((resolve, reject) => {
            mkdir(this.storagePath, (err) => {
                if (err) {
                    reject(err);
                }
                else {
                    resolve();
                }
            });
        });
    }
    save(content) {
        return new Promise((resolve, reject) => {
            writeFile(this.filePath, content, (err) => {
                if (err) {
                    reject(err);
                }
                else {
                    resolve();
                }
            });
        });
    }
    read() {
        return new Promise((resolve, reject) => {
            readFile(this.filePath, (err, data) => {
                if (err) {
                    reject(err);
                }
                try {
                    resolve(JSON.parse(String(data)));
                }
                catch (e) {
                    reject(e);
                }
            });
        });
    }
    saveObjectFromKey(key, object) {
        return __awaiter(this, void 0, void 0, function* () {
            let content = yield this.read().catch(() => {
                // no contents
            });
            if (!content) {
                content = {};
            }
            content[key] = object;
            return yield this.save(JSON.stringify(content));
        });
    }
    saveFromObject(content) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.save(JSON.stringify(content));
        });
    }
}
//# sourceMappingURL=storage.js.map