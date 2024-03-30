const userModel = require("../model/user")
const bcrypt = require("bcrypt");

const jswt = require("jsonwebtoken");

const userRegistration = async ( req, res)=>{
     
    const newUser = new userModel({
        ...req.body,
    });

    await newUser.save();

    
    console.log(req.body);
    res.json({
        success:true,
        message:"Registered successfully",
        data:req.body
        
    })
}


const login = async ( req, res)=>{


    const user = await  userModel.findOne({email: req.body.email});

    if(!user){
        return res.json({
            success:true,
            message:"Email does not exist"
        })
    }

    const isPassValid = await  bcrypt.compareSync(req.body.password , user.password);
    console.log(isPassValid);

    if(isPassValid){

        const exptime = Math.floor(new Date().getTime() / 1000) +7200;
        console.log(exptime);


        const userpayload ={
            id:user._id,
            firstname:user.firstname,
            role:user.role,
            exp:exptime

        }
        console.log(user.role);

        const token =jswt.sign(userpayload , process.env.JWT_KEY);


        return res.json({
            success:true,
            message:"logged in successfully",
            token,
        })
    }

    res.json({
        success:false,
        message:"invalid username or password"
    })
}


const logout  = async ( req, res)=>{
    res.json({
        success:true,
        message:"logout successfully"
    })
}

const addWishList = async(req,res)=>{
    console.log(req.body);
    const updateObject ={
        $push:{
            wishlist:req.body.productId,
        }
    }

    await userModel.findByIdAndUpdate(req.user._id , updateObject);
    res.json({
        success:true,
        message:"wishlist added successfully"
    })
}

const getWishList = async (req, res)=>{

    const user = await userModel.findById(req.user._id, "wishlist").populate("wishlist","title price ");
    res.json({
        success:true,
        message:"get wishlist api",
        result:user,
    })
}

const saveAddress = async (req,res)=>{

    const address = req.body;
    const setObject ={};

    if(address.address){
        setObject["address.address"] = address.address;
    }

    if(address.city){
        setObject["address.city"] = address.city;
    }

    if(address.state){
        setObject["address.state"] = address.state;
    }

    if(address.pincode){
        setObject["address.pincode"] = address.pincode;
    }

    const updateObject={
        $set:setObject,
    };

   const updateResult = await userModel.findByIdAndUpdate(req.user._id , updateObject);

    res.json({
        success:true,
        message:"address api"
    })
}
module.exports ={
    userRegistration,
    login,
    logout,
    addWishList,
    getWishList,
    saveAddress,
}