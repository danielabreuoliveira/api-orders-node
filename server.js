require('dotenv').config();

// Agora você pode acessar os valores assim:
const secret = process.env.JWT_SECRET;
const port = process.env.PORT || 3000;

console.log(`Servidor configurado na porta ${port}`);

const express = require("express");
const orderRoutes = require("./routes/orderRoutes");

const app = express();

app.use(express.json());

app.use("/", orderRoutes);

app.listen(3000, () => {
  console.log("Server running on port 3000");
});