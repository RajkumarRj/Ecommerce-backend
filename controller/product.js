const productModel = require("../model/product");
const jswt = require("jsonwebtoken");


const  createProduct = async (req,res)=>{
        const product = await  productModel.create(req.body);
        res.json({
            success:true,
            message:"create api is working"
        })
}

const getProduct = async (req, res)=>{
    res.json({
        success:true,
        message:"get product api is working"
    })
}


const likeDislikeController = async  (req,res)=>{

    // console.log("asfjlkafas",req.user)

    let updateObject={
        $push :{ likes : req.user._id }, 
        $pull :{ dislikes :req.user._id },
        $inc :{likecount :1}
    };

    if(req.params.action === "dislike"){
        updateObject={
            $push :{ dislikes: req.user._id },
            $pull : {likes: req.user._id}
        }
    }

    const updatedProduct = await  productModel.findByIdAndUpdate(
        req.body.productId , 
        updateObject 
    ); 


    
    res.json({
        success:true,
        message:"product like and dislike"
    })
}


const productDetailsController = async (req,res)=>{

    const productDetails = await productModel.findById(req.query.productId).populate("likes" , "firstname").populate("dislikes");
    res.json({
        success:true,
        message:"product by id",
        result:productDetails
    })
}

const reviewProductController =async (req, res)=>{
    const product = await productModel.findById(req.params.productId);
    const review = product.reviews.find((review)=> review.userId.toString()=== req.user._id.toString());

    if(review){
        console.log("review exist");

         const findObject = {
            reviews:{
                $elemMatch:{
                    userId:req.user._id,
                    rating: review.rating,
                },
            },
         };

        const updateObject ={
                $set:{
                    "reviews.$.rating":req.body.rating,
                    "reviews.$.comment":req.body.comment,
                },

            };
        
        const updateResult = await productModel.updateOne(findObject , updateObject); 
        console.log(updateResult);

    }else{
        const updateObject={
            $push:{  
                reviews:{
                    rating:req.body.rating,
                    comment:req.body.comment,
                    userId:req.user._id,
                }
            }
        }
    
        const updatedRecord =await  productModel.findByIdAndUpdate(req.params.productId,updateObject,{new:true});

    }
   

    
    res.json({
        success:true,
        message:"Product review"
    })
}

module.exports ={
    createProduct,
    getProduct,
    likeDislikeController,
    productDetailsController,
    reviewProductController,
}