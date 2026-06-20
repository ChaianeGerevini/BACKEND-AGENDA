import express from "express";
import Stripe from "stripe";
import dotenv from "dotenv";

dotenv.config();

const router = express.Router();

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2024-06-20",
});

const planos = {
  premium: { priceId: "price_1Tj3omIaEQocziLMOfi8AD8o", name: "Premium" },
  plus: { priceId: "price_1Tj3pjIaEQocziLMK0Eopxwv", name: "Premium Plus" },
};

router.post("/", async (req, res) => {
  try {
    const { plano, userId, email } = req.body;
    if (!planos[plano]) {
  return res.status(400).json({
    error: "Plano inválido",
    recebido: plano
  });
}

const session = await stripe.checkout.sessions.create({
  mode: "subscription",
  line_items: [
    {
      price: planos[plano].priceId,
      quantity: 1,
    },
  ],
  customer_email: email,
  metadata: { plano, userId },
  success_url: "https://agenda-inteligente-app-lovat.vercel.app/dashboard?success=true",
  cancel_url: "https://agenda-inteligente-app-lovat.vercel.app/dashboard?canceled=true",
});

    return res.json({ url: session.url });

  } catch (err) {
    console.error("ERRO STRIPE:", err);
    return res.status(500).json({ error: "Erro ao criar checkout" });
  }
});

export default router;