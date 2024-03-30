const cartModel = require("../model/cart");
const productModel = require("../model/product")

const createCart = async (req,res)=>{
    console.log(req.body.products)

    const userCart = await cartModel.findOne({userId:req.user._id});
    console.log(userCart)

    if(userCart){


    }else{
        let cartTotal = 0;
        const productsToAdd = [];
        
        for(let i=0; i<req.body.products.length ; i++){
            const currentProduct = req.body.products[i];

            const {price} = await productModel.findById(currentProduct.productId, {
                price:1,
                _id:0,
            });

            const product ={
                ...currentProduct,
                price,
            };

            productsToAdd.push(product);

            const priceForProduct = currentProduct.quantity * price;
            cartTotal += priceForProduct;

        }

        await cartModel.create({
            products:productsToAdd,
            cartTotal:cartTotal,
            userId:req.user._id,
        })
    }

    res.json({
        success:true,
        message:"cart created successfully"
    })
}

const getCart =  async (req,res)=>{
    res.json({
        success:true, 
        message:"get cart "
    })
}

const controllers ={
    createCart,
    getCart,
}

module.exports = controllers;