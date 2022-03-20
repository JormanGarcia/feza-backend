import express from "express";
import UsersRoutes from "../src/routes/users";
import OperationsRoutes from "../src/routes/operations";
import RequestsRoutes from "../src/routes/requests";
import AuthRoutes from "../src/routes/auth";
import cors from "cors";
import "dotenv/config";

const app = express();

app.use(express.json());
app.use(cors());

// Routes
app.use("/users", UsersRoutes);
app.use("/operations", OperationsRoutes);
app.use("/requests", RequestsRoutes);
app.use("/auth", AuthRoutes);

app.listen(process.env.PORT, () => {
  console.log("Server Running: " + process.env.PORT);
});
