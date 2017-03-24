'use babel';
/*!
 * Atom Bugs
 * Copyright(c) 2017 Williams Medina <williams.medinaa@gmail.com>
 * MIT Licensed
 */

import { mkdir, stat, writeFile, readFile } from 'fs';
import { join } from 'path';

export class Storage {

  storagePath: string = join(atom['configDirPath'], 'storage', 'atom-bugs')
  filePath: string;

  constructor (public configFile: string) {
    this.filePath = join(this.storagePath, this.configFile);
  }

  isPathPresent () {
    return new Promise((resolve, reject) => {
      stat(this.storagePath, (err, stats) => {
        if (err) {
          resolve(false);
        } else {
          resolve(stats);
        }
      })
    })
  }

  createPath () {
    return new Promise((resolve, reject) => {
      mkdir(this.storagePath, (err) => {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      })
    })
  }

  save (content: string) {
    return new Promise((resolve, reject) => {
      writeFile(this.filePath, content, (err) => {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      });
    })
  }

  read () {
    return new Promise ((resolve, reject) => {
      readFile(this.filePath, (err, data) => {
        if (err) {
          reject(err);
        }
        try {
          resolve(JSON.parse(String(data)))
        } catch (e) {
          reject(e)
        }
      })
    })
  }

  async saveFromObject (content: any) {
    let exists = await this.isPathPresent();
    if (exists === false) {
      await this.createPath();
    }
    let string = JSON.stringify(content);
    return await this.save(string);
  }
}
