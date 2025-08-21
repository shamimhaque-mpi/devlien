export default class Facade 
{
    #attributes = {};
    #hidden_attributes = {};


    toFormat(records, _this=null, wrapper=null, hiddens=false) {
        const data = records.map((record) => {
            this.#attributes = record;
            return this.getValidAttributes(_this, hiddens);
        });

        if(wrapper) return Object.assign(wrapper, data);
        else return data;

    }

    getValidAttributes(model=null, _hiddens=null) {

        let formatted_data = {};
        let hidden_attributes = {};

        let hidden = _hiddens ? _hiddens : this.constructor.hidden;

        if(hidden)
            for (const key in this.#attributes) {
                if (hidden.indexOf(key) < 0) {
                    formatted_data[key] = this.#attributes[key];
                }
                else hidden_attributes[key] = this.#attributes[key];
            }
        else
            formatted_data = this.#attributes;


        let _this;
        if(!model)
            _this = new this.constructor();
        else
            _this = new model;
            _this.#attributes = formatted_data;
            _this.#hidden_attributes = hidden_attributes;

        return Object.assign(_this, formatted_data);
    }


    getAttributes() {
        return this.#attributes;
    }


    getHiddenAttributes() {
        return this.#hidden_attributes;
    }


    pluralize(word) {
        if (word.endsWith('y') && !/[aeiou]y$/.test(word)) {
            return word.slice(0, -1) + 'ies';
        }
        if (word.endsWith('s') || word.endsWith('x') || word.endsWith('z') || word.endsWith('ch') || word.endsWith('sh')) {
            return word + 'es';
        }
        return word + 's';
    }




    toSnakeCase(str) {
        return str
          .replace(/([a-z0-9])([A-Z])/g, '$1_$2')
          .replace(/[\s-]+/g, "_") 
          .toLowerCase()
    }



    
    toSingularize(word) {
        return word
            .split('_')
            .map(part => {
                if (part.endsWith('ies')) {
                    return part.slice(0, -3) + 'y';
                } else if (part.endsWith('es') && !/(ses|xes|zes|ches|shes)$/.test(part)) {
                    return part.slice(0, -1); 
                } else if (part.endsWith('s')) {
                    return part.slice(0, -1);
                }
                return part;
            })
            .join('_');
    }



    makeMorphFields(name) {
        const snake = this.toSnakeCase(name);
        return {
            type: snake + "able_type",
            id: snake + "able_id"
        };
    }
}