const httpStatus = require("http-status");
const ApiError = require("../utils/ApiError");
const catchAsync = require("../utils/catchAsync");
const userService = require('../services/user.service')
const { getUserById, createUser, getUserAddressById, setUserAddress } = require("../services/user.service");
//const User=require("../models/user.model")
//const { User }=require("../models/user.model")

// TODO: CRIO_TASK_MODULE_UNDERSTANDING_BASICS - Implement getUser() function
/**
 * Get user details
 *  - Use service layer to get User data
 * 
 *  - Return the whole user object fetched from Mongo

 *  - If data exists for the provided "userId", return 200 status code and the object
 *  - If data doesn't exist, throw an error using `ApiError` class
 *    - Status code should be "404 NOT FOUND"
 *    - Error message, "User not found"
 *  - If the user whose token is provided and user whose data to be fetched don't match, throw `ApiError`
 *    - Status code should be "403 FORBIDDEN"
 *    - Error message, "User not found"
 *
 * 
 * Request url - <workspace-ip>:8082/v1/users/6010008e6c3477697e8eaba3
 * Response - 
 * {
 *     "walletMoney": 500,
 *     "address": "ADDRESS_NOT_SET",
 *     "_id": "6010008e6c3477697e8eaba3",
 *     "name": "crio-users",
 *     "email": "crio-user@gmail.com",
 *     "password": "criouser123",
 *     "createdAt": "2021-01-26T11:44:14.544Z",
 *     "updatedAt": "2021-01-26T11:44:14.544Z",
 *     "__v": 0
 * }
 * 
 *
 * Example response status codes:
 * HTTP 200 - If request successfully completes
 * HTTP 403 - If request data doesn't match that of authenticated user
 * HTTP 404 - If user entity not found in DB
 * 
 * @returns {User | {address: String}}
 *
 */

const getUser = catchAsync(async (req, res) => {
    let { userId }=req.params;
    const result=await getUserById(userId);
    if(result.email!=(req.user.email))
    {
        throw new ApiError(httpStatus.FORBIDDEN)
    }
    if(!result){
      throw new ApiError(httpStatus.NOT_FOUND, "User does not exist") 
    }
    let param =req.query;
    if(param.q=="address"){
      const result=await getUserAddressById(userId);
      console.log(result)
      let addressObject={ "address": result.address}    
      return res.status(httpStatus.OK).json(addressObject);

    }
    return res.status(200).json(result)
})

const setAddress=catchAsync(async(req,res)=>{
  const { userId }=req.params;
  let result=await getUserAddressById(userId);
  if(!result)
  {
    throw new ApiError(httpStatus.NOT_FOUND,"User not found")
  }
  console.log(result)
  if(result.email!=req.user.email)
  {
      throw new ApiError(httpStatus.FORBIDDEN)
  }
  const address=await userService.setAddress(result, req.body.address)


  return res.status(httpStatus.OK).json({ address});

})
const createNewUser=catchAsync(async(req, res)=>{
 
   let result= await createUser(req.body);
  
    return res.json(result);


})


module.exports = {
  getUser, createNewUser, setAddress
};
