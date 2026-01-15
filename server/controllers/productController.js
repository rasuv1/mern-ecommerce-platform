import Product from "../models/Product";

/**
 * 
 * @decs Add new Product (Admin) 
 * @routes POST /api/products
 * @access Private/Admin
 */
export const createProduct = async(req, res) => {
    const {
        name,
        description,
        price,
        category,
        unit,
        stock,
        image,
        expiryDate,
    } = req.body;

    //basic validation
    if( !name || !description || !price || !category || !unit || !stock || !image || !expiryDate){
        return res.status(400).json({
            message: "Required Fields missing"
        });
    }

    //create product
    const product = await createProduct.create({
        ...req.body,
        createdBy: req.user._id,
    });

};


/**
 * @desc Get all products
 * @route Get /api/products
 * @access Public
 */

export const getProducts = async (req, res) =>{
    try{
        const products = await Product.find().sort({createdAt: -1});
        res.status(200).json(product);
    }catch(error){
        res.status(500).json({
            message: "Failed to fetch product"
        });
    }
};

/**
 * @desc Get single product
 * @route Get /api/products/:id
 * @access Public
 */

export const getProductById = async (req,res) =>{
    try{
        const product = await Product.findById(req.params.id);
        if(!product){
            return res.status(404).json({
                message: "Product Not Found"
            });
        }

        res.status(200).json(product);
    }catch(error){
        res.status(500).json("Invalid product Id");
    }
};


export const updateProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    product.name = req.body.name || product.name;
    product.description = req.body.description || product.description;
    product.price = req.body.price || product.price;
    product.category = req.body.category || product.category;
    product.unit = req.body.unit || product.unit;
    product.stock = req.body.stock || product.stock;
    product.image = req.body.image || product.image;
    product.isAvailable =
      req.body.isAvailable !== undefined
        ? req.body.isAvailable
        : product.isAvailable;

    const updatedProduct = await product.save();
    res.json(updatedProduct);
  } catch (error) {
    res.status(400).json({ message: "Invalid product ID" });
  }
};

export const deleteProduct = async (req,res) =>{
    try{
        const product = await Product.findById(req.params.id);
        if(!product){
            return res.status(404).json({ message: "Product not found"});
        }

        await product.deleteOne();
        res.json({ message: "Product removed successfully"});
    }catch(error){
        res.status(400).json({ message: "Invalid product ID"});
    }
};
