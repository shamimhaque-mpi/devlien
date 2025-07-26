class collections {
  #records;
  constructor(records) {
    this.#records = records;
  }

  first() {
    return this.#records.length ? this.#records[0] : false;
  }

  last() {
    return this.#records.length
      ? this.#records[this.#records.length - 1]
      : false;
  }

  toArray() {
    return Object.values(this.#records);
  }
}

export default function collect(records) {
  let _this = new collections(records);
  return Object.assign(_this, records);
}
