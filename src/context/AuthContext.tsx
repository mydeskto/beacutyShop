import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, UserRole, SavedPaymentCard } from '../types';
import { mockDb } from '../services/mockDb';
import { setCookie, getCookie, removeCookie } from '../utils/cookies';
import { auditLogger } from '../services/auditLogger';

interface AuthContextType {
  currentUser: User | null;
  role: UserRole;
  isAuthenticated: boolean;
  isAdmin: boolean;
  isStaff: boolean;
  login: (email: string, password?: string) => Promise<boolean>;
  register: (email: string, password?: string, firstName?: string, lastName?: string) => Promise<boolean>;
  logout: () => void;
  updateProfile: (updated: Partial<User>) => void;
  addAddress: (address: Omit<import('../types').UserAddress, 'id'>) => void;
  removeAddress: (addressId: string) => void;
  setDefaultAddress: (addressId: string) => void;
  addSavedCard: (card: Omit<SavedPaymentCard, 'id' | 'createdAt'>) => void;
  removeSavedCard: (cardId: string) => void;
  switchRole: (role: UserRole) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const AUTH_COOKIE_KEY = 'purelis_session_user';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    const saved = getCookie(AUTH_COOKIE_KEY);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return null;
      }
    }
    return null;
  });

  useEffect(() => {
    if (currentUser) {
      setCookie(AUTH_COOKIE_KEY, JSON.stringify(currentUser), 7);
    } else {
      removeCookie(AUTH_COOKIE_KEY);
    }
  }, [currentUser]);

  const login = async (email: string, password?: string): Promise<boolean> => {
    const users = mockDb.getUsers();
    let user = users.find(u => u.email.toLowerCase() === email.toLowerCase());

    const adminEmail = (import.meta.env.VITE_ADMIN_EMAIL || 'admin@purelis.com').toLowerCase();
    const adminPass = import.meta.env.VITE_ADMIN_PASSWORD || 'Admin@Purelis2026!';

    if (email.toLowerCase() === adminEmail) {
      if (password && password !== adminPass) {
        auditLogger.log('AUTH_LOGIN', email, 'Admin login failed - incorrect password', 'FAILURE');
        return false;
      }
      if (!user) {
        user = mockDb.saveUser({
          firstName: 'Eleanor',
          lastName: 'Vance',
          email: adminEmail,
          password: adminPass,
          role: 'admin',
          status: 'active'
        });
      }
    }

    if (!user) {
      auditLogger.log('AUTH_LOGIN', email, 'Login failed - user not found', 'FAILURE');
      return false;
    }

    if (user.password && password && user.password !== password) {
      auditLogger.log('AUTH_LOGIN', email, 'Login failed - invalid password', 'FAILURE');
      return false;
    }

    setCurrentUser(user);
    auditLogger.log('AUTH_LOGIN', email, `Successful login for role ${user.role}`, 'SUCCESS', { userId: user.id });
    return true;
  };

  const register = async (email: string, password?: string, firstName?: string, lastName?: string): Promise<boolean> => {
    const users = mockDb.getUsers();
    const existing = users.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (existing) {
      auditLogger.log('AUTH_SIGNUP', email, 'Registration failed - email already exists', 'FAILURE');
      return false;
    }

    const newUser = mockDb.saveUser({
      firstName: firstName || email.split('@')[0],
      lastName: lastName || 'Member',
      email,
      password: password || 'Password123!',
      role: 'customer',
      status: 'active',
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
    });

    setCurrentUser(newUser);
    auditLogger.log('AUTH_SIGNUP', email, 'Successful account creation and authentication', 'SUCCESS', { userId: newUser.id });
    return true;
  };

  const logout = () => {
    if (currentUser) {
      auditLogger.log('AUTH_LOGIN', currentUser.email, 'User signed out', 'SUCCESS');
    }
    setCurrentUser(null);
    removeCookie(AUTH_COOKIE_KEY);
  };

  const updateProfile = (updated: Partial<User>) => {
    if (!currentUser) return;
    const user = mockDb.saveUser({ ...currentUser, ...updated });
    setCurrentUser(user);
    auditLogger.log('ADMIN_ACTION', currentUser.email, 'Updated personal profile details', 'SUCCESS');
  };

  const addAddress = (address: Omit<import('../types').UserAddress, 'id'>) => {
    if (!currentUser) return;
    const newAddress = {
      ...address,
      id: `addr_${Date.now()}`
    };
    const currentAddresses = currentUser.addresses || [];
    const updatedAddresses = newAddress.isDefault
      ? [...currentAddresses.map(a => ({ ...a, isDefault: false })), newAddress]
      : [...currentAddresses, newAddress];
    updateProfile({ addresses: updatedAddresses });
  };

  const removeAddress = (addressId: string) => {
    if (!currentUser) return;
    const currentAddresses = currentUser.addresses || [];
    const updatedAddresses = currentAddresses.filter(a => a.id !== addressId);
    updateProfile({ addresses: updatedAddresses });
  };

  const setDefaultAddress = (addressId: string) => {
    if (!currentUser) return;
    const currentAddresses = currentUser.addresses || [];
    const updatedAddresses = currentAddresses.map(a => ({
      ...a,
      isDefault: a.id === addressId
    }));
    updateProfile({ addresses: updatedAddresses });
  };

  const addSavedCard = (card: Omit<SavedPaymentCard, 'id' | 'createdAt'>) => {
    if (!currentUser) return;
    const newCard: SavedPaymentCard = {
      ...card,
      id: `card_${Date.now()}`,
      createdAt: new Date().toISOString()
    };
    const currentCards = currentUser.savedCards || [];
    const updatedCards = card.isDefault
      ? [...currentCards.map(c => ({ ...c, isDefault: false })), newCard]
      : [...currentCards, newCard];
    updateProfile({ savedCards: updatedCards });
  };

  const removeSavedCard = (cardId: string) => {
    if (!currentUser) return;
    const currentCards = currentUser.savedCards || [];
    const updatedCards = currentCards.filter(c => c.id !== cardId);
    updateProfile({ savedCards: updatedCards });
  };

  const switchRole = (newRole: UserRole) => {
    if (currentUser) {
      updateProfile({ role: newRole });
    } else {
      setCurrentUser({
        id: `user_${Date.now()}`,
        firstName: newRole === 'admin' ? 'Eleanor' : newRole === 'manager' ? 'Marcus' : 'Test',
        lastName: 'User',
        email: `${newRole}@purelis.com`,
        role: newRole,
        status: 'active',
        addresses: [],
        savedCards: []
      });
    }
  };

  const role = currentUser?.role || 'customer';
  const isAuthenticated = !!currentUser;
  const isAdmin = role === 'admin' || role === 'manager';
  const isStaff = role === 'admin' || role === 'manager' || role === 'staff';

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        role,
        isAuthenticated,
        isAdmin,
        isStaff,
        login,
        register,
        logout,
        updateProfile,
        addAddress,
        removeAddress,
        setDefaultAddress,
        addSavedCard,
        removeSavedCard,
        switchRole
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};
