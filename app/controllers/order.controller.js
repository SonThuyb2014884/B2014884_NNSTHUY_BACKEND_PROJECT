const OrdersService = require('../services/orders.service');
const MongoDB = require('../utils/mongodb.util');
const ApiError = require('../api-error');

exports.create =  async (req, res, next) => {
    if(!req.body?.name) {
        return next(new ApiError(400, "Name can not be empty"));
    }

    try {
        const orderService = new OrdersService(MongoDB.client);
        const document = await orderService.create(req.body);
        return res.send(document);
    } catch (error) {
        return next(
            new ApiError(500, "An error occurred while creating the contact")
        );
    }
};

exports.findAll = async (req, res, next) => {
    let documents = [];
    
    try{
        const orderService = new OrdersService(MongoDB.client);
        const {name} = req.query;
        if(name){
            documents = await orderService.findByName(name);
        }else {
            documents = await orderService.find({});
        }
    }catch (error){
        return next(
            new ApiError(500, "An error occurred while retrieving contacts")
        );
    }
        return res.send(documents);
};




