import { Request, Response, Router } from "express";
import { UsersService } from "../../services/users";
import bcrypt from "bcrypt";
import { LoginValidation } from "./validations/login.validation";
import { SignupValidation } from "./validations/signup.validation";
import { validate } from "../../middlewares/validate";
import { SuccessResponse } from "../../utils/SuccessResponse";

const router = Router();

router.post(
  "/login",
  LoginValidation,
  validate,
  async (req: Request, res: Response) => {
    console.log("hello");
    const user = await UsersService.findByEmail(req.body.email);

    if (user === null) {
      return res.status(500).json("email not exist");
    }

    const isPasswordCorrect = await bcrypt.compare(
      req.body.password,
      user.password
    );

    if (!isPasswordCorrect) {
      return res.status(500).json("incorrect_password");
    }

    const response = new SuccessResponse("Login Success", user);

    return res.json(response);
  }
);

router.post(
  "/signup",
  SignupValidation,
  validate,
  async (req: Request, res: Response) => {
    const doesEmailExist =
      (await UsersService.findByEmail(req.body.email)) === null;

    if (!doesEmailExist) {
      return res.status(500).json("email is not available");
    }

    const user = await UsersService.create({
      email: req.body.email,
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      password: req.body.password,
      phoneNumber: req.body.phoneNumber,
      balance: 100,
    });

    return res.json({ user });
  }
);

export default router;
