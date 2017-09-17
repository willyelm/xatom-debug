'use babel';
/*!
 * XAtom Debug
 * Copyright(c) 2017 Williams Medina <williams.medinaa@gmail.com>
 * MIT Licensed
 */

const path = require('path');
const Datastore = require('nedb');
const storagePath = path.resolve(atom['configDirPath'], 'storage', 'xatom');

export class Collection {
  private db;
  constructor (private filename: string) {
    this.db = new Datastore(path.join(storagePath), `${filename}.db`);
  }
  connect (): Promise<any> {
    return new Promise((resolve, reject) => {
      return this.db.loadDatabase((err) => {
        if (err) {
          reject();
        } else {
          resolve(this.db);
        }
      })
    });
  }
  insert (data: any) {
    return new Promise(async (resolve, reject) => {
      const db = await this.connect();
      db.insert(data, (err, data) => {
        if (err) reject(err);
        resolve(data);
      });
    });
  }
  remove (data: any) {
    return new Promise(async (resolve, reject) => {
      const db = await this.connect();
      db.remove(data, (err, data) => {
        if (err) reject(err);
        resolve(data);
      });
    });
  }
  findOne (options: any) {
    return new Promise(async (resolve, reject) => {
      const db = await this.connect();
      db.findOne(options, (err, data) => {
        if (err) reject(err);
        resolve(data);
      });
    });
  }
  find (options: any): Promise<any[]> {
    return new Promise(async (resolve, reject) => {
      const db = await this.connect();
      db.find(options, (err, data) => {
        if (err) reject(err);
        resolve(data);
      });
    });
  }
}
