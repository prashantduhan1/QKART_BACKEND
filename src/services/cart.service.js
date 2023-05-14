const httpStatus = require("http-status");
const { Cart, Product, User } = require("../models");
const ApiError = require("../utils/ApiError");
const config = require("../config/config");
const { http } = require("winston");

// TODO: CRIO_TASK_MODULE_CART - Implement the Cart service methods

/**
 * Fetches cart for a user
 * - Fetch user's cart from Mongo
 * - If cart doesn't exist, throw ApiError
 * --- status code  - 404 NOT FOUND
 * --- message - "User does not have a cart"
 *
 * @param {User} user
 * @returns {Promise<Cart>}
 * @throws {ApiError}
 */
const getCartByUser = async (user) => {
  const cart = await Cart.findOne({ email: user.email });
  if (cart) {
    return cart;
  } else if (!cart) {
    throw new ApiError(httpStatus.NOT_FOUND, "User does not have a cart");
  }
};

/**
 * Adds a new product to cart
 * - Get user's cart object using "Cart" model's findOne() method
 * --- If it doesn't exist, create one
 * --- If cart creation fails, throw ApiError with "500 Internal Server Error" status code
 *
 * - If product to add already in user's cart, throw ApiError with
 * --- status code  - 400 BAD REQUEST
 * --- message - "Product already in cart. Use the cart sidebar to update or remove product from cart"
 *
 * - If product to add not in "products" collection in MongoDB, throw ApiError with
 * --- status code  - 400 BAD REQUEST
 * --- message - "Product doesn't exist in database"
 *
 * - Otherwise, add product to user's cart
 *
 *
 *
 * @param {User} user
 * @param {string} productId
 * @param {number} quantity
 * @returns {Promise<Cart>}
 * @throws {ApiError}
 */
const addProductToCart = async (user, productId, quantity) => {
  const product = await Product.findOne({ _id: productId });
  if(product===null){
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      "Product doesn't exist in database"
    );
  }
  if (!product) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      "Product doesn't exist in database"
    );
  }

  const newProduct = {
    email: user.email,
    cartItems: [
      {
        product: product,
        quantity: quantity,
      },
    ],
  };
  let cartObj = await Cart.findOne({ email: user.email });
  if(!cartObj)
  {
    try{
      const newCart=new Cart({
        email:user.email,
        cartItems:[]
      });
      cartObj=await newCart.save();
    }catch(e)
    {
      throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR);
    }
  }
    let index = cartObj.cartItems.findIndex(
      (element) => element.product._id == productId
    );
    if (index > -1) {
      throw new ApiError(
        httpStatus.BAD_REQUEST,
        "Product already in cart. Use the cart sidebar to update or remove product from cart"
      );
    } else {
      cartObj.cartItems.push({ product: product, quantity: quantity });
      cartObj = await cartObj.save();
    }

    return cartObj;
  

};

/**
 * Updates the quantity of an already existing product in cart
 * - Get user's cart object using "Cart" model's findOne() method
 * - If cart doesn't exist, throw ApiError with
 * --- status code  - 400 BAD REQUEST
 * --- message - "User does not have a cart. Use POST to create cart and add a product"
 *
 * - If product to add not in "products" collection in MongoDB, throw ApiError with
 * --- status code  - 400 BAD REQUEST
 * --- message - "Product doesn't exist in database"
 *
 * - If product to update not in user's cart, throw ApiError with
 * --- status code  - 400 BAD REQUEST
 * --- message - "Product not in cart"
 *
 * - Otherwise, update the product's quantity in user's cart to the new quantity provided and return the cart object
 *
 *
 * @param {User} user
 * @param {string} productId
 * @param {number} quantity
 * @returns {Promise<Cart>}
 * @throws {ApiError}
 */
const updateProductInCart = async (user, productId, quantity) => {
  const product = await Product.findById(productId);
  if (!product) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      "Product doesn't exist in database"
    );
  }

  let userCart = await Cart.findOne({ email: user.email });
  if (!userCart) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      "User does not have a cart. Use POST to create cart and add a product"
    );
  }
  const index = await userCart.cartItems.findIndex(
    (element) => element.product._id == productId
  );
  if (index > -1) {
    if (quantity == 0) {
      let userCart = await Cart.findOne({ email: user.email });
      let arr = userCart.cartItems;
      arr.splice(index, 1);
      userCart = await userCart.save();
      return await Cart.findOne({ email: user.email });
    } else if (quantity > 0) {
      userCart.cartItems[index].quantity = quantity;
      userCart = await userCart.save();
      return userCart;
    }
  } else {
    throw new ApiError(httpStatus.BAD_REQUEST, "Product not in cart");
  }

};

