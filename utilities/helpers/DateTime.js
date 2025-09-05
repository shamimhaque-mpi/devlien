export default class DateTime 
{
    constructor(date = null) {
        if(date)
            this.date = new Date(date);
        else
            this.date = new Date();
    }

    // static initializer
    static current() {
        return new DateTime(null);
    }

    static parse(date=null){
        return new DateTime(date);
    }

    timestamp(){
        return this.date.getTime();
    }

    static timestamp(){
        return (new this).date.getTime();
    }

    // add time (like "1h", "2day", "30m")
    add(str) {
        const parts = str.split('/');
        for (let part of parts) 
        {
            const match = part.match(/(\d+)([a-zA-Z]+)/);

            if (match) {

                const value = parseInt(match[1], 10);
                const unit = match[2].toLowerCase();

                switch (unit) {
                case 's':
                case 'sec':
                case 'second':
                case 'seconds':
                    this.date.setSeconds(this.date.getSeconds() + value);
                    break;

                case 'm':
                case 'min':
                case 'minute':
                case 'minutes':
                    this.date.setMinutes(this.date.getMinutes() + value);
                    break;

                case 'h':
                case 'hour':
                case 'hours':
                    this.date.setHours(this.date.getHours() + value);
                    break;

                case 'd':
                case 'day':
                case 'days':
                    this.date.setDate(this.date.getDate() + value);
                    break;

                case 'mon':
                case 'month':
                case 'months':
                    this.date.setMonth(this.date.getMonth() + value);
                    break;

                case 'y':
                case 'year':
                case 'years':
                    this.date.setFullYear(this.date.getFullYear() + value);
                    break;
                }
            }
        }
        return this; // chainable
    }

    // format the date
    format(pattern = 'yyyy-mm-dd h:m:s') {
        const yyyy = this.date.getFullYear();
        const mm = String(this.date.getMonth() + 1).padStart(2, '0');
        const dd = String(this.date.getDate()).padStart(2, '0');
        const h = String(this.date.getHours()).padStart(2, '0');
        const m = String(this.date.getMinutes()).padStart(2, '0');
        const s = String(this.date.getSeconds()).padStart(2, '0');

        return pattern
        .replace('yyyy', yyyy)
        .replace('mm', mm)
        .replace('dd', dd)
        .replace('h', h)
        .replace('m', m)
        .replace('s', s);
    }
}