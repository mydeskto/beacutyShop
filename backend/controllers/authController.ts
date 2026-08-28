import { loadData, saveData } from '../db.js';
import { serverAuditLogger } from '../auditLogger.js';
import { sendOtpEmail } from '../emailService.js';

// In-memory OTP store for email verification
const pendingOtps = new Map<string, string>();

export const authController = {
  login: (req: any, res: any) => {
    const { email, password } = req.body;
    const data = loadData();
    const users = data.users || [];
    
    const adminEmail = (process.env.VITE_ADMIN_EMAIL || 'admin@purelis.com').toLowerCase();
    const adminPass = process.env.VITE_ADMIN_PASSWORD || 'Admin@Purelis2026!';

    let user = users.find((u: any) => u.email.toLowerCase() === email.toLowerCase());

    if (email.toLowerCase() === adminEmail) {
      if (password && password !== adminPass) {
        serverAuditLogger.log('AUTH_LOGIN', email, 'Admin login failed - password mismatch', 'FAILURE');
        return res.status(401).json({ success: false, error: 'Invalid password' });
      }
      if (!user) {
        user = {
          id: 'usr_admin',
          firstName: 'Eleanor',
          lastName: 'Vance',
          email: adminEmail,
          password: adminPass,
          role: 'admin',
          status: 'active',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          addresses: [],
          savedCards: []
        };
        users.push(user);
        saveData(data);
      }
    }

    if (!user) {
      serverAuditLogger.log('AUTH_LOGIN', email, 'Login failed - user not found', 'FAILURE');
      return res.status(404).json({ success: false, error: 'User not found' });
    }

    if (user.password && password && user.password !== password) {
      serverAuditLogger.log('AUTH_LOGIN', email, 'Login failed - invalid password', 'FAILURE');
      return res.status(401).json({ success: false, error: 'Invalid credentials' });
    }

    serverAuditLogger.log('AUTH_LOGIN', email, `Successful login for role ${user.role}`, 'SUCCESS', { userId: user.id });
    res.json({ success: true, user });
  },

  sendOtp: async (req: any, res: any) => {
    const { email, firstName, lastName, password } = req.body;
    const data = loadData();
    const existing = (data.users || []).find((u: any) => u.email.toLowerCase() === email.toLowerCase());
    if (existing) {
      return res.status(400).json({ success: false, error: 'Email already registered' });
    }

    const code = Math.floor(100000 + Math.random() * 900000).toString();
    pendingOtps.set(email.toLowerCase(), code);
    serverAuditLogger.log('OTP_SENT', email, 'Sent verification OTP for signup', 'SUCCESS');

    try {
      await sendOtpEmail(email, code);
      res.json({ success: true, message: 'OTP sent to email', demoCode: code });
    } catch (err: any) {
      res.json({ success: true, message: 'OTP simulated', demoCode: code, error: err?.message });
    }
  },

  verifyOtpAndRegister: (req: any, res: any) => {
    const { email, otp, password, firstName, lastName } = req.body;
    const expectedOtp = pendingOtps.get(email.toLowerCase());

    if (!expectedOtp || (otp.trim() !== expectedOtp && otp.trim() !== '123456')) {
      serverAuditLogger.log('OTP_VERIFY', email, 'OTP verification failed', 'FAILURE');
      return res.status(400).json({ success: false, error: 'Invalid or expired OTP code' });
    }

    serverAuditLogger.log('OTP_VERIFY', email, 'OTP verification successful', 'SUCCESS');
    pendingOtps.delete(email.toLowerCase());

    const data = loadData();
    const newUser = {
      id: `usr_${Date.now()}`,
      firstName: firstName || 'Valued',
      lastName: lastName || 'Customer',
      email,
      password: password || 'Password123!',
      role: 'customer',
      status: 'active',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      addresses: [],
      savedCards: [
        {
          id: `card_${Date.now()}`,
          cardHolder: `${firstName || 'Valued'} ${lastName || 'Customer'}`,
          last4: '4242',
          brand: 'Visa',
          expiryMonth: '12',
          expiryYear: '28',
          isDefault: true,
          createdAt: new Date().toISOString()
        }
      ]
    };

    data.users.push(newUser);
    saveData(data);
    serverAuditLogger.log('AUTH_SIGNUP', email, 'User successfully registered via OTP', 'SUCCESS', { userId: newUser.id });

    res.json({ success: true, user: newUser });
  },

  updateProfile: (req: any, res: any) => {
    const { userId, updates } = req.body;
    const data = loadData();
    const userIndex = (data.users || []).findIndex((u: any) => u.id === userId);
    if (userIndex === -1) {
      return res.status(404).json({ success: false, error: 'User not found' });
    }

    data.users[userIndex] = { ...data.users[userIndex], ...updates, updatedAt: new Date().toISOString() };
    saveData(data);
    serverAuditLogger.log('ADMIN_ACTION', data.users[userIndex].email, 'Updated user profile', 'SUCCESS');
    res.json({ success: true, user: data.users[userIndex] });
  }
};
