import React, { useState, useEffect } from 'react';
import { Users, Search, Shield, Mail, Phone, Calendar, ShoppingBag } from 'lucide-react';
import { User, UserRole } from '../../types';
import { api } from '../../services/api';
import { useToast } from '../../context/ToastContext';

export const AdminCustomers: React.FC = () => {
  const { showToast } = useToast();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    setLoading(true);
    try {
      const data = await api.getUsers();
      setUsers(data);
    } finally {
      setLoading(false);
    }
  };

  const handleRoleChange = async (userId: string, newRole: UserRole, userName: string) => {
    await api.updateUserRole(userId, newRole);
    showToast('Role Updated', `${userName}'s role changed to ${newRole.toUpperCase()}.`, 'success');
    loadUsers();
  };

  const filteredUsers = users.filter((u) => {
    if (search.trim()) {
      const q = search.toLowerCase();
      return (
        u.firstName.toLowerCase().includes(q) ||
        u.lastName.toLowerCase().includes(q) ||
        u.email.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-serif font-bold text-[#1C3829]">Customers & Team Roles</h2>
          <p className="text-xs text-[#5E6E64]">Manage registered customers, loyalty profiles, and staff RBAC roles.</p>
        </div>
      </div>

      {/* Search Filter */}
      <div className="bg-white p-4 rounded-xl border border-[#EAE5DA] shadow-2xs">
        <div className="relative max-w-sm">
          <Search className="w-4 h-4 text-[#8DA792] absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name or email address..."
            className="w-full pl-9 pr-3 py-1.5 text-xs rounded-lg border border-[#DDD5C7] bg-[#FAF8F5]"
          />
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-2xl border border-[#EAE5DA] shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#FAF8F5] border-b border-[#ECE7DE] text-[#7A8A7F] uppercase tracking-wider font-bold">
              <tr>
                <th className="py-3 px-4">Client Name</th>
                <th className="py-3 px-4">Email</th>
                <th className="py-3 px-4">Joined Date</th>
                <th className="py-3 px-4">Saved Addresses</th>
                <th className="py-3 px-4">RBAC Role</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#ECE7DE]">
              {loading ? (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-xs text-[#7A8A7F]">
                    Loading user accounts...
                  </td>
                </tr>
              ) : filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-xs text-[#7A8A7F]">
                    No accounts found.
                  </td>
                </tr>
              ) : (
                filteredUsers.map((u) => (
                  <tr key={u.id} className="hover:bg-[#FAF8F5]/80 transition-colors">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-[#1C3829] text-white text-xs font-bold flex items-center justify-center font-serif">
                          {u.firstName[0]}{u.lastName[0]}
                        </div>
                        <span className="font-bold text-[#1C3829]">
                          {u.firstName} {u.lastName}
                        </span>
                      </div>
                    </td>

                    <td className="py-3 px-4 text-[#5E6E64]">
                      {u.email}
                    </td>

                    <td className="py-3 px-4 text-[#5E6E64]">
                      {new Date(u.createdAt).toLocaleDateString()}
                    </td>

                    <td className="py-3 px-4 text-[#5E6E64]">
                      {u.addresses?.length || 0} saved
                    </td>

                    <td className="py-3 px-4">
                      <select
                        value={u.role}
                        onChange={(e) => handleRoleChange(u.id, e.target.value as UserRole, `${u.firstName} ${u.lastName}`)}
                        className={`text-xs font-bold uppercase py-1 px-2.5 rounded-lg border cursor-pointer ${
                          u.role === 'admin'
                            ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                            : u.role === 'manager'
                            ? 'bg-blue-50 text-blue-800 border-blue-300'
                            : u.role === 'staff'
                            ? 'bg-amber-50 text-amber-800 border-amber-300'
                            : 'bg-stone-50 text-stone-700 border-stone-300'
                        }`}
                      >
                        <option value="customer">Customer</option>
                        <option value="staff">Staff</option>
                        <option value="manager">Manager</option>
                        <option value="admin">Super Admin</option>
                      </select>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
