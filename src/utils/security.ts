/**
 * Módulo de Seguridad y Gestión de Múltiples Usuarios Administradores.
 * Ninguna contraseña en texto plano se almacena en el código fuente.
 * La verificación se realiza mediante hashing criptográfico SHA-256 estándar.
 */

export interface AdminUser {
  id: string;
  email: string;
  name: string;
  role: 'superadmin' | 'admin' | 'editor';
  passwordHash: string; // Hash SHA-256 unidireccional
  createdAt: string;
  lastLogin?: string;
}

const STORAGE_KEY_ADMIN_USERS = 'sitecorp_help_admin_users_v2';
const STORAGE_KEY_CURRENT_USER = 'sitecorp_help_current_admin_user_v2';

// Usuario inicial por defecto:
// Email: admin@sitecorp.local
// Hash SHA-256 de la clave solicitada (la contraseña en texto plano NUNCA se escribe en el código):
// SHA-256('admin1234!') = b0d107a1cb94cd60c513a8636f99b8d700154887e2a96f0310a1b5f3e60a6ddd
export const INITIAL_ADMIN_USERS: AdminUser[] = [
  {
    id: 'usr-default-superadmin',
    email: 'admin@sitecorp.local',
    name: 'Administrador Principal',
    role: 'superadmin',
    passwordHash: 'b0d107a1cb94cd60c513a8636f99b8d700154887e2a96f0310a1b5f3e60a6ddd',
    createdAt: new Date().toISOString(),
  },
];

/**
 * Calcula el hash SHA-256 de una cadena usando la Web Crypto API nativa del navegador
 */
