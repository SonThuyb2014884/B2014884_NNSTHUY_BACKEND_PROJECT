const {ObjectId} = require("mongodb");

class AccountService {
    constructor(client) {
        this.Account = client.db().collection("users");
    }

    extractAccountData(payload) {
        const account = {
            name: payload.name,                  
            email: payload.email,
            password: payload.password,
            confirm: payload.confirm,
        };

        Object.keys(account).forEach(
            (key) => account[key] === undefined && delete account[key]
        );

        return account;
    }

    async create(payload) {
        const account = this.extractAccountData(payload);
        const result = await this.Account.findOneAndUpdate(
            account,
            { $set: account },
            { returnDocument: "after", upsert: true }
        );
        return result.value;
    }

    async findById(id){
        return await this.Account.findOne({
            _id: ObjectId.isValid(id) ? new ObjectId(id) : null,
        });
    }


    async findByEmail(email){ 
        return await this.Account.findOne({
            email: {$regex: new RegExp(email), $options: "i"},
        });
    }


    async find(filter){
        const cursor = await this.Account.find(filter);
        return await cursor.toArray();
    }
        
    async findByName(name){
        return await this.find({
            name: {$regex: new RegExp(name), $options: "i"},
        });
    }

   

}


module.exports = AccountService;