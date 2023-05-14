//const { User } = require("../models");
const { User }=require("../models/user.model")
const httpStatus = require("http-status");
const ApiError = require("../utils/ApiError");
const bcrypt = require("bcryptjs");

// TODO: CRIO_TASK_MODULE_UNDERSTANDING_BASICS - Implement getUserById(id)
/**
 * Get User by id
 * - Fetch user object from Mongo using the "_id" field and return user object
 * @param {String} id
 * @returns {Promise<User>}
 */
const getUserById= async(id)=>{
 
    const user=await User.findById(id)
    return user;
}

const getUserAddressById=async (id)=>{
  return await User.findOne({ _id: id},{ email:1 , address:1 } )
}

const setAddress = async (user, address)=>{
  user.address=address;
  await user.save()
  return user.address;
}




// TODO: CRIO_TASK_MODULE_UNDERSTANDING_BASICS - Implement getUserByEmail(email)
/**
 * Get user by email
 * - Fetch user object from Mongo using the "email" field and return user object
 * @param {string} email
 * @returns {Promise<User>}
 */
 const getUserByEmail=async (email)=>{
 // const result=User.findOne({ email:email})
  
    return await User.findOne({ email:email});
}  
// TODO: CRIO_TASK_MODULE_UNDERSTANDING_BASICS - Implement createUser(user)
/**
 * Create a user
 *  - check if the user with the email already exists using `User.isEmailTaken()` method
 *  - If so throw an error using the `ApiError` class. Pass two arguments to the constructor,
 *    1. “200 OK status code using `http-status` library
 *    2. An error message, “Email already taken”
 *  - Otherwise, create and return a new User object
 *
 * @param {Object} userBody
 * @returns {Promise<User>}
 * @throws {ApiError}
 *
 * userBody example:
 * {
 *  "name": "crio-users",
 *  "email": "crio-user@gmail.com",
 *  "password": "usersPasswordHashed"
 * }
 *
 * 200 status code on duplicate email - https://stackoverflow.com/a/53144807
 */
// const getUserAddressById=async (user)=>{
//   const result=await User.findById(user)
//   return result;
// }

 const createUser=async (user)=>{
    
   if((await User.isEmailTaken(user.email)))
    { 
      throw new ApiError(httpStatus.OK, "Email already taken");
    }
   else{
    //const newUser=new User(req);
    //const user= await newUser.save();
    //return user; 
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(user.password, salt);
    const newUser = await User.create({ ...user, password: hashedPassword });
    return newUser;

    }
  }
  

module.exports= { createUser, getUserByEmail, getUserById, getUserAddressById, setAddress}

