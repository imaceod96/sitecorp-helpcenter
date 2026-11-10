/**
 * Utilidades para la autenticación segura mediante Enlace Firmado Temporal
 * entre app.sitecorp.cu y el Centro de Ayuda (SiteCorp Help Center).
 */

// Clave compartida por defecto (puede sobreescribirse mediante variable de entorno o configuración)
export const DEFAULT_SHARED_SECRET = 'sitecorp_superadmin_secret_key_2026';

export interface SignedAuthPayload {
  role: 'superadmin' | 'admin';
  email: string;
  exp: number; // Timestamp en milisegundos de expiración
  iat: number; // Timestamp de emisión
}

/**
 * Calcula un hash HMAC-SHA256 simple y seguro en el navegador
 */
async function generateHmacSha256(message: string, secret: string): Promise<string> {
  const enc = new TextEncoder();
  const key = await crypto.subtle.importKey(
    'raw',
    enc.encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  );
  const signature = await crypto.subtle.sign('HMAC', key, enc.encode(message));
  return Array.from(new Uint8Array(signature))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
}

/**
 * Genera la URL con token temporal firmado (útil tanto para pruebas como para copiar el código a SiteCorp_all)
 */
export async function createSignedAdminUrl(
  baseUrl: string,
  email = 'superadmin@sitecorp.cu',
  ttlMinutes = 15,
  secret = DEFAULT_SHARED_SECRET
): Promise<string> {
  const now = Date.now();
  const payload: SignedAuthPayload = {
    role: 'superadmin',
    email,
    iat: now,
    exp: now + ttlMinutes * 60 * 1000,
  };

  const payloadBase64 = btoa(JSON.stringify(payload));
  const signature = await generateHmacSha256(payloadBase64, secret);

  const url = new URL(baseUrl, window.location.origin);
  url.searchParams.set('auth_token', payloadBase64);
  url.searchParams.set('sig', signature);

  return url.toString();
}

/**
 * Verifica un token temporal recibido en los parámetros de la URL
 */
export async function verifySignedToken(
  tokenBase64: string,
  signature: string,
  secret = DEFAULT_SHARED_SECRET
): Promise<{ valid: boolean; email?: string; error?: string }> {
  try {
    const jsonStr = atob(tokenBase64);
    const payload: SignedAuthPayload = JSON.parse(jsonStr);

    // 1. Verificar si ha expirado
    const now = Date.now();
    if (now > payload.exp) {
      return { valid: false, error: 'El enlace de acceso temporal ha expirado.' };
    }

    // 2. Verificar el rol
    if (payload.role !== 'superadmin' && payload.role !== 'admin') {
      return { valid: false, error: 'El rol especificado no cuenta con permisos de administración.' };
    }

    // 3. Verificar firma HMAC
    const expectedSignature = await generateHmacSha256(tokenBase64, secret);
    if (signature !== expectedSignature) {
      // También permitimos firmas directas para facilitar pruebas locales si la clave coincide
      return { valid: false, error: 'Firma de autenticación inválida o alterada.' };
    }

    return { valid: true, email: payload.email };
  } catch {
    return { valid: false, error: 'Token con formato inválido.' };
  }
}
