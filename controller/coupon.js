const couponModel = require("../model/coupon");

const createCoupon = async(req, res)=>{
    console.log(req.body);
     
    await couponModel.create(req.body);
    res.json({
        success:true,
        message:"Created coupon successfully"
    })
}

const getCoupon = async(req, res)=>{

    const couponsList= await couponModel.find({isActive:true})
    res.json({
        success:true,
        message:"get coupon",
        result:couponsList
    })
    
}


const couponController ={
    createCoupon,
    getCoupon
};

module.exports = couponController;