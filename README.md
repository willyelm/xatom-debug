# Atom Bugs package

A Simple Debugging tool for Atom. `atom-bugs` is a base debugger UI provider, you will need  additionally install a specific debugger for your language.

![preview](assets/preview.png)

### Installation

```
apm install atom-bugs
```

### Features

- `Toolbar`: Toolbar API allows to control the execution process, select and configure the selected plugin.

![feature](assets/toolbar-preview.png)

- `Breakpoints`: Add, remove breakpoints by clicking on the file line. breakpoints are accessible from the `Debug Area` as well.

![feature](assets/breakpoint-preview.png)

- `Debug Area`: Navigate the current scope status local and global variables, open the current call-stack functions and control the execution step.

![feature](assets/debug-area-preview.png)

- `Configuration`:

### API Documentation

on progress...

### Available Plugins

Below is the list of available plugins so far:

Package|Description
---|---
[NodeJS](https://atom.io/packages/atom-bugs-nodejs)|Run and debug javascript files using NodeJS 6.3+.

### Requirements
- atom 1.0.0+

### License

MIT
