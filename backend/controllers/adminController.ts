import { loadData, saveData } from '../db.js';
import { serverAuditLogger } from '../auditLogger.js';

export const adminController = {
  getStats: (req: any, res: any) => {
    const data = loadData();
    const orders = data.orders || [];
    const products = data.products || [];
    const users = data.users || [];

    const totalRevenue = orders.reduce((sum: number, o: any) => sum + (o.totalAmount || 0), 0);
    const totalOrdersCount = orders.length;
    const totalProductsCount = products.length;
    const totalCustomersCount = users.filter((u: any) => u.role === 'customer').length;

    res.json({
      success: true,
      stats: {
        totalRevenue,
        totalOrdersCount,
        totalProductsCount,
        totalCustomersCount
      }
    });
  },

  getAuditLogs: (req: any, res: any) => {
    const logs = serverAuditLogger.getLogs();
    res.json({ success: true, logs });
  },

  clearAuditLogs: (req: any, res: any) => {
    const data = loadData();
    data.auditLogs = [];
    saveData(data);
    res.json({ success: true, logs: [] });
  },

  getSettings: (req: any, res: any) => {
    const data = loadData();
    res.json({ success: true, settings: data.settings || {} });
  },

  updateSettings: (req: any, res: any) => {
    const newSettings = req.body;
    const data = loadData();
    data.settings = { ...(data.settings || {}), ...newSettings };
    saveData(data);
    res.json({ success: true, settings: data.settings });
  }
};
