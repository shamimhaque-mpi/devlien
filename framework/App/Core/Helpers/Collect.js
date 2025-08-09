class collections {
	#records;
	constructor(records) {
		if(Array.isArray(records))
			this.#records = records;
		else 
			this.#records = Object.assign({}, records);
	}

	first() {
		return this.#records.length ? this.#records[0] : false;
	}

	last() {
		return this.#records.length
		? this.#records[this.#records.length - 1]
		: false;
	}


	only(...keys){
		return keys.reduce((acc, key) => {
			if (this.#records.hasOwnProperty(key)) {
				acc[key] = this.#records[key];
			}
			return acc;
		}, {});
	}

	
	toArray() {
		return Object.values(this.#records);
	}
}

export default function collect(records) {
  let _this = new collections(records);
  return Object.assign(_this, records);
}
