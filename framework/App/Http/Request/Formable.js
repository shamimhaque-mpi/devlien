import url from 'url';
import file from './File.js';
import Validator from "../Validator.js";

export default class Formable extends Validator {
    /*
    * ========================
    * VALIDATE AND STORE
    * CHUNK AND
    * ======================= */
    form() {

        let isJsonResonse = this.node.headers['content-type']=='application/json';
        let isURLencodedResonse = this.node.headers['content-type']=='application/x-www-form-urlencoded';

        return new Promise((resolve, reject) => {

            try{
                const parsedUrl = url.parse(this.node.url, true);
                const fields    = Object.assign({}, parsedUrl.query);
                const files     = [];
                
                if (['POST', 'PUT'].includes(this.node.method)) {

                    let body = '';
                    if(isJsonResonse || isURLencodedResonse){
                        this.node.on('data', (chunk) => {
                            body += chunk.toString();
                        });
                    }
                    else {
                        this.node.setEncoding('binary');
                        this.node.on('data', (chunk) => {
                            body += chunk;
                        });
                    }


                    this.node.on('end', () => {

                        try{
                            if(isJsonResonse) return resolve({ fields:Object.assign(fields, JSON.parse(body)), files });
                            if(isURLencodedResonse) return resolve({ fields:Object.assign(fields, this.parseUrlEncoded(body)), files });
                        }
                        catch(err){
                            reject({
                                status:'400',
                                message:'Bad Request',
                                error:err
                            });
                        }
                        
                        const boundary = this.node.headers['content-type']?.split('boundary=')[1];
                        const parts = body.split(`--${boundary}`);

                        for (const part of parts) 
                        {
                            if (part.includes('filename="')) {
                                const _file = this.#makefile(part);
                                if (_file) files.push(new file(_file));
                            }
                            //
                            else if (part.includes('name="')) {
                                const match = part.match(/name="(.+?)"/);
                                const value = part.split('\r\n\r\n')[1];
                                if (match && value) {
                                    fields[match[1]] = value.trim();
                                }
                            }
                        }

                        resolve({ fields, files });
                    });
                } 
                else {
                    resolve({ fields, files });
                }
            }
            catch(e){reject(e)}
        });
    }


    parseUrlEncoded(body) {
        const result = {};
        body.split('&').forEach(pair => {
            const [key, value] = pair.split('=');
            result[decodeURIComponent(key)] = decodeURIComponent(value || '');
        });
        return result;
    }


    /*
    * ==========================
    * MAKING FROMABLE DATA SET
    * ========================= */
    #makefile(part) {
        
        const header = part.split('\r\n\r\n')[0];
        const content = part.split('\r\n\r\n')[1];

        const matchName = header.match(/name="(.+?)"/);
        const matchFile = header.match(/filename="(.+?)"/);

        if (matchName && matchFile) {

            const filename = matchFile[1];
            const fileData = content.slice(0, content.length - 2);

            return {
                name: filename,
                header: header,
                content: fileData,
                type: 'binary',
            };
        }
        return false;
    }
}
