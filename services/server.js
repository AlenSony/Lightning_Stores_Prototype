import cors from "cors";
import express from "express";
import getConfig from "./config.js";

const app = express();
const port = getConfig().port || 3000;
app.use(cors());
app.use(express.json());

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
