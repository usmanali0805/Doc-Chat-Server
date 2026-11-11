import dotenv from 'dotenv';
dotenv.config()
import { Stripe } from 'stripe'
import User from "../models/usermodel.js";
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

 async function PaymentController (req, res) {
  try {
    const user = await User.findById(req.userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      line_items: [{
        price_data: {
          unit_amount: process.env.STRIPE_PRICE_ID,
          currency: 'usd',
          product_data: {
            name: "DocChat Pro Plan", 
          },
          recurring: {
            interval: 'month',
          }
        },
        quantity: 1
      }],
      customer_email: user.email,
      client_reference_id: String(user._id),
      success_url: `${process.env.CLIENT_URL}/chat?upgraded=true`,
      cancel_url: `${process.env.CLIENT_URL}/pricing`,
    });

    return res.status(200).json({ url: session.url });
  } catch (error) {
    console.error("Create checkout session error:", error);
    return res.status(500).json({ message: error.message });
  }
}

export default PaymentController