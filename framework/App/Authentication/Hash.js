import bcrypt from "bcrypt";

export default class Hash {

    static async make(){
        const salt = await bcrypt.genSalt(10);
        return await bcrypt.hash(password, salt);
    }

    static async check(password, hashedPassword){
        return await bcrypt.compare(password, hashedPassword);
    }
}