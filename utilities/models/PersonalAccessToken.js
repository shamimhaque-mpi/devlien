import model from "../../framework/App/Eloquent/Model.js";

export default class PersonalAccessToken extends model {

    static namespace = "node_modules/utilities/models";


    //
    model(){
        return this.morphTo('tokenable_type', 'tokenable_id');
    }
}