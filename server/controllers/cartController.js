import Cart from "../models/Cart.js";
import Product from "../models/Product.js";
import User from "../models/User.js";

export const getCart = async (req, res) => {
  try {
    const cart = Cart.findOne({ user: req.user._id });

    if (!cart) {
      return res.json({
        cartItems: [],
        totalPrice: 0,
      });
    }

    res.json(cart);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const addToCart = async (req, res) => {
  try {
    const { productId, quantity } = req.body;

    // 1. Find product
    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    // 2. Find user's cart
    let cart = await Cart.findOne({ user: req.user._id });

    // 3. If cart does not exist, create it
    if (!cart) {
      cart = new Cart({
        user: req.user._id,
        cartItems: [],
        totalPrice: 0,
      });
    }

    // 4. Check if product already in cart
    const itemIndex = cart.cartItems.findIndex(
      (item) => item.product.toString() === productId
    );

    if (itemIndex > -1) {
      // Product exists → increase quantity
      cart.cartItems[itemIndex].quantity += quantity || 1;
    } else {
      // Product not in cart → add new item
      cart.cartItems.push({
        product: productId,
        quantity: quantity || 1,
        price: product.price,
      });
    }

    // 5. Recalculate total price
    cart.totalPrice = cart.cartItems.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    );

    // 6. Save cart
    await cart.save();

    res.status(201).json(cart);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


export const updateCartItem = async (req, res) => {
  try {
    const { quantity } = req.body;
    const { productId } = req.params;

    const cart = await Cart.findOne({ user: req.user._id });

    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    const item = cart.cartItems.find(
      (item) => item.product.toString() === productId
    );

    if (!item) {
      return res.status(404).json({ message: "Item not in cart" });
    }

    item.quantity = quantity;

    cart.totalPrice = cart.cartItems.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    );

    await cart.save();
    res.json(cart);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


export const removeFromCart = async (req, res) => {
  try {
    const { productId } = req.params;

    const cart = await Cart.findOne({ user: req.user._id });

    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    cart.cartItems = cart.cartItems.filter(
      (item) => item.product.toString() !== productId
    );

    cart.totalPrice = cart.cartItems.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    );

    await cart.save();
    res.json(cart);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

