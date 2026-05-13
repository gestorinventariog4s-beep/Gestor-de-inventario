import type { AppUser, AuthResponse, DeliveryResultResponse, Product, ProductPayload, StockAlert, UserRole } from '../types';

const STORAGE_KEY = 'gestion-dotacion-auth';
const API_BASE = (import.meta.env.VITE_API_URL ?? '').replace(/\/$/, '');

export const readSession = (): AuthResponse | null => {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw) as AuthResponse;
    if (parsed.token && parsed.username && parsed.role) return parsed;
  } catch {
    localStorage.removeItem(STORAGE_KEY);
  }
  return null;
};

export const parseApiError = (errorPayload: unknown, fallback: string): string => {
  if (!errorPayload || typeof errorPayload !== 'object') return fallback;
  const message = (errorPayload as { message?: unknown }).message;
  return typeof message === 'string' && message.trim() ? message : fallback;
};

export const authFetch = async <T>(path: string, session: AuthResponse | null, onLogout: () => void, options?: globalThis.RequestInit): Promise<T> => {
  if (!session) throw new Error('Sesión no disponible.');

  const headers = new Headers(options?.headers);
  headers.set('Authorization', `Bearer ${session.token}`);
  if (!headers.has('Content-Type') && options?.body) {
    headers.set('Content-Type', 'application/json');
  }

  const response = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers,
  });

  if (response.status === 401) {
    onLogout();
    throw new Error('Sesión expirada. Ingresa nuevamente.');
  }

  if (!response.ok) {
    const payload: unknown = await response.json().catch(() => null);
    throw new Error(parseApiError(payload, 'No se pudo completar la solicitud.'));
  }

  if (response.status === 204) return undefined as T;
  return response.json() as Promise<T>;
};

export const downloadFile = async (path: string, filename: string, session: AuthResponse | null) => {
  if (!session) return;
  const response = await fetch(`${API_BASE}${path}`, {
    headers: { Authorization: `Bearer ${session.token}` },
  });
  if (!response.ok) throw new Error('No se pudo descargar el archivo.');
  const blob = await response.blob();
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = filename;
  document.body.appendChild(anchor);
  anchor.click();
  document.body.removeChild(anchor);
  URL.revokeObjectURL(url);
};

