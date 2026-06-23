import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import checkoutRoutes from "./routes/checkout.js";


dotenv.config();

console.log("ENV COMPLETO:");
console.log(process.env.CLIENT_URL);
console.log(process.env.STRIPE_SECRET_KEY);


const app = express();

//  CORS (ANTES DE TUDO)
app.use(
  cors({
    origin: [
      "https://agenda-inteligente-app-lovat.vercel.app",
      "https://agenda-inteligente-app-nine.vercel.app"
    ],
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.options("*", cors());
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