'use babel'
/*!
 * XAtom Debug
 * Copyright(c) 2017 Williams Medina <williams.medinaa@gmail.com>
 * MIT Licensed
 */

export function createIcon (name: string) {
  let icon = document.createElement('i');
  icon.className = `xatom-icon xatom-icon-${name}`;
  icon.innerHTML = '&nbsp;'
  return icon;
}

export function createIconFromPath (path: string) {
  let icon = document.createElement('i');
  icon.className = `xatom-icon`;
  icon.style.backgroundImage = `url(${path})`
  return icon;
}
