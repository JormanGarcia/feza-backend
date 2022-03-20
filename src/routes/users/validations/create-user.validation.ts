import { body } from "express-validator";

export const CreateUserValidation = [
  body("firstName").isString().notEmpty(),
  body("lastName").isString().notEmpty(),
  body("email").isString().notEmpty(),
  body("password").isString().notEmpty(),
];
