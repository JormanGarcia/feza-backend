import { Router } from "express";
import { OperationsService } from "../../services/operations";
import { UsersService } from "../../services/users";

const router = Router();

router.get("/", async (req, res) => {
  const users = await OperationsService.findAll();
  return res.json(users);
});

router.post("/transfer", async (req, res) => {
  console.log("Transfering...");

  try {
    const [issuer, receptor] = await Promise.all([
      UsersService.findByEmail(req.body.fromUser),
      UsersService.findByEmail(req.body.toUser),
    ]);

    if (issuer && issuer.balance < req.body.amount) {
      return res.status(500).json({ err: "invalid_amount" });
    }

    if (receptor === null) {
      return res.status(404).json({
        err: "user_not_exist",
      });
    }

    if (req.body.fromUser === req.body.toUser) {
      return res.status(500).json({ err: "invalid_email" });
    }

    const operation = await OperationsService.transfer(req.body);
    return res.json(operation);
  } catch (e) {
    console.log(e);
    return res.status(500).json("something_went_wrong");
  }
});

router.delete("/:id", async (req, res) => {
  const result = await OperationsService.delete(req.params.id);
  return res.json(result);
});

router.put("/:id", async (req, res) => {
  const { body, params } = req;
  const result = await OperationsService.update(params.id, body);
  return res.json(result);
});

export default router;
