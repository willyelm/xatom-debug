'use babel';
/*!
 * Atom Bugs
 * Copyright(c) 2017 Williams Medina <williams.medinaa@gmail.com>
 * MIT Licensed
 */

export function createIcon (name: string) {
  let icon = document.createElement('i');
  icon.className = `bugs-icon bugs-icon-${name}`;
  return icon;
}

export function createIconFromPath (path: string) {
  let icon = document.createElement('i');
  icon.className = `bugs-icon`;
  icon.style.backgroundImage = `url(${path})`
  return icon;
}
