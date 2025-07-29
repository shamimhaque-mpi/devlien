import Formable from './Formable.js';


export default class HTTPHandler extends Formable {
	//
	node;

	constructor(request) {
		super();
		this.node = request;
	}
	
	/*
	* =====================
	* GET ALL INPUT DATA
	* WITHOUT FILES
	* ================= */
	async all() {
		const { fields } = await this.form();
		return fields;
	}

	/*
	* =====================
	* GET ALL INPUT FILES
	* WITHOUT FORM DATA
	* ================= */
	async files() {
		const { files } = await this.form();
		return files;
	}

	ip(){
		return this.node.socket.remoteAddress;
	}

	headers(){
		return this.node.headers;
	}

	url(){
		return this.node.url;
	}
}
