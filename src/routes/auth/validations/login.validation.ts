import { body } from "express-validator";

export const LoginValidation = [
  body("email").isEmail().notEmpty(),
  body("password").notEmpty().isString(),
];
