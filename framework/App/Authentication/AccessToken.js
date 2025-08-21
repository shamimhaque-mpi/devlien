import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import DateTime from "../../../utilities/helpers/DateTime.js";
import config from 'devlien/config';
import PersonalAccessToken from "../../../utilities/models/PersonalAccesstoken.js";

export default class AccessToken {

    secretKey = 'rof-34';

    constructor (token=null){
        this.token = token;
    }

    static token(token=null){
        return new AccessToken(token);
    }

    async verify(){
        if(this.token){
            try {
                jwt.verify(this.token, this.secretKey);
                const tokenSet = await PersonalAccessToken.where({token:this.token}).first();
                const tokenTimestamp = DateTime.parse(tokenSet.expired_at).timestamp();
                const currentTimestamp = DateTime.current().timestamp();

                if(tokenSet && (tokenTimestamp > currentTimestamp)){
                    return await tokenSet.model()
                }
                else return false;
            }
            catch(e){
                return false;
            }
        }
        else return false;
    }

    static encrypt(payload) 
    {
        const secretKey = crypto.randomBytes(32); // 256-bit key
        const iv = crypto.randomBytes(16); // 128-bit IV

        const cipher = crypto.createCipheriv('aes-256-cbc', secretKey, iv);
        let encrypted = cipher.update(JSON.stringify(payload), 'utf8', 'hex');
        encrypted += cipher.final('hex');

        return {
            token: jwt.sign({ id: encrypted }, new this().secretKey, { expiresIn: config('auth.guards.api.expire', '1day') }),
            hex: encrypted,
            key: Buffer.from(secretKey).toString('hex'),
            iv: Buffer.from(iv).toString('hex'),
        };
    }


    static decrypt({ token, iv, key, hex }) {
        const decipher = crypto.createDecipheriv(
            'aes-256-cbc',
            Buffer.from(key, 'hex'),
            Buffer.from(iv, 'hex')
        );

        let decrypted = decipher.update(hex, 'hex', 'utf8');
        decrypted += decipher.final('utf8');

        return JSON.parse(decrypted);
    }
}