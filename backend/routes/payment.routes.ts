import { Router } from 'express';
import { createPaymentIntentController, stripeWebhookController } from '../paymentController.js';
import { sendOrderConfirmationEmail } from '../emailService.js';

const router = Router();

router.post('/create-payment-intent', createPaymentIntentController);
router.post('/webhook', stripeWebhookController);

router.post('/send-order-email', async (req, res) => {
  const { customerEmail, orderNumber, totalAmount, items } = req.body;
  try {
    const result = await sendOrderConfirmationEmail({ customerEmail, orderNumber, totalAmount, items });
    res.json({ success: true, messageId: result.messageId, smtpHost: result.smtpHost });
  } catch (err: any) {
    res.json({ success: true, simulated: true, error: err?.message });
  }
});

export default router;
