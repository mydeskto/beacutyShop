import { loadData, saveData } from './db.js';

export interface ServerAuditLog {
  id: string;
  timestamp: string;
  eventType: string;
  actor: string;
  details: string;
  status: 'SUCCESS' | 'FAILURE';
  ipAddress?: string;
  metadata?: any;
}

export const serverAuditLogger = {
  log: (eventType: string, actor: string, details: string, status: 'SUCCESS' | 'FAILURE', metadata?: any) => {
    const data = loadData();
    const entry: ServerAuditLog = {
      id: `audit_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      timestamp: new Date().toISOString(),
      eventType,
      actor: actor || 'anonymous',
      details,
      status,
      ipAddress: '127.0.0.1',
      metadata
    };
    data.auditLogs = [entry, ...(data.auditLogs || [])].slice(0, 500);
    saveData(data);
    console.log(`[SOC2 TYPE I AUDIT LOG]: ${eventType} | ${actor} | ${status} | ${details}`);
    return entry;
  },
  getLogs: () => {
    const data = loadData();
    return data.auditLogs || [];
  }
};
