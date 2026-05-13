import { useEffect, useState } from 'react';
import { Header } from './components/Header';
import { DashboardModule } from './modules/DashboardModule';
import { InventoryModule } from './modules/InventoryModule';
import { DeliveriesModule } from './modules/DeliveriesModule';
import { QrModule } from './modules/QrModule';
import { QrReceptionPortal } from './modules/QrReceptionPortal';
import { AuditModule } from './modules/AuditModule';
import { UsersModule } from './modules/UsersModule';
import { LoginModule } from './modules/LoginModule';
import { confirmPublicQrDelivery, downloadPublicActa, fetchPublicProducts, login, readSession } from './services/api';
import { 
  AuthResponse, 
  ModuleId, 
  Product, 
  AppUser
} from './types';

// Mock Data
const MOCK_PRODUCTS: Product[] = [
  {
    id: 1,
    name: 'Casco de Seguridad ABS',
    sku: 'EPI-001',
    type: 'EPP',
    talla: 'L',
    color: 'Amarillo',
    stock: 45,
    stockMinimo: 10,
    stockMaximo: 100,
    active: true,
    category: { id: 1, name: 'Proteccion' },
  },
  {
    id: 2,
    name: 'Guantes de Nitrilo',
    sku: 'EPI-002',
    type: 'EPP',
    talla: 'M',
    color: 'Negro',
    stock: 5,
    stockMinimo: 20,
    stockMaximo: 200,
    active: true,
    category: { id: 2, name: 'Manos' },
  },
];

const MOCK_USERS: AppUser[] = [
  { id: 1, username: 'admin', fullName: 'Administrador Sistema', role: 'ADMIN' },
  { id: 2, username: 'op01', fullName: 'Juan Pérez', role: 'OPERADOR' },
];

