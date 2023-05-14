const Joi = require("joi");
const { password } = require("./custom.validation");

// TODO: CRIO_TASK_MODULE_AUTH - Define request validation schema for user registration
/**
 * Check request *body* for fields (all are *required*)
 * - "email" : string and satisyfing email structure
 * - "password": string and satisifes the custom password structure defined in "src/validations/custom.validation.js"
 * - "name": string
 */
 const register = {
  body: Joi.object().keys({
    email: Joi.string()
      .required()
      .email({ tlds: { allow: false } }),
    password: Joi.string().required().custom(password),
    name: Joi.string().required(),
  }),
};

// const authRegistraionValidation=(req,res,next)=>{
//   const { name,email,password }=req.body;
//   const data={ name,email,password };
//   const result= register.validate(data)
//   if(result.error)
//     {
//       return res.status(422).json(result.error);
//     }
//     next();
// }

/**
 * Check request *body* for fields (all are *required*)
 * - "email" : string and satisyfing email structure
 * - "password": string and satisifes the custom password structure defined in "src/validations/custom.validation.js"
 */
const login = {
  body:Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().custom(password)
  })
};

// const authLoginValidation=(req,res,next)=>{
//   const {email, password}=req.body;
//   const data= {email, password}
//   const result=login.validate(data)
//   if(result.error){
//     return res.status(422).json(result.error)
//   }
//   next();
// }

module.exports = {
  register,
  login,
  // authRegistraionValidation,
  // authLoginValidation
};
