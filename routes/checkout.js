import express from "express";
import Stripe from "stripe";
import dotenv from "dotenv";

dotenv.config();

const router = express.Router();

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2024-06-20",
});

const planos = {
  premium: { priceId: "price_1Tnla9IaEQocziLMhkwnPuSO", name: "Premium" },
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
      payment_method_types: ["card"],
      line_items: [
        {
          price: planos[plano].priceId,
          quantity: 1,
        },
      ],
      customer_email: email,
      metadata: { plano, userId },
      success_url: "https://agenda-inteligente-app-nine.vercel.app/dashboard?success=true",
      cancel_url: "https://agenda-inteligente-app-nine.vercel.app/dashboard?canceled=true",
    });

    return res.json({ url: session.url });

  } catch (err) {
    console.error("ERRO STRIPE:", err);
    return res.status(500).json({ error: "Erro ao criar checkout" });
  }
});

export default router;