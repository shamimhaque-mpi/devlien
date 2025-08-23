import bcrypt from "bcrypt";

export default class Hash {

    static async make(password){
        const salt = await bcrypt.genSalt(10);
        return await bcrypt.hash(`${password}`, salt);
    }

    static async check(password, hashedPassword){
        console.log(password, hashedPassword);
        return await bcrypt.compare(`${password}`, hashedPassword);
    }
}