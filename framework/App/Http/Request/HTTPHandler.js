import Formable from './Formable.js';


export default class HTTPHandler extends Formable {
	//
	node;
	#fields;
	#files;

	constructor(request) {
		super();
		this.node = request;
		this.#init();
	}

	
	/*
	* =====================
	* GET ALL INPUT DATA
	* WITHOUT FILES
	* ================= */
	async all() {
		if(this.#fields) return this.#fields;
		else {
			const { fields } = await this.form();
			this.#fields = fields;
			return this.#fields;
		}
	}

	/*
	* =====================
	* GET ALL INPUT FILES
	* WITHOUT FORM DATA
	* ================= */
	async files() {
		if(this.#files) return this.#files;
		else {
			const { files } = await this.form();
			this.#files = files;
			return this.#files;
		}
	}


	async except(keys = []) {
		const filtered = {};
		let body = await this.all();
		for (const key in body) {
			if (!keys.includes(key)) {
				filtered[key] = body[key];
			}
		}
		return filtered;
	}

	async #init(){
		let data = await this.all();
		for(const key in data){
			this[key] = data[key];
		}
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