/**
 * Deletes an already existing product in cart
 * - If cart doesn't exist for user, throw ApiError with
 * --- status code  - 400 BAD REQUEST
 * --- message - "User does not have a cart"
 *
 * - If product to update not in user's cart, throw ApiError with
 * --- status code  - 400 BAD REQUEST
 * --- message - "Product not in cart"
 *
 * Otherwise, remove the product from user's cart
 *
 *
 * @param {User} user
 * @param {string} productId
 * @throws {ApiError}
 */
const deleteProductFromCart = async (user, productId) => {
  let cartObj = await Cart.findOne({ email: user.email });
  if(cartObj===null){ throw new ApiError(httpStatus.BAD_REQUEST,"User does not have a cart")}

  const productIndex = cartObj.cartItems.findIndex(
    (product) => product.product._id.toString() === productId
  );

  if(productIndex===-1)
  {
    throw new ApiError(httpStatus.BAD_REQUEST,"Product not in cart")
  }
  cartObj.cartItems.splice(productIndex,1);
  await cartObj.save();

 
};

// TODO: CRIO_TASK_MODULE_TEST - Implement checkout function
/**
 * Checkout a users cart.
 * On success, users cart must have no products.
 *
 * @param {User} user
 * @returns {Promise}
 * @throws {ApiError} when cart is invalid
 */
// const checkout = async (userinfo) => {
//   if ((await User.hasSetNonDefaultAddress) === false) {
//     throw new ApiError(httpStatus.BAD_REQUEST, "Email already taken");
//   }

//   const userId = userinfo._id;
//   const user = await User.findById(userId);

//   try {
//     const cart = await getCartByUser(user);

//     let cartItems = [...cart.cartItems];
//     if (cartItems.length === 0) {
//       throw new ApiError(httpStatus.BAD_REQUEST);
//     }
//     let total = 0;
//     for (let i = 0; i < cartItems.length; i++) {
//       total +=
//         Number(cartItems[i].quantity) * Number(cartItems[i].product.cost);
//     }
//     if (total > user.walletMoney) {
//       throw new ApiError(
//         httpStatus.BAD_REQUEST,
//         "Insufficient balance in wallet"
//       );
//     } else {
//       const filter = { _id: userId };
//       const update = { $set: { walletMoney: user.walletMoney - total } };
//       const result = await User.updateOne(filter, update);

//       const filter2 = { _id: cart._id };
//       const update2 = { $unset: { cartItems: "" } };
//       const result2 = await Cart.updateOne(filter2, update2);

//       return true;
//     }
//   } catch (e) {
//     throw new ApiError(httpStatus.BAD_REQUEST);
//   }
// }
  //CORRECT CODE: TRY TO TAKE HINTS FROM THIS:
  //1. TRY AND CATCH BLOCK NOT REQUIRED HERE.
  //2. TRY TO SAVE METHOD TO UPDATE USER WALLET MONEY AND CART. OTHER METHOD MAY CAUSE TEST CASES TO FAIL

  const checkout = async (userinfo) => {

  

  const userCart = await Cart.findOne({ email: userinfo.email });
    if (userCart === null) {
      throw new ApiError(httpStatus.NOT_FOUND, "User does not have a cart");
    }

    if (userCart.cartItems.length === 0) {
      throw new ApiError(httpStatus.BAD_REQUEST);
    }
    const isAddressNotSet = await userinfo.hasSetNonDefaultAddress();
    if (isAddressNotSet===false) {    //here compare isAddressNotSet with false
      throw new ApiError(
        httpStatus.BAD_REQUEST,
        "User has no default address set"
      );
    }
  

    let userCartTotal = userCart.cartItems.reduce((acc, ele) => {
      return acc+(ele.product.cost*ele.quantity);
    }, 0);

    if(userCartTotal > userinfo.walletMoney){
      throw new ApiError(httpStatus.BAD_REQUEST, "Insufficient Balance");
    }

    userinfo.walletMoney -= userCartTotal;
   
    userCart.cartItems = [];
    await userCart.save();


    const filter = { _id: userinfo._id };
    const update = { $set: { walletMoney: userinfo.walletMoney} };
    let result=await User.updateOne(filter, update);

    return true
};

module.exports = {
  getCartByUser,
  addProductToCart,
  updateProductInCart,
  deleteProductFromCart,
  checkout,
};
