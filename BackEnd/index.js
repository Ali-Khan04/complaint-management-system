import express from "express";
import cors from "cors";
import userRoutes from "./routes/userRoutes.js";
import complainRouter from "./routes/complainsRoute.js";
import sequelize from "./db/config.js";

const app = express();
const PORT = 3000;
sequelize
  .authenticate()
  .then(() => console.log("Connected to Sql Server"))
  .catch((err) => console.error("Error Connected to Sql Server :", err));
app.use(cors());
app.use(express.json());

app.use("/user-portal", userRoutes);
app.use("/user-portal", complainRouter);

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