export const login = async (username: string, password: string): Promise<AuthResponse> => {
  const response = await fetch(`${API_BASE}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password }),
  });

  if (!response.ok) {
    const payload: unknown = await response.json().catch(() => null);
    if (response.status === 401) throw new Error('Credenciales inválidas.');
    throw new Error(parseApiError(payload, 'No se pudo iniciar sesión.'));
  }

  const data = (await response.json()) as AuthResponse;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  return data;
};

export const publicFetch = async <T>(path: string, options?: globalThis.RequestInit): Promise<T> => {
  const headers = new Headers(options?.headers);
  if (!headers.has('Content-Type') && options?.body) {
    headers.set('Content-Type', 'application/json');
  }

  const response = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const payload: unknown = await response.json().catch(() => null);
    throw new Error(parseApiError(payload, 'No se pudo completar la solicitud.'));
  }

  if (response.status === 204) return undefined as T;
  return response.json() as Promise<T>;
};

export const fetchPublicProducts = () => publicFetch<Product[]>('/api/public/products');

export const fetchInventoryProducts = (session: AuthResponse | null, onLogout: () => void) =>
  authFetch<Product[]>('/api/inventory/products', session, onLogout);

export const fetchInventoryAlerts = (session: AuthResponse | null, onLogout: () => void) =>
  authFetch<StockAlert[]>('/api/inventory/alerts', session, onLogout);

export const createInventoryProduct = (
  payload: ProductPayload,
  session: AuthResponse | null,
  onLogout: () => void,
) =>
  authFetch<Product>('/api/inventory/products', session, onLogout, {
    method: 'POST',
    body: JSON.stringify(payload),
  });

export const updateInventoryProduct = (
  id: number,
  payload: ProductPayload,
  session: AuthResponse | null,
  onLogout: () => void,
) =>
  authFetch<Product>(`/api/inventory/products/${id}`, session, onLogout, {
    method: 'PUT',
    body: JSON.stringify(payload),
  });

export const deleteInventoryProduct = (id: number, session: AuthResponse | null, onLogout: () => void) =>
  authFetch<void>(`/api/inventory/products/${id}`, session, onLogout, {
    method: 'DELETE',
  });

export const confirmPublicQrDelivery = (payload: {
  qrToken: string;
  employeeFullName: string;
  employeeDocument: string;
  employeeEmail: string;
  employeeCargo: string;
  notes: string;
  items: Array<{ productId: number; quantity: number }>;
  signatureDataUrl: string;
  evidencePhotos?: string[];
  giverSignatureDataUrl?: string;
  giverFullName?: string;
}) => publicFetch<DeliveryResultResponse>('/api/public/deliveries/confirm', {
  method: 'POST',
  body: JSON.stringify(payload),
});

// Delivery Session Endpoints
export interface DeliverySession {
  id: number;
  employeeDocument: string;
  status: 'CREATED' | 'EVIDENCE_READY' | 'SIGNED' | 'COMPLETED' | 'ABANDONED';
  itemsJson: string;
  photosJson: string;
  giverSignature: string;
  receiverSignature: string;
  giverFullName: string;
}

export const startDeliverySession = (document: string) => 
  publicFetch<DeliverySession>('/api/public/delivery-sessions/start', {
    method: 'POST',
    body: JSON.stringify({ employeeDocument: document })
  });

export const getActiveDeliverySession = (document: string) => 
  publicFetch<DeliverySession>(`/api/public/delivery-sessions/active/${document}`);

export const updateSessionEvidence = (id: number, data: { itemsJson: string, photosJson: string, giverSignature: string, giverFullName: string }) => 
  publicFetch<DeliverySession>(`/api/public/delivery-sessions/${id}/evidence`, {
    method: 'PATCH',
    body: JSON.stringify(data)
  });

export const employeeSignSession = (id: number, signature: string) => 
  publicFetch<DeliverySession>(`/api/public/delivery-sessions/${id}/sign`, {
    method: 'PATCH',
    body: JSON.stringify({ signature })
  });

export const completeDeliverySession = (id: number) => 
  publicFetch<DeliverySession>(`/api/public/delivery-sessions/${id}/complete`, {
    method: 'POST'
  });

export const getActaData = (actaId: number, token: string) => 
  publicFetch<any>(`/api/public/acta/${actaId}?token=${token}`);

export const downloadPublicActa = async (actaId: number, qrToken: string) => {
  const response = await fetch(`${API_BASE}/api/public/acta/${actaId}/pdf?token=${encodeURIComponent(qrToken)}`);
  if (!response.ok) {
    const payload: unknown = await response.json().catch(() => null);
    throw new Error(parseApiError(payload, 'No se pudo descargar el acta.'));
  }

  const blob = await response.blob();
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = `acta-${actaId}.pdf`;
  document.body.appendChild(anchor);
  anchor.click();
  document.body.removeChild(anchor);
  URL.revokeObjectURL(url);
};

export const getEmployee = (document: string) => 
  publicFetch<EmployeeProfile>(`/api/public/employees/${document}`);

export const saveEmployee = (profile: EmployeeProfile) => 
  publicFetch<EmployeeProfile>('/api/public/employees', {
    method: 'POST',
    body: JSON.stringify(profile),
  });

export const getPendingDelivery = (document: string) => 
  publicFetch<any>(`/api/public/employees/${document}/pending`);

export const createPendingDelivery = (payload: { employeeDocument: string; items: Array<{ productId: number; quantity: number }> }, session: AuthResponse | null, onLogout: () => void) => 
  authFetch<any>('/api/deliveries/pending', session, onLogout, {
    method: 'POST',
    body: JSON.stringify(payload),
  });

export const listUsers = (session: AuthResponse | null, onLogout: () => void) =>
  authFetch<AppUser[]>('/api/admin/users', session, onLogout);

export const registerUser = (
  payload: { document: string; fullName: string; password: string; role: UserRole },
  session: AuthResponse | null,
  onLogout: () => void,
) =>
  authFetch<{ id: number; username: string; document: string; fullName: string; role: UserRole }>('/api/auth/register', session, onLogout, {
    method: 'POST',
    body: JSON.stringify(payload),
  });

export interface EmployeeProfile {
  fullName: string;
  document: string;
  email: string;
  cargo: string;
}
