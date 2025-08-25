class String {
    #records;
    constructor(records) {
        this.#records = records;
    }

    slug() {
        return this.#records
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-');
    }
    
}

export default function (records) {
    let _this = new String(records);
    return Object.assign(_this, records);
}
