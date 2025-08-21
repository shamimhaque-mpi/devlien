import Mysql from "../Database/Mysql.js";

export default class Validator {

    constructor(request){

        if(this.rules)
        {
            const roles = this.rules();
            const data  = this.all();

            let errors = [];
            for(const key in roles){
                const role = roles[key].split('|');

                if(role.includes('required') && !data[key]){
                    errors.push(`The ${key} field is required`);
                }
            }

            if(errors.length) throw {
                message:'Some Fields Are Missing.',
                status:422, 
                data: errors
            };
        }
    }

    async validate(roles){
        return await this.checkValidation(roles);
    }


    async checkValidation(roles) 
    {
        const data = await this.all();
        let errors = {};

        for(const key in roles)
        {
            const role = roles[key].split('|');

            if(role.includes('required') && !data[key]){
                errors[key] = `The ${key} field is required`;
            }


            if(role.includes('email') && data[key]){
                const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if(!regex.test(data[key])) errors[key] = `The email is not valid`;
            }



            const signedRoles = role.filter(x=>x.indexOf(':')>-1);
            for(const rule of signedRoles)
            {
                const segments = rule.split(':');
                
                if(segments.includes('min') && !(segments[1] <= data[key])) 
                    errors[key] = `The ${key} must be at least ${segments[1]}`;
                
                if(segments.includes('len') && !(segments[1] <= data[key].length)) 
                    errors[key] = `The ${key} must be at least length ${segments[1]}`;

                if(segments.includes('in')){
                    let [status] = role.filter((field)=>(field.indexOf('in')>-1)).map((role)=>role.split(':').join(',').split(','));
                    if(status && status.includes('in') && data[key]){
                        delete status[0]
                        
                        if(!status.includes(data[key])) 
                            errors[key] = `The ${key} is invalid`;
                    }
                }

                if(segments.includes('same')){
                    // CONVERT 
                    let [same_ck_params] = role.filter((field)=>(field.indexOf('same')>-1)).map((role)=>role.split(':'));
                    if(same_ck_params && (data[same_ck_params[1]]!=data[key])) {
                        errors[key] = `The ${key} must be the same as the ${same_ck_params[1]}`;
                    }
                }
                

                if(segments.includes('unique')){
                    // CONVERT ['unique:table,entity,id,3'] TO ['unique', 'table', 'entity'] 
                    let [uqu_params] = role.filter((field)=>(field.indexOf('unique')>-1)).map((role)=>role.split(':').join(',').split(','));
                    if(data[key] && uqu_params && !(await this.uniqueCheck(uqu_params, data[key]))){
                        errors[key] = `The ${key} must be unique`;
                    }
                }


                if(segments.includes('exists')){
                    // CONVERT ['exists:table,id,1'] TO ['exists', 'table', 'id', 1] 
                    let [exists_checkable] = role.filter((field)=>(field.indexOf('exists')>-1)).map((role)=>role.split(':').join(',').split(','));
                    if(data[key] && exists_checkable && !(await this.existsCheck(exists_checkable, data[key]))){
                        errors[key] = `The record does not exist`;
                    }
                }
            }

        }

        if(Object.values(errors).length) throw {
            message:'Validation fails',
            status:422, 
            data: errors
        };
        
        else return true;
    }





    async uniqueCheck(params, value){
        const query = `SELECT * FROM ${params[1]} WHERE \`${params[2]}\` = '${value}' ${params.length==5?`AND \`${params[3]}\` != '${params[4]}'`:''} limit 1`;
        const [data] = await Mysql.instance().query(query);
        //
        return data[0]?false:true;
    }


    /**
     * Checks if a given value is exists in a specific table column.
     *
     * @param {Array} params - An array containing:
     *   [0] - (Unused) Could be the rule name or placeholder.
     *   [1] - Table name to search in.
     *   [2] - Column name to check.
     *   [3] - Value to match against the column.
     * @param {*} value - (Unused here) The value being validated (can be used for future improvements).
     * @returns {boolean} - Returns `true` if the value does NOT exist (exists),
     *                               otherwise `false` if the value already exists.
     *
     * Example:
     *   await existsCheck(['exists', 'users', 'email', 'test@example.com'], null);
     *   // true if email is exists.
     */
    async existsCheck(params, value){
        const query = `SELECT * FROM ${params[1]} WHERE \`${params[2]}\` = '${params[3] ? params[3] : value}' limit 1`;
        const [data] = await Mysql.instance().query(query);
        return data[0]?true:false;
    }
}