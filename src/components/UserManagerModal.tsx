import React, { useState } from 'react';
import { useHelpCenter } from '../context/HelpCenterContext';
import { AdminUser } from '../utils/security';
import {
  Users,
  UserPlus,
  KeyRound,
  Shield,
  Trash2,
  X,
  Check,
  AlertCircle,
  Eye,
  EyeOff,
  UserCheck,
} from 'lucide-react';

export const UserManagerModal: React.FC = () => {
  const {
    isUserManagerModalOpen,
    closeUserManagerModal,
    adminUsers,
    currentAdminUser,
    updateUserPassword,
    addUser,
    removeUser,
  } = useHelpCenter();

  const [activeTab, setActiveTab] = useState<'list' | 'add' | 'password'>('list');

  // Add User Form State
  const [newName, setNewName] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newRole, setNewRole] = useState<AdminUser['role']>('admin');
  const [newPassword, setNewPassword] = useState('');
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [addError, setAddError] = useState<string | null>(null);
  const [addSuccess, setAddSuccess] = useState<string | null>(null);

  // Change Password Form State
  const [selectedUserId, setSelectedUserId] = useState<string>('');
  const [changePasswordValue, setChangePasswordValue] = useState('');
  const [confirmPasswordValue, setConfirmPasswordValue] = useState('');
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [passwordSuccess, setPasswordSuccess] = useState<string | null>(null);

  if (!isUserManagerModalOpen) return null;

  const handleAddUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setAddError(null);
    setAddSuccess(null);

    const res = await addUser({
      name: newName,
      email: newEmail,
      role: newRole,
      plainPassword: newPassword,
    });

    if (res.success) {
      setAddSuccess(`Usuario ${newEmail} creado con éxito.`);
      setNewName('');
      setNewEmail('');
      setNewPassword('');
      setTimeout(() => {
        setAddSuccess(null);
        setActiveTab('list');
      }, 1500);
    } else {
      setAddError(res.error || 'Error creando usuario.');
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError(null);
    setPasswordSuccess(null);

    if (changePasswordValue !== confirmPasswordValue) {
      setPasswordError('Las contraseñas no coinciden.');
      return;
    }

    const targetId = selectedUserId || currentAdminUser?.id || adminUsers[0]?.id;
    if (!targetId) {
      setPasswordError('Selecciona un usuario válido.');
      return;
    }

    const res = await updateUserPassword(targetId, changePasswordValue);
    if (res.success) {
      setPasswordSuccess('¡Contraseña actualizada con éxito en la base criptográfica!');
      setChangePasswordValue('');
      setConfirmPasswordValue('');
      setTimeout(() => {
        setPasswordSuccess(null);
        setActiveTab('list');
      }, 1500);
    } else {
      setPasswordError(res.error || 'Error actualizando contraseña.');
    }
  };

  const handleDeleteUser = (userId: string, email: string) => {
    if (window.confirm(`¿Seguro que deseas eliminar al usuario administrador ${email}?`)) {
      const res = removeUser(userId);
      if (!res.success) {
        alert(res.error || 'No se pudo eliminar el usuario.');
      }
    }
  };

  const openPasswordChangeFor = (userId: string) => {
    setSelectedUserId(userId);
    setActiveTab('password');
    setPasswordError(null);
    setPasswordSuccess(null);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white rounded-2xl max-w-2xl w-full p-6 shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#F0F6F9] text-[#123F55] border border-[#B8D6E3] flex items-center justify-center">
              <Users className="w-5 h-5 text-[#1A7B91]" />
            </div>
            <div>
              <h3 className="text-base font-bold text-[#123F55]">Gestión de Administradores</h3>
              <p className="text-xs text-slate-500">
                Usuarios con permisos para editar y gestionar el Centro de Ayuda
              </p>
            </div>
          </div>
          <button
            onClick={closeUserManagerModal}
            className="p-1 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-lg mt-4 text-xs font-semibold">
          <button
            onClick={() => setActiveTab('list')}
            className={`flex-1 py-1.5 px-3 rounded-md transition-all text-center flex items-center justify-center gap-1.5 ${
              activeTab === 'list'
                ? 'bg-white text-[#123F55] shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <UserCheck className="w-3.5 h-3.5" />
            <span>Usuarios ({adminUsers.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('add')}
            className={`flex-1 py-1.5 px-3 rounded-md transition-all text-center flex items-center justify-center gap-1.5 ${
              activeTab === 'add'
                ? 'bg-white text-[#123F55] shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <UserPlus className="w-3.5 h-3.5" />
            <span>+ Añadir Usuario</span>
          </button>
          <button
            onClick={() => {
              setSelectedUserId(currentAdminUser?.id || adminUsers[0]?.id || '');
              setActiveTab('password');
            }}
            className={`flex-1 py-1.5 px-3 rounded-md transition-all text-center flex items-center justify-center gap-1.5 ${
              activeTab === 'password'
                ? 'bg-white text-[#123F55] shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <KeyRound className="w-3.5 h-3.5" />
            <span>Cambiar Contraseña</span>
          </button>
        </div>

        {/* Tab Content */}
        <div className="overflow-y-auto flex-1 mt-4 pr-1">

          {/* LIST OF USERS */}
          {activeTab === 'list' && (
            <div className="space-y-3">
              <div className="p-3 bg-amber-50/80 border border-amber-200/80 rounded-xl text-xs text-amber-900">
                <span className="font-semibold">Seguridad Criptográfica:</span> Las contraseñas se almacenan como hashes SHA-256 unidireccionales y nunca en texto claro. Puedes agregar tantos administradores como necesites.
              </div>

              <div className="divide-y divide-slate-100 border border-slate-200 rounded-xl overflow-hidden bg-white">
                {adminUsers.map((user) => {
                  const isCurrent = currentAdminUser?.id === user.id || (!currentAdminUser && user.email === 'admin@sitecorp.local');
                  return (
                    <div
                      key={user.id}
                      className="p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-slate-50 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-[#123F55] text-white flex items-center justify-center font-bold text-xs uppercase shadow-xs">
                          {user.name.slice(0, 2)}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="text-xs sm:text-sm font-bold text-[#123F55]">{user.name}</h4>
                            {isCurrent && (
                              <span className="px-1.5 py-0.5 rounded text-[10px] font-semibold bg-emerald-100 text-emerald-800">
                                Sesión actual
                              </span>
                            )}
                            <span
                              className={`px-1.5 py-0.5 rounded text-[10px] font-semibold ${
                                user.role === 'superadmin'
                                  ? 'bg-[#F0F6F9] text-[#123F55] border border-[#B8D6E3]'
                                  : user.role === 'admin'
                                  ? 'bg-blue-50 text-blue-700'
                                  : 'bg-slate-100 text-slate-700'
                              }`}
                            >
                              {user.role}
                            </span>
                          </div>
                          <p className="text-xs text-slate-500 font-mono mt-0.5">{user.email}</p>
                          <p className="text-[10px] text-slate-400 mt-0.5">
                            Hash SHA-256: {user.passwordHash.slice(0, 16)}...
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 self-end sm:self-auto">
                        <button
                          onClick={() => openPasswordChangeFor(user.id)}
                          className="px-2.5 py-1.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors flex items-center gap-1"
                          title="Cambiar contraseña de este usuario"
                        >
                          <KeyRound className="w-3.5 h-3.5 text-[#1A7B91]" />
                          <span>Clave</span>
                        </button>
                        <button
                          onClick={() => handleDeleteUser(user.id, user.email)}
                          disabled={user.role === 'superadmin' && adminUsers.filter(u => u.role === 'superadmin').length <= 1}
                          className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition-colors disabled:opacity-30 disabled:hover:bg-transparent"
                          title={
                            user.role === 'superadmin' && adminUsers.filter(u => u.role === 'superadmin').length <= 1
                              ? 'No puedes eliminar el único superadmin'
                              : 'Eliminar usuario'
                          }
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* ADD USER FORM */}
          {activeTab === 'add' && (
            <form onSubmit={handleAddUser} className="space-y-4">
              <div className="p-3 bg-[#F0F6F9] border border-[#B8D6E3] rounded-xl text-xs text-slate-700 leading-relaxed">
                <p className="font-semibold text-[#123F55] mb-1">
                  Alta de nuevo usuario administrador
                </p>
                <p>
                  El nuevo usuario podrá acceder inmediatamente desde el botón &quot;Modo Admin&quot; utilizando su correo y la contraseña indicada.
                </p>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Nombre Completo
                </label>
                <input
                  type="text"
                  required
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder="Ej: Laura Gómez / Soporte SiteCorp"
                  className="w-full px-3 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:bg-white focus:border-[#1A7B91]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Correo Electrónico
                </label>
                <input
                  type="email"
                  required
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                  placeholder="Ej: soporte@sitecorp.cu o usuario@sitecorp.local"
                  className="w-full px-3 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:bg-white focus:border-[#1A7B91]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Rol y Permisos
                </label>
                <select
                  value={newRole}
                  onChange={(e) => setNewRole(e.target.value as AdminUser['role'])}
                  className="w-full px-3 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:bg-white focus:border-[#1A7B91]"
                >
                  <option value="superadmin">Superadmin (Acceso total y gestión de usuarios)</option>
                  <option value="admin">Administrador (Crear y editar apartados y guías)</option>
                  <option value="editor">Editor (Editar guías existentes)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Contraseña Inicial
                </label>
                <div className="relative">
                  <input
                    type={showNewPassword ? 'text' : 'password'}
                    required
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Mínimo 4 caracteres..."
                    className="w-full pl-3 pr-9 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:bg-white focus:border-[#1A7B91]"
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1"
                  >
                    {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {addError && (
                <div className="p-2.5 bg-rose-50 border border-rose-200 text-rose-700 rounded-lg text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{addError}</span>
                </div>
              )}

              {addSuccess && (
                <div className="p-2.5 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-lg text-xs flex items-center gap-2">
                  <Check className="w-4 h-4 shrink-0" />
                  <span>{addSuccess}</span>
                </div>
              )}

              <button
                type="submit"
                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-[#123F55] hover:bg-[#0F3447] text-white rounded-lg text-xs font-semibold shadow-xs transition-colors"
              >
                <UserPlus className="w-4 h-4 text-[#F49D37]" />
                <span>Registrar Usuario Administrador</span>
              </button>
            </form>
          )}

          {/* CHANGE PASSWORD FORM */}
          {activeTab === 'password' && (
            <form onSubmit={handleChangePassword} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Seleccionar Usuario para Actualizar Clave
                </label>
                <select
                  value={selectedUserId || currentAdminUser?.id || adminUsers[0]?.id || ''}
                  onChange={(e) => setSelectedUserId(e.target.value)}
                  className="w-full px-3 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:bg-white focus:border-[#1A7B91]"
                >
                  {adminUsers.map((u) => (
                    <option key={u.id} value={u.id}>
                      {u.name} ({u.email}) — [{u.role}]
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Nueva Contraseña
                </label>
                <div className="relative">
                  <input
                    type={showChangePassword ? 'text' : 'password'}
                    required
                    value={changePasswordValue}
                    onChange={(e) => setChangePasswordValue(e.target.value)}
                    placeholder="Escribe la nueva contraseña..."
                    className="w-full pl-3 pr-9 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:bg-white focus:border-[#1A7B91]"
                  />
                  <button
                    type="button"
                    onClick={() => setShowChangePassword(!showChangePassword)}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1"
                  >
                    {showChangePassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Confirmar Nueva Contraseña
                </label>
                <input
                  type={showChangePassword ? 'text' : 'password'}
                  required
                  value={confirmPasswordValue}
                  onChange={(e) => setConfirmPasswordValue(e.target.value)}
                  placeholder="Repite la nueva contraseña..."
                  className="w-full px-3 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:bg-white focus:border-[#1A7B91]"
                />
              </div>

              {passwordError && (
                <div className="p-2.5 bg-rose-50 border border-rose-200 text-rose-700 rounded-lg text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{passwordError}</span>
                </div>
              )}

              {passwordSuccess && (
                <div className="p-2.5 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-lg text-xs flex items-center gap-2">
                  <Check className="w-4 h-4 shrink-0" />
                  <span>{passwordSuccess}</span>
                </div>
              )}

              <button
                type="submit"
                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-[#123F55] hover:bg-[#0F3447] text-white rounded-lg text-xs font-semibold shadow-xs transition-colors"
              >
                <KeyRound className="w-4 h-4 text-[#F49D37]" />
                <span>Actualizar Contraseña Criptográfica</span>
              </button>
            </form>
          )}

        </div>

      </div>
    </div>
  );
};
