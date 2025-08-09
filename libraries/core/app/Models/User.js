import Model from "devlien/model"

export default class User extends Model {

    /**
    * The attributes that should be 
    * hidden for arrays and JSON output
    */
    static hidden = ['password'];
}