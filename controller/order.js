const orderModel = require("../model/order");
const cartModel = require("../model/cart");
const couponModel = require("../model/coupon");
const dayjs = require("dayjs");
const razorpay = require("razorpay");


//initialize payment gateway
const Razorpay = new razorpay({
    key_id:"rzp_test_XYGh7eEb6MhWXi",
    key_secret:"FfiGPgSxKv8G2W3d7A6s1n9Y"
});

const createOrder = async (req,res)=>{

    const usercart = await cartModel.findOne({userId:req.user._id});

    if(!usercart){
        return res.status(400).json({
            success:false,
            message:"Empty cart,please add items to cart"
        })
    }

    const couponCode = req.body.coupon;
    const coupon = await couponModel.findOne({couponCode ,  isActive:true});

    if(!coupon){
        return res.json({
            success:false,
            message:"No coupon available"
        })
    }
    const couponStart = dayjs(coupon.startDate);

    const couponEnd = dayjs(coupon.endDate);

    const currentDateTime = dayjs();

    if(currentDateTime.isBefore(couponStart)|| currentDateTime.isAfter(couponEnd) ){

        return res.json({
            success:false,
            message:"Coupon expired"
        })

    }

    let couponDiscount = ((usercart.cartTotal /100) * coupon.discountPercentage).toFixed(2);

    if(couponDiscount > coupon.maxDiscountInRs){
        couponDiscount = coupon.maxDiscountInRs;
    }

    const amount = (usercart.cartTotal - couponDiscount).toFixed(2);

    
    let deliveryAddress = req.body.deliveryAddress;
    if(!deliveryAddress){
        deliveryAddress = req.user.address;
    }
    
    const deliveryDate = dayjs().add(7,"day");
    const ordercreation ={
        cart:usercart,
        userId :req.user._id,
        amount,
        coupon:coupon._id,
        deliveryAddress,
        orderPlacedAt: currentDateTime,
        deliveryDate,
        orderStatus:"PLACED",
        modeOfPayment:req.body.modeOfPayment,
    }
   const newOrder = await orderModel.create(ordercreation);
   let pgResponse;


   if(req.body.modeOfPayment === "COD"){

   }
   else{

       const options={
           amount:amount*100,
           currency:"INR",
           receipt:newOrder._id,
        //    payment_cature:1
       };

       try{
            pgResponse = await Razorpay.orders.create(options);
           console.log(pgResponse);

       }catch(err){
        console.log(err);

       }



   }

   res.json({
    success: true,
    message: "Order placed successfully",
    orderId: newOrder._id,
    paymentInformation: {
      amount: pgResponse.amount_due,
      orderId: pgResponse.id,
      currency: pgResponse.currency,
    },
  });

}

const getOrder = async (req,res)=>{

    res.json({
        success:true,
        message:"get order"
    })
}

const orderController = {
    createOrder,
    getOrder
}


module.exports = orderController;