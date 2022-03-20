import { Router, Request, Response } from "express";
import { SuccessResponse } from "../../utils/SuccessResponse";
import { validate } from "../../middlewares/validate";
import { UsersService } from "../../services/users";
import { CreateUserValidation } from "./validations/create-user.validation";

const router = Router();

router.get("/", async (req, res) => {
  const users = await UsersService.findAll();

  return res.json(users);
});

router.get("/email/:email", async (req, res) => {
  const users = await UsersService.findByEmail(req.params.email);
  return res.json(users);
});

router.get("/match/email/:email", async (req, res) => {
  const users = await UsersService.matchEmail(req.params.email);
  return res.json(users);
});

router.get("/id/:id", async (req, res) => {
  const users = await UsersService.findById(req.params.id);

  if (users === null) {
    return res.status(500).json("User dont exist");
  }

  return res.json(users);
});

router.post(
  "/",
  CreateUserValidation,
  validate,
  async (req: Request, res: Response) => {
    if ((await UsersService.findByEmail(req.body.email)) !== null) {
      return res.status(500).send("email is not available");
    }

    const createdUser = await UsersService.create(req.body);
    const response = new SuccessResponse(
      "User Successfully Created",
      createdUser
    );
    return res.json(response);
  }
);

router.delete("/:id", async (req, res) => {
  try {
    if ((await UsersService.findByEmail(req.params.id)) === null) {
      return res.status(404).send("Not found");
    }

    const result = await UsersService.delete(req.params.id);
    const response = new SuccessResponse("User Successfully Deleted");
    return res.json(response);
  } catch (e) {
    console.log(e);
    res.status(500).json("Something wrong has happen");
  }
});

router.put("/:id", async (req, res) => {
  const { body, params } = req;
  const result = await UsersService.update(params.id, body);
  const response = new SuccessResponse("User Successfully Updated");
  return res.json(response);
});

export default router;
