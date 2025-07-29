import fs from 'fs';
import path from 'path';

export default class File {
    #file;

    constructor(file) {
    	this.#file = file;
    }

    name() {
    	return this.#file.name;
    }

    extension() {
    	return path.extname(this.#file.name);
    }

    upload(location, name = null) {
		return new Promise((resolve, reject) => {
			const hasPathExtension = path.extname(location);
			const hasNameExtension = path.extname(name ? name : '');

			var filePath;
			if (hasPathExtension) 
				filePath = path.join(location, '');
			else if (name && hasNameExtension) 
				filePath = path.join(location, name);
			else if (name && !hasNameExtension) 
				filePath = path.join(location, name + this.extension());
			else
				filePath = path.join(location, this.name());



			fs.writeFile(filePath, Buffer.from(this.#file.content, 'binary'), (error) => {
				if (error) reject(error);
				else resolve(filePath);
			});
		});
    }
}
