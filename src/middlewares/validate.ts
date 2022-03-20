import { NextFunction, Request, Response } from "express";
import { validationResult } from "express-validator";

export const validate = (req: Request, res: Response, next: NextFunction) => {
  console.log(req.body);
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    console.log(errors.array());
    return {
      errors: res
        .status(500)
        .json(errors.array().map((item) => ({ [item.param]: item.msg }))),
    };
  }

  next();
};
