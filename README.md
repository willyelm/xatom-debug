# XAtom Debug

[![gitter](https://img.shields.io/gitter/room/atom-bugs/xatom-debug.svg?style=flat-square)](https://gitter.im/willyelm/xatom-debug?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)
[![apm](https://img.shields.io/apm/v/xatom-debug.svg?style=flat-square)](https://atom.io/packages/xatom-debug)
[![apm](https://img.shields.io/apm/l/xatom-debug.svg?style=flat-square)](https://github.com/willyelm/atom-bug/blob/master/LICENSE.md)

A Simple Debugging tool for Atom. `xatom-debug` is a base debugger UI provider, you will need  additionally install a specific debugger for your language.

![preview](https://raw.githubusercontent.com/willyelm/xatom-debug/master/assets/preview.png)

### Installation

```
apm install atom-bugs
```

### Features

- `Toolbar`: Toolbar API allows to control the execution process, select and configure the selected plugin.

![feature](https://raw.githubusercontent.com/willyelm/xatom-debug/master/assets/toolbar-preview.png)

- `Breakpoints`: Add, remove breakpoints by clicking on the file line. breakpoints are accessible from the `Debug Area` as well.

![feature](https://raw.githubusercontent.com/willyelm/xatom-debug/master/assets/breakpoint-preview.png)

- `Debug Area`: Navigate the current scope status local and global variables, open the current call-stack functions and control the execution step.

![feature](https://raw.githubusercontent.com/willyelm/xatom-debug/master/assets/debug-area-preview.png)

- `Configuration`:

### API Documentation

on progress...

### Available Plugins

Below is the list of available plugins so far:

Package|Description
---|---
[NodeJS](https://atom.io/packages/xatom-debug-nodejs)|Run and debug javascript files using NodeJS 6.3+.
[Google Chrome](https://atom.io/packages/xatom-debug-chrome)|Connect the debugger to a server enabling debugging javascript files.

### Requirements
- atom 1.0.0+

### License

MIT
