export default class ResouceCollection {

    constructor($model){
        return this.getRecords($model);
    }


    async getRecords($model){
        let records = [];
        for(const key in $model){
            let data = await this.toJson($model[key]);
            records.push(data);
        }
        return records;
    }
}