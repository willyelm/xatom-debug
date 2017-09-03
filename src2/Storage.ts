'use babel';
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
  constructor (protected db) {
    //
  }
  put (value: any): Promise<any> {
    return new Promise((resolve, reject) => {
      const uid = cuid();
      this.db.put(uid, value, (err, data) => {
        if (err) reject(err);
        resolve(this.get(uid));
      });
    })
  }
  find (data: any): Promise<any> {
    return this
      .getItems()
      .then((items) => {
        return filter(items, data);
      });
  }
  findOne (data): Promise<any> {
    return new Promise((resolve, reject) => {
      const stream = this.db.createReadStream();
      stream.on('data', (item) => {
        if(find([item.value], data)) {
          resolve(this.get(item.key));
          stream.destroy();
        }
      });
      stream.once('end', () => resolve(null));
    });
  }
  delete (data): Promise<any> {
    return this.findOne(data).then((item) => {
      return this.del(item.uid);
    })
  }
  get (uid: string): Promise<any> {
    return new Promise((resolve, reject) => {
      this.db.get(uid, (err, data) => {
        if (err) reject(err);
        resolve(Object.assign(data, {
          uid: uid
        }));
      });
    });
  }
  del (uid: string): Promise<any> {
    return new Promise((resolve, reject) => {
      this.db.del(uid, (err, data) => {
        if (err) reject(err);
        resolve(uid);
      });
    });
  }
  getItems (): Promise<any[]> {
    return new Promise((resolve, reject) => {
      const getters = [];
      this
        .db
        .createReadStream()
        .on('data', async (item) => {
          getters.push(this.get(item.key));
        })
        .once('end', () => {
          Promise.all(getters).then((items) => {
            resolve(items);
          });
        });
    });
  }
}

export class Project extends Collection {
  private breakpoints = db.sublevel('breakpoints');
  private expressions = db.sublevel('expressions');
  get (uid: string): Promise<any> {
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
