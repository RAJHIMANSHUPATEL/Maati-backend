const { default: mongoose } = require("mongoose");
const Product = require("../../models/product.model");
const Category = require("../../models/category.model");

/**
 * Controller to get products by subcategory for retail.
 * @param {object} req - The Express request object.
 * @param {object} res - The Express response object.
 */
// const getProductsBysubCategory = async (req, res) => {
//     try {
//         const { store,sub_category } = req.body;

//         const products = await Product.find({ store: store ,sub_category:sub_category});

//         res.status(200).json({success: true,products:products,message:"Successfully fetched product by subcategory and store"});
//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ message: "Server error", error });
//     }
// };

/**
 * Controller to get products by store ID for retail.
 * @param {object} req - The Express request object.
 * @param {object} res - The Express response object.
 */
// const productByStoreId = async (req, res) => {
//     try {
//         const { store } = req.body;

//         const getbyid = await Product.find({ store: store,status:"active" });

//         res.status(200).json({success: true, data:getbyid, message:"Successfully fetched product by storeId"});
//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ message: "Server error", error });
//     }

// };

/**
 * Controller to get products by category ID for retail.
 * @param {object} req - The Express request object.
 * @param {object} res - The Express response object.
 */
const productByCategoryId = async (req, res) => {
  try {
    const { category } = req.query;

    const products = await Product.find({ category });

    res.status(200).json({
      success: true,
      data: products,
      message: "Successfully fetched product by categoryId",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server error", error });
  }
};

/**
 * Controller to get products by product ID for retail.
 * @param {object} req - The Express request object.
 * @param {object} res - The Express response object.
 */
const getProductById = async (req, res) => {
  try {
    const { _id } = req.query;

    const product = await Product.findOne({ _id }).select(
      "-createdAt -updatedAt -__v -posPrice"
    );

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "No product found.",
      });
    }

    res.status(200).json({
      success: true,
      data: product,
      message: "product fetched Successfully.",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server error", error });
  }
};

/**
 * Controller to get products by category for retail.
 * @param {object} req - The Express request object.
 * @param {object} res - The Express response object.
 */
const getProductsByCategory = async (req, res) => {
  try {
    const { store } = req.body;

    const categories = await Category.find({ store, isEcommerce: true }).select(
      "name"
    );

    const filteredProducts = await Promise.all(
      categories.map(async (category) => {
        const products = await Product.find({ store, category: category._id });
        return {
          category: category.name,
          products,
        };
      })
    );

    res.status(200).json({
      success: true,
      data: filteredProducts,
      message: "Successfully fetched products",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", error });
  }
};

const getHomepageProducts = async (req, res) => {
  const { store } = req.body;

  if (!store || !mongoose.Types.ObjectId.isValid(store)) {
    return res.status(400).json({
      success: false,
      message: "Invalid store ID",
    });
  }
  try {
    const products = await Product.find({ store: store, status: "active" })
      .sort({ updatedAt: -1 })
      .limit(15)
      .select("-__v -updatedAt -createdAt -variations -posPrice");

    res.status(200).json({
      success: true,
      data: products,
      message: "products fetched Successfully",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", error });
  }
};

/**
 * Controller to filter and fetch products based on given criteria.
 * Supports discount filter, category, subcategory, pagination, and sorting.
 *
 * @param {object} req - Express request object.
 * @param {object} req.body.discount - Boolean flag to filter discounted products.
 * @param {object} req.body.category - Category ID to filter products.
 * @param {object} req.body.subCategory - SubCategory ID to filter products.
 * @param {number} [req.body.page=1] - Current page number for pagination.
 * @param {number} [req.body.limit=10] - Number of products per page.
 * @param {string} [req.body.sortBy] - Sorting option (price_low_high, price_high_low, discount, a_to_z, z_to_a).
 * @param {object} res - Express response object.
 * @returns {Promise<void>} - JSON response with filtered products, total count, current page, and total pages.
 */
const getFilteredProduct = async (req, res) => {
  try {
    const {
      discount, // boolean
      category, // categoryId
      subCategory, // subCategoryId
      page = 1,
      limit = 10,
      sortBy, // price_low_high, price_high_low, discount, a_to_z, z_to_a
      search,
      store,
    } = req.body;

    const filter = { status: "active" }; // default filter
    const andParts = [];

    if (store) {
      filter.store = store;
    }

    // Discount filter
    if (discount === true) {
      andParts.push({
        $or: [{ discount: { $gt: 0 } }, { discountGiven: { $gt: 0 } }],
      });
    }

    if (search && String(search).trim()) {
      const escaped = String(search)
        .trim()
        .replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      andParts.push({
        $or: [
          { name: { $regex: escaped, $options: "i" } },
          { description: { $regex: escaped, $options: "i" } },
        ],
      });
    }

    if (andParts.length) {
      filter.$and = andParts;
    }

    // Category filter
    if (category) {
      filter.category = category;
    }
    // SubCategory filter
    if (subCategory) {
      filter.subCategory = subCategory;
    }

    // Sorting
    let sort = { createdAt: -1 };
    if (sortBy) {
      switch (sortBy) {
        case "price_low_high":
          sort = { sellingPrice: 1 };
          break;
        case "price_high_low":
          sort = { sellingPrice: -1 };
          break;
        case "discount":
          sort = { discount: -1 };
          break;
        case "a_to_z":
          sort = { name: 1 };
          break;
        case "z_to_a":
          sort = { name: -1 };
          break;
      }
    }

    const skip = (page - 1) * limit;

    // Query products
    const [products, totalCount, categories, subCategories] = await Promise.all(
      [
        Product.find(filter)
          .populate("category", "name")
          .populate("subCategory", "name")
          .sort(sort)
          .skip(skip)
          .limit(limit),
        Product.countDocuments(filter),
        Category.find({ isEcommerce: true, status: "active" }),
      ]
    );

    return res.json({
      success: true,
      totalCount,
      currentPage: Number(page),
      totalPages: Math.ceil(totalCount / limit),
      products,
      categories,
      subCategories,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Something went wrong" });
  }
};

module.exports = {
  getHomepageProducts,
  getProductsByCategory,
  getFilteredProduct,
  getProductById,
  productByCategoryId,
};
