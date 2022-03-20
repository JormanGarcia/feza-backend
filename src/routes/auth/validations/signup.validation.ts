import { body } from "express-validator";

export const SignupValidation = [
  body("email").isEmail().notEmpty(),
  body("password").notEmpty().isString(),
  body("phoneNumber").notEmpty(),
  body("firstName").isString().notEmpty(),
  body("lastName").isString().notEmpty(),
];
