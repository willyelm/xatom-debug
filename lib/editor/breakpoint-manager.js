'use babel';
export class BreakpointManager {
    constructor() {
        this.breakpoints = [];
    }
    getBreakpoints() {
        return this.breakpoints;
    }
    getBreakpoint(filePath, lineNumber) {
        let index = this.breakpoints.findIndex((item) => {
            return (item.filePath === filePath && item.lineNumber === lineNumber);
        });
        return this.breakpoints[index];
    }
    getBreakpointsFromFile(filePath) {
        return this.breakpoints.filter((item) => {
            return (item.filePath === filePath);
        });
    }
    removeBreakpoint(breakpoint) {
        return new Promise((resolve, reject) => {
            let index = this.breakpoints.indexOf(breakpoint);
            if (index != -1) {
                if (breakpoint.marker)
                    breakpoint.marker.destroy();
                this.breakpoints.splice(index, 1);
                return resolve(true);
            }
            return reject('breakpoint does not exists');
        });
    }
    addBreakpoint(marker, lineNumber, filePath) {
        return new Promise((resolve, reject) => {
            let breakpoint = {
                lineNumber,
                filePath,
                marker
            };
            let index = this.breakpoints.push(breakpoint);
            if (index > -1) {
                resolve(breakpoint);
            }
            else {
                reject('unable to add breakpoint');
            }
        });
    }
    getPlainBreakpoints() {
        return this.breakpoints.map((b) => {
            return {
                filePath: b.filePath,
                lineNumber: b.lineNumber
            };
        });
    }
}
//# sourceMappingURL=breakpoint-manager.js.map