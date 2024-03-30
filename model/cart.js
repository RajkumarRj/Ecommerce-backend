const { default: mongoose } = require("mongoose");
const mangoose = require("mongoose");

const cartProduct = new mangoose.Schema({
    productId:{
        type:mongoose.Schema.Types.ObjectId,
        required:true,
    },
    quantity:{
        type:Number,
    },
    color:{
        type:String,
    },
    price:{
        type:Number,
    }
})

const cartSchema = new mongoose.Schema({
    products:{
        type:[cartProduct],
    },
    cartTotal:{
        type:Number,
        required:false,
        default:0,
    },
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        required:true,
    },

});

const cartModel = mongoose.model("cart", cartSchema);
module.exports = cartModel;