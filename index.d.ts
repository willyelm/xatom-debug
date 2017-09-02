declare namespace AtomCore {
	interface IWorkspace {
		addHeaderPanel(options:IWorkspacePanelOptions):Panel;
  	getPaneItems(): any[];
		getCenter(): any;
  	toggle(uri:any): Q.Promise<View>;
  	hide(uri:any): Q.Promise<View>;
		observePanes(cb: Function);
		observePaneItems(cb: Function);
	}
	interface IProject {
		getDirectories(): string[];
		getPaths(): string[];
	}
}
