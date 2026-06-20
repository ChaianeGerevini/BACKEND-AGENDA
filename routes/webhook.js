import express from "express";
import Stripe from "stripe";
import dotenv from "dotenv";
import { getFirestore } from "firebase-admin/firestore";
import admin from "firebase-admin";

dotenv.config();

const router = express.Router();

// Stripe
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// Firebase Admin (BACKEND!)
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(
      JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT)
    ),
  });
}

const db = getFirestore();

/**
 * IMPORTANTE:
 * Stripe exige RAW body no webhook
 */
router.post(
  "/",
  express.raw({ type: "application/json" }),
  async (req, res) => {
    const sig = req.headers["stripe-signature"];

    let event;

    try {
      event = stripe.webhooks.constructEvent(
        req.body,
        sig,
        process.env.STRIPE_WEBHOOK_SECRET
      );
    } catch (err) {
      console.log("Webhook inválido:", err.message);
      return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    // 👇 PAGAMENTO CONCLUÍDO
    if (event.type === "checkout.session.completed") {
      const session = event.data.object;

      const plano = session.metadata?.plano;
      const userId = session.metadata?.userId;

      console.log("💰 PAGAMENTO OK:", { plano, userId });

      if (userId && plano) {
        await db.collection("usuarios").doc(userId).update({
          plano: plano,
          statusPagamento: "ativo",
          updatedAt: new Date(),
        });
      }
    }

    res.json({ received: true });
  }
);

export default router;