function App() {
  const getPublicReceptionState = () => {
    const hash = window.location.hash || '';
    if (!hash.startsWith('#/recepcion-dotacion')) {
      return { isPublicReception: false, token: '' };
    }

    const [, query = ''] = hash.split('?');
    const params = new URLSearchParams(query);
    return {
      isPublicReception: true,
      token: params.get('token') ?? '',
    };
  };

  const initialPublicReceptionState = getPublicReceptionState();

  const [isDarkMode, setIsDarkMode] = useState(false);
  const [session, setSession] = useState<AuthResponse | null>(() => readSession());
  const [activeModule, setActiveModule] = useState<ModuleId>('resumen');
  const [isLoading, setIsLoading] = useState(initialPublicReceptionState.isPublicReception);
  const [publicReceptionState, setPublicReceptionState] = useState(initialPublicReceptionState);
  const [publicProducts, setPublicProducts] = useState<Product[]>(MOCK_PRODUCTS);

  // Theme Sync
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  useEffect(() => {
    const syncRoute = () => {
      const nextState = getPublicReceptionState();
      setPublicReceptionState(nextState);
      if (nextState.isPublicReception) {
        setIsLoading(true);
      }
    };

    window.addEventListener('hashchange', syncRoute);
    return () => window.removeEventListener('hashchange', syncRoute);
  }, []);

  useEffect(() => {
    if (!publicReceptionState.isPublicReception) {
      return;
    }

    let isMounted = true;
    void fetchPublicProducts()
      .then((products) => {
        if (isMounted && products.length > 0) {
          setPublicProducts(products);
        }
      })
      .catch(() => {
        if (isMounted) {
          setPublicProducts(MOCK_PRODUCTS);
        }
      })
      .finally(() => {
        if (isMounted) {
          setIsLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [publicReceptionState.isPublicReception]);

  const handleLogin = async (credentials: { username: string; password: string }) => {
    setIsLoading(true);
    try {
      const authenticatedSession = await login(credentials.username, credentials.password);
      setSession(authenticatedSession);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('gestion-dotacion-auth');
    setSession(null);
  };

  const handleConfirmQrReception = async (payload: {
    qrToken: string;
    employeeFullName: string;
    employeeDocument: string;
    employeeEmail: string;
    employeeCargo: string;
    notes: string;
    items: Array<{ productId: number; quantity: number }>;
    signatureDataUrl: string;
  }) => {
    setIsLoading(true);
    try {
      const response = await confirmPublicQrDelivery(payload);
      return {
        actaId: response.actaId,
        actaNumber: response.actaNumber,
        employeeEmail: response.employeeEmail ?? payload.employeeEmail,
      };
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownloadActa = async (actaId: number) => {
    if (!publicReceptionState.token) {
      throw new Error('No hay token QR disponible para descargar el acta.');
    }

    await downloadPublicActa(actaId, publicReceptionState.token);
  };

  if (publicReceptionState.isPublicReception) {
    return (
      <QrReceptionPortal />
    );
  }

  if (!session) {
    return <LoginModule onLogin={handleLogin} isLoading={isLoading} isDarkMode={isDarkMode} toggleDarkMode={() => setIsDarkMode(!isDarkMode)} />;
  }

  return (
    <div className={`app-shell min-h-screen transition-all duration-500 ${isDarkMode ? 'dark bg-slate-950 text-slate-200' : 'bg-white text-blue-950'}`}>
      <Header 
        activeModule={activeModule} 
        setActiveModule={setActiveModule} 
        session={session} 
        onLogout={handleLogout} 
        isDarkMode={isDarkMode}
        toggleDarkMode={() => setIsDarkMode(!isDarkMode)}
      />

      <main className="max-w-[1700px] mx-auto px-4 md:px-8 pt-4">
        {activeModule === 'resumen' && (
          <DashboardModule 
            products={MOCK_PRODUCTS} 
            alerts={[]} 
            returns={[]} 
            users={MOCK_USERS} 
            demand={null} 
            realTimeData={[{ time: '10:00', value: 5 }, { time: '11:00', value: 12 }]}
          />
        )}
        {activeModule === 'inventario' && (
          <InventoryModule 
            products={MOCK_PRODUCTS} 
            alerts={[]} 
            onAddProduct={async () => {}} 
            onEditProduct={() => {}} 
            onDeleteProduct={async () => {}} 
            onBulkAddProducts={async () => {}}
            isLoading={false}
          />
        )}
        {activeModule === 'entregas' && (
          <DeliveriesModule 
            products={publicProducts} 
            onSubmitDelivery={async (payload) => {
               setIsLoading(true);
               try {
                  const response = await confirmPublicQrDelivery({
                    qrToken: 'DIRECT-ADMIN-' + Date.now(),
                    employeeFullName: payload.employeeFullName,
                    employeeDocument: payload.employeeDocument,
                    employeeEmail: payload.employeeEmail,
                    employeeCargo: payload.employeeCargo,
                    notes: payload.notes,
                    items: payload.items,
                    signatureDataUrl: payload.signatureDataUrl,
                    giverSignatureDataUrl: payload.giverSignatureDataUrl,
                    giverFullName: payload.giverFullName,
                    evidencePhotos: payload.evidencePhotos
                  });
                  return response;
               } finally {
                 setIsLoading(false);
               }
            }} 
            isLoading={isLoading}
          />
        )}
        {activeModule === 'qr' && (
          <QrModule
            products={MOCK_PRODUCTS}
            onConfirmReception={handleConfirmQrReception}
            onDownloadActa={handleDownloadActa}
            isLoading={isLoading}
          />
        )}
        {activeModule === 'auditoria' && (
          <AuditModule 
            auditLogs={[]} 
            auditFrom="" setAuditFrom={() => {}} 
            auditTo="" setAuditTo={() => {}} 
            onRefresh={async () => {}} 
            isLoading={false}
          />
        )}
        {activeModule === 'usuarios' && (
          <UsersModule 
            users={MOCK_USERS} 
            newUserForm={{username: '', password: '', fullName: '', role: 'OPERADOR'}} 
            setNewUserForm={() => {}} 
            onSubmitNewUser={async () => {}} 
            isLoading={false} 
          />
        )}
      </main>
    </div>
  );
}

export default App;
