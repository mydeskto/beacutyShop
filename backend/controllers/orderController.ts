import { loadData, saveData } from '../db.js';
import { serverAuditLogger } from '../auditLogger.js';
import { sendOrderConfirmationEmail } from '../emailService.js';

export const orderController = {
  createOrder: async (req: any, res: any) => {
    const { email, customerId, items, shippingAddress, paymentMethod, totalAmount, discountAmount, shippingFee } = req.body;
    const data = loadData();
    const orders = data.orders || [];

    const orderNumber = Math.floor(100000 + Math.random() * 900000).toString();
    const newOrder = {
      id: `ord_${Date.now()}`,
      orderNumber,
      email: email || 'customer@purelis.com',
      customerId: customerId || 'guest',
      items: items || [],
      shippingAddress: shippingAddress || {},
      paymentMethod: paymentMethod || { brand: 'Visa', last4: '4242' },
      totalAmount: totalAmount || 0,
      discountAmount: discountAmount || 0,
      shippingFee: shippingFee || 0,
      status: 'paid',
      fulfillmentStatus: 'unfulfilled',
      createdAt: new Date().toISOString()
    };

    orders.unshift(newOrder);
    data.orders = orders;
    saveData(data);

    // SOC2 Type I Audit Logs
    serverAuditLogger.log('PAYMENT_SUCCESS', email, `Payment processed successfully for order #${orderNumber}`, 'SUCCESS', { amount: totalAmount });
    serverAuditLogger.log('PRODUCT_PURCHASED', email, `Products purchased: ${(items || []).map((i: any) => `${i.name} (x${i.quantity})`).join(', ')}`, 'SUCCESS', { orderId: newOrder.id });

    // Send email confirmation via Nodemailer
    try {
      await sendOrderConfirmationEmail({
        customerEmail: email,
        orderNumber,
        totalAmount,
        items
      });
      console.log(`[Email Dispatched]: Order confirmation sent to ${email}`);
    } catch (mailErr: any) {
      console.error('[Email Dispatch Simulated/Failed]:', mailErr?.message);
    }

    res.json({ success: true, order: newOrder });
  },

  getOrders: (req: any, res: any) => {
    const data = loadData();
    res.json({ success: true, orders: data.orders || [] });
  },

  updateOrderStatus: (req: any, res: any) => {
    const { orderId, status, fulfillmentStatus } = req.body;
    const data = loadData();
    const orders = data.orders || [];
    const idx = orders.findIndex((o: any) => o.id === orderId);
    if (idx === -1) {
      return res.status(404).json({ success: false, error: 'Order not found' });
    }

    if (status) orders[idx].status = status;
    if (fulfillmentStatus) orders[idx].fulfillmentStatus = fulfillmentStatus;
    saveData(data);
    res.json({ success: true, order: orders[idx] });
  }
};
