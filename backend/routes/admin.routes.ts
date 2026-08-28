import { Router } from 'express';
import { adminController } from '../controllers/adminController.js';

const router = Router();

router.get('/stats', adminController.getStats);
router.get('/audit-logs', adminController.getAuditLogs);
router.delete('/audit-logs', adminController.clearAuditLogs);
router.get('/settings', adminController.getSettings);
router.post('/settings', adminController.updateSettings);

export default router;
