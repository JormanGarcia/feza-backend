import { Router } from "express";
import { RequestsService } from "../../services/requests";

const router = Router();

router.get("/", async (req, res) => {
  const users = await RequestsService.findAll();
  return res.json(users);
});

router.post("/", async (req, res) => {
  const operation = await RequestsService.create(req.body);

  return res.json(operation.data);
});

router.put("/:action/:id", async (req, res) => {
  if (req.params.action !== "pay" && req.params.action !== "reject") {
    return res.status(500).json("invalid action");
  }

  if (req.params.action === "pay") {
    const request = await RequestsService.findById(req.params.id);

    if (!request) return res.status(500);

    const issuer = request.users.filter(
      (item) => item.email === request.issuer
    )[0];

    if (request.amount > issuer.balance)
      return res.status(500).json("invalid_funds");
  }

  const result = await RequestsService.handle(
    req.params.action as "pay" | "reject",
    req.params.id
  );
  return res.json(result);
});

export default router;