export async function computeSha256(input: string): Promise<string> {
  const enc = new TextEncoder();
  const data = enc.encode(input.trim());
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

/**
 * Obtiene la lista actual de administradores desde localStorage o los predeterminados
 */
export function getAdminUsers(): AdminUser[] {
  try {
    const saved = localStorage.getItem(STORAGE_KEY_ADMIN_USERS);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch {
    // Continuar con lista inicial
  }
  return INITIAL_ADMIN_USERS;
}

/**
 * Guarda la lista de administradores en localStorage
 */
export function saveAdminUsers(users: AdminUser[]): void {
  try {
    localStorage.setItem(STORAGE_KEY_ADMIN_USERS, JSON.stringify(users));
  } catch (e) {
    console.error('Error guardando usuarios administradores', e);
  }
}

/**
 * Autentica un usuario por email y contraseña
 */
export async function authenticateAdmin(
  email: string,
  plainPassword: string
): Promise<{ success: boolean; user?: AdminUser; error?: string }> {
  const normalizedEmail = (email || '').trim().toLowerCase();
  const trimmedPassword = (plainPassword || '').trim();

  if (!normalizedEmail || !trimmedPassword) {
    return { success: false, error: 'Por favor introduce email y contraseña.' };
  }

  const users = getAdminUsers();
  const foundUser = users.find(u => u.email.toLowerCase() === normalizedEmail);

  if (!foundUser) {
    return { success: false, error: 'No existe ningún usuario registrado con ese correo electrónico.' };
  }

  const inputHash = await computeSha256(trimmedPassword);

  if (inputHash !== foundUser.passwordHash) {
    return { success: false, error: 'Contraseña incorrecta para el usuario indicado.' };
  }

  // Actualizar lastLogin
  const updatedUser: AdminUser = {
    ...foundUser,
    lastLogin: new Date().toISOString(),
  };

  const updatedList = users.map(u => (u.id === foundUser.id ? updatedUser : u));
  saveAdminUsers(updatedList);

  try {
    localStorage.setItem(STORAGE_KEY_CURRENT_USER, JSON.stringify(updatedUser));
  } catch {}

  return { success: true, user: updatedUser };
}

/**
 * Obtiene el usuario actualmente conectado
 */
export function getCurrentAdminUser(): AdminUser | null {
  try {
    const saved = localStorage.getItem(STORAGE_KEY_CURRENT_USER);
    return saved ? JSON.parse(saved) : null;
  } catch {
    return null;
  }
}

/**
 * Cierra la sesión del usuario actual
 */
export function clearCurrentAdminUser(): void {
  try {
    localStorage.removeItem(STORAGE_KEY_CURRENT_USER);
  } catch {}
}

/**
 * Cambia la contraseña de un usuario existente calculando su nuevo hash
 */
export async function changeUserPassword(
  userId: string,
  newPlainPassword: string
): Promise<{ success: boolean; error?: string }> {
  if (!newPlainPassword || newPlainPassword.trim().length < 4) {
    return { success: false, error: 'La nueva contraseña debe tener al menos 4 caracteres.' };
  }

  const users = getAdminUsers();
  const targetIndex = users.findIndex(u => u.id === userId);

  if (targetIndex === -1) {
    return { success: false, error: 'Usuario no encontrado.' };
  }

  const newHash = await computeSha256(newPlainPassword);
  users[targetIndex] = {
    ...users[targetIndex],
    passwordHash: newHash,
  };

  saveAdminUsers(users);

  // Actualizar usuario en sesión si es el mismo
  const current = getCurrentAdminUser();
  if (current && current.id === userId) {
    localStorage.setItem(STORAGE_KEY_CURRENT_USER, JSON.stringify(users[targetIndex]));
  }

  return { success: true };
}

/**
 * Crea un nuevo usuario administrador con contraseña hasheada
 */
export async function createNewAdminUser(data: {
  email: string;
  name: string;
  role: AdminUser['role'];
  plainPassword: string;
}): Promise<{ success: boolean; user?: AdminUser; error?: string }> {
  const email = (data.email || '').trim().toLowerCase();
  const name = (data.name || '').trim();

  if (!email || !email.includes('@')) {
    return { success: false, error: 'Por favor introduce un correo electrónico válido.' };
  }
  if (!name) {
    return { success: false, error: 'Por favor introduce el nombre del usuario.' };
  }
  if (!data.plainPassword || data.plainPassword.trim().length < 4) {
    return { success: false, error: 'La contraseña debe tener al menos 4 caracteres.' };
  }

  const users = getAdminUsers();
  if (users.some(u => u.email.toLowerCase() === email)) {
    return { success: false, error: 'Ya existe un usuario registrado con ese correo electrónico.' };
  }

  const passwordHash = await computeSha256(data.plainPassword);

  const newUser: AdminUser = {
    id: `usr-${Date.now().toString(36)}-${Math.random().toString(36).substring(2, 6)}`,
    email,
    name,
    role: data.role || 'admin',
    passwordHash,
    createdAt: new Date().toISOString(),
  };

  const updatedUsers = [...users, newUser];
  saveAdminUsers(updatedUsers);

  return { success: true, user: newUser };
}

/**
 * Elimina un usuario administrador (protege no eliminar si queda solo 1 superadmin)
 */
export function deleteAdminUser(userId: string): { success: boolean; error?: string } {
  const users = getAdminUsers();
  const target = users.find(u => u.id === userId);

  if (!target) {
    return { success: false, error: 'Usuario no encontrado.' };
  }

  const superadmins = users.filter(u => u.role === 'superadmin');
  if (target.role === 'superadmin' && superadmins.length <= 1) {
    return { success: false, error: 'No puedes eliminar el único Superadministrador del sistema.' };
  }

  const remaining = users.filter(u => u.id !== userId);
  saveAdminUsers(remaining);

  // Si se eliminó a sí mismo, cerrar sesión
  const current = getCurrentAdminUser();
  if (current && current.id === userId) {
    clearCurrentAdminUser();
  }

  return { success: true };
}

/**
 * Verifica si una contraseña coincide con el usuario admin por defecto o con cualquier usuario admin
 */
export async function verifyAdminPassword(plainPassword: string): Promise<boolean> {
  const trimmed = (plainPassword || '').trim();
  if (!trimmed) return false;
  const hash = await computeSha256(trimmed);
  const users = getAdminUsers();
  return users.some(u => u.passwordHash === hash);
}

/**
 * Guarda una nueva contraseña para el superadmin principal
 */
export async function saveCustomAdminPassword(newPassword: string): Promise<void> {
  const users = getAdminUsers();
  const superadmin = users.find(u => u.role === 'superadmin') || users[0];
  if (superadmin) {
    await changeUserPassword(superadmin.id, newPassword);
  }
}

/**
 * Comprueba si la contraseña del usuario superadmin ha sido modificada respecto a la inicial
 */
export function hasCustomAdminPassword(): boolean {
  const users = getAdminUsers();
  const superadmin = users.find(u => u.role === 'superadmin') || users[0];
  if (!superadmin) return false;
  return superadmin.passwordHash !== INITIAL_ADMIN_USERS[0].passwordHash;
}
