import Formable from './Formable.js';


export default class HTTPHandler extends Formable {
	//
	node;
	#fields = {};
	#files  = {};
	#isReady = false;
	#response

	constructor(request, response=null) {
		super();
		this.node = request;
		this.#response = response;
		this.#fields = {};
		this.#init();
	}

	
	/*
	* =====================
	* GET ALL INPUT DATA
	* WITHOUT FILES
	* ================= */
	async all() {
		if(this.#isReady) return this.#fields;
		else {
			try {
				const { fields, files } = await this.form();
				this.#fields = Object.assign(this.#fields, fields);
				this.#files = files;
				this.#isReady = true;
				return this.#fields;
			}
			catch(err){
				return this.#makeError(err);
			}
		}
	}

	/*
	* =====================
	* GET ALL INPUT FILES
	* WITHOUT FORM DATA
	* ================= */
	async files() {
		if(this.#isReady) return this.#files;
		else {
			try {
				const { files, fields } = await this.form();
				this.#fields = Object.assign(this.#fields, fields);
				this.#files = files;
				this.#isReady = true;
				return this.#files;
			}
			catch(err){
				return this.#makeError(err);
			}
		}
	}

	add(key={}){
		this.#fields = Object.assign(this.#fields, key);
	}


	async except(keys = []) {
		try {
			const filtered = {};
			let body = await this.all();
			for (const key in body) {
				if (!keys.includes(key)) {
					filtered[key] = body[key];
				}
			}
			return filtered;
		}
		catch(err){
			return this.#makeError(err);
		}
	}

	async only(...keys){
		try {
			let body = await this.all();
			return keys.reduce((acc, key) => {
				if (body.hasOwnProperty(key)) {
					acc[key] = body[key];
				}
				return acc;
			}, {});
		}
		catch(err){
			return this.#makeError(err);
		}
	}

	async #init(){
		try {
			let data = await this.all();
			for(const key in data){
				this[key] = data[key];
			}
		}
		catch(err){
			return this.#makeError(err);
		}
	}

	#makeError(error){
		console.log(error);
		if(this.#response){
			this.#response.statusCode = error.status||500;
			this.#response.setHeader('Content-Type', 'application/json');
			this.#response.end(JSON.stringify(error));
		}
		else return error;
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
