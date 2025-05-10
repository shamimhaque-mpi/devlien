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

            if(errors.length) throw createError({
                message:'Some Fields Are Missing.',
                statusCode:422, 
                data: errors
            }, );
        }
    }

    async validate(fields){
        await this.checkValidation(fields);
    }


    async checkValidation(roles) 
    {
        const data  = this.all();

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


            // CONVERT 

            let [same_ck_params] = role.filter((field)=>(field.indexOf('same')>-1)).map((role)=>role.split(':'));
            if(same_ck_params && (data[same_ck_params[1]]!=data[key])) {
                errors[key] = `The ${key} must be the same as the ${same_ck_params[1]}`;
            }




            // CONVERT ['unique:table,entity,id,3'] TO ['unique', 'table', 'entity'] 
            let [uqu_params] = role.filter((field)=>(field.indexOf('unique')>-1)).map((role)=>role.split(':').join(',').split(','));
            if(data[key] && uqu_params && !(await this.uniqueCheck(uqu_params, data[key]))){
                errors[key] = `The ${key} must be unique`;
            }
        }

        if(Object.values(errors).length) throw new Error(JSON.stringify({
            message:'Validation fails',
            statusCode:422, 
            data: errors
        }));
    }





    async uniqueCheck(params, value){
        const query = `SELECT * FROM ${params[1]} WHERE \`${params[2]}\` = '${value}' ${params.length==5?`AND \`${params[3]}\` != '${params[4]}'`:''} limit 1`;
        const [data] = await Mysql.instance().query(query);
        //
        return data[0]?false:true;
    }
}