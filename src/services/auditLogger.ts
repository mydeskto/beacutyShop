export interface AuditLogEntry {
  id: string;
  timestamp: string;
  eventType: 'AUTH_LOGIN' | 'AUTH_SIGNUP' | 'OTP_SENT' | 'OTP_VERIFY' | 'PAYMENT_SUCCESS' | 'PAYMENT_FAILURE' | 'PRODUCT_PURCHASED' | 'PRODUCT_PURCHASE_FAILED' | 'ACCESS_DENIED' | 'ADMIN_ACTION';
  actor: string;
  details: string;
  status: 'SUCCESS' | 'FAILURE';
  ipAddress?: string;
  userAgent?: string;
  metadata?: any;
}

const AUDIT_LOGS_KEY = 'purelis_soc2_audit_logs';

export const auditLogger = {
  log: (
    eventType: AuditLogEntry['eventType'],
    actor: string,
    details: string,
    status: 'SUCCESS' | 'FAILURE',
    metadata?: any
  ): AuditLogEntry => {
    const entry: AuditLogEntry = {
      id: `audit_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      timestamp: new Date().toISOString(),
      eventType,
      actor: actor || 'anonymous',
      details,
      status,
      ipAddress: '127.0.0.1 (Secure Preview)',
      userAgent: navigator.userAgent || 'Web Client',
      metadata
    };

    try {
      const existing = auditLogger.getLogs();
      const updated = [entry, ...existing].slice(0, 500); // Keep last 500 for SOC2 compliance buffer
      localStorage.setItem(AUDIT_LOGS_KEY, JSON.stringify(updated));
      console.log(`[SOC2 TYPE I AUDIT LOG]:`, entry);
    } catch (err) {
      console.error('Failed to write SOC2 audit log:', err);
    }

    return entry;
  },

  getLogs: (): AuditLogEntry[] => {
    try {
      const saved = localStorage.getItem(AUDIT_LOGS_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch {}
    return [];
  },

  clearLogs: () => {
    localStorage.removeItem(AUDIT_LOGS_KEY);
  }
};
