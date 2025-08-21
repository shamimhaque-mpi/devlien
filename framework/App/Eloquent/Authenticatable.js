import Model from "devlien/model"
import DateTime from "devlien/dateTime"
import AccessToken from "devlien/accessToken";
import PersonalAccessToken from "../../../utilities/models/PersonalAccesstoken.js";
import config from "devlien/config";

export default class Authenticatable extends Model {

    async createToken(guard='api'){

        let data = this.getAttributes();
        let dataset = AccessToken.encrypt(data);
        
        await PersonalAccessToken.updateOrCreate(
        {
            tokenable_type:this.constructor.class(),
            tokenable_id:this.id
        },
        {
            tokenable_type:this.constructor.class(),
            tokenable_id:this.id,
            token:dataset.token,
            hex:dataset.hex,
            key:dataset.key,
            iv:dataset.iv,
            expired_at: DateTime.current().add(
                config(`auth.guards.${guard}.expire`, '1day')
            ).format('yyyy-mm-dd h:m:s'),
        });
        
        return dataset.token;
    }

    tokens(){
        return PersonalAccesstoken
            .where({tokenable_type:this.constructor.class()})
            .where({tokenable_id:this.id}).get();
    }
}