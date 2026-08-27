const Product = require("../../models/product.model");

/**
 * Controller to get products by subcategory for retail.
 * @param {object} req - The Express request object.
 * @param {object} res - The Express response object.
 */
const getProductsBysubCategory = async (req, res) => {
    try {
        const { store,sub_category } = req.body;

        const products = await Product.find({ store: store ,sub_category:sub_category});
        
        res.status(200).json({success: true,products:products,message:"Successfully fetched product by subcategory and store"});
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error", error });
    }
};

/**
 * Controller to get products by store ID for retail.
 * @param {object} req - The Express request object.
 * @param {object} res - The Express response object.
 */
const productByStoreId = async (req, res) => {
    try {
        const { store } = req.body;
  
        const getbyid = await Product.find({ store: store,status:"active" });
  
        res.status(200).json({success: true, data:getbyid, message:"Successfully fetched product by storeId"});
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error", error });
    }

};

/**
 * Controller to get products by store ID and category ID for retail.
 * @param {object} req - The Express request object.
 * @param {object} res - The Express response object.
 */
const productByStoreIdandCategoryId = async (req, res) => {
    try {
        const { store,category } = req.body;
   
        const getbyid = await Product.find({ store: store,category:category});
        
        res.status(200).json({success: true, data:getbyid, message:"Successfully fetched product by storeId and categoryId"});
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error", error });
    }

};

/**
 * Controller to get products by store ID and product ID for retail.
 * @param {object} req - The Express request object.
 * @param {object} res - The Express response object.
 */
const productByStoreIdandId = async (req, res) => {
    try {
        const{_id} =req.query;
        const { store } = req.body;

        const getbyid = await Product.find({_id:_id, store: store});

        if (!getbyid || getbyid.length === 0) {
            return res.status(404).json({
                success: false,
                message: "No product found for the given store and id",
            });
        }
        
        res.status(200).json({success: true, data: getbyid, message:"Successfully fetched product by storeId and id"});
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error", error });
    }

};

/**
 * Controller to get products by category for retail.
 * @param {object} req - The Express request object.
 * @param {object} res - The Express response object.
 */
const getProductsByCategory = async (req, res) => {
    try {
        const { store, category } = req.body;

        const products = await Product.find({ store: store, category: category });

        res.status(200).json({ success: true, products: products, message: "Successfully fetched product by category and store" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error", error });
    }
};

module.exports = { productByStoreId,productByStoreIdandCategoryId,productByStoreIdandId,
    getProductsBysubCategory, getProductsByCategory,
 };