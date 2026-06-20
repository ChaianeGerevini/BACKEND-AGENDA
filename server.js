import express from "express";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

console.log("ENV COMPLETO:");
console.log(process.env.CLIENT_URL);
console.log(process.env.STRIPE_SECRET_KEY);import checkoutRoutes from "./routes/checkout.js";


const app = express();

// ✔️ CORS (ANTES DE TUDO)
app.use(
  cors({
    origin: process.env.CLIENT_URL,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);
// JSON
app.use(express.json());

// ROTAS
app.use("/checkout", checkoutRoutes);

// TESTE
app.get("/teste", (req, res) => {
  res.send("API funcionando 🚀");
});

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log("Server rodando na porta", PORT);
});