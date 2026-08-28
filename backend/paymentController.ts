export const createPaymentIntentController = (req: any, res: any) => {
  const { amount, currency = 'usd' } = req.body;
  const paymentIntentId = `pi_${Date.now()}_${Math.random().toString(36).substring(7)}`;
  const clientSecret = `${paymentIntentId}_secret_${Math.random().toString(36).substring(5)}`;
  
  res.json({
    success: true,
    data: {
      clientSecret,
      paymentIntentId,
      amount,
      currency
    }
  });
};

export const stripeWebhookController = (req: any, res: any) => {
  const event = req.body;
  console.log(`[Stripe Webhook Event Received]: ${event.type || 'payment_intent.succeeded'}`);
  res.json({ received: true });
};
