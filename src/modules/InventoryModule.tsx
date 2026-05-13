import React, { useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import {
  AlertTriangle,
  Clock,
  Edit3,
  FileSpreadsheet,
  Filter,
  ImagePlus,
  LayoutGrid,
  List,
  Package,
  Plus,
  Search,
  Trash2,
  TrendingUp,
  X,
} from 'lucide-react';
import { Product, ProductPayload, StockAlert } from '../types';

interface InventoryManagerProps {
  products: Product[];
  alerts: StockAlert[];
  onAddProduct: (p: ProductPayload) => Promise<void>;
  onEditProduct: (id: number, p: ProductPayload) => Promise<void>;
  onDeleteProduct: (id: number) => Promise<void>;
  onBulkAddProducts: (products: ProductPayload[]) => Promise<void>;
  isLoading: boolean;
}

const EMPTY_FORM: ProductPayload = {
  sku: '',
  name: '',
  type: '',
  talla: '',
  color: '',
  photoUrl: '',
  stock: 1,
  stockMinimo: 1,
  stockMaximo: 2,
  categoryName: '',
  categoryDescription: '',
};

export const InventoryModule: React.FC<InventoryManagerProps> = ({
  products,
  alerts,
  onAddProduct,
  onEditProduct,
  onDeleteProduct,
  onBulkAddProducts,
  isLoading
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [viewMode, setViewMode] = useState<'table' | 'grid'>('grid');
  const [editorOpen, setEditorOpen] = useState(false);
  const [editingProductId, setEditingProductId] = useState<number | null>(null);
  const [form, setForm] = useState<ProductPayload>(EMPTY_FORM);

  const parseSizes = (value?: string) => {
    if (!value) return [];
    return value
      .split(/[,/|-]/)
      .map((size) => size.trim())
      .filter((size) => size.length > 0);
  };

  const getLevel = (product: Product) => {
    if (product.stock <= 0) {
      return { label: 'Critico', color: 'text-rose-600', bar: 'bg-rose-500', marks: 0 };
    }
    if (product.stock <= product.stockMinimo) {
      return { label: 'Bajo', color: 'text-amber-600', bar: 'bg-amber-500', marks: 2 };
    }
    const marks = product.stock >= product.stockMaximo ? 5 : Math.max(3, Math.ceil((product.stock / product.stockMaximo) * 5));
    return { label: 'Optimo', color: 'text-emerald-600', bar: 'bg-emerald-500', marks };
  };

  const openCreateEditor = () => {
    setEditingProductId(null);
    setForm(EMPTY_FORM);
    setEditorOpen(true);
  };

  const openEditEditor = (product: Product) => {
    setEditingProductId(product.id);
    setForm({
      sku: product.sku,
      name: product.name,
      type: product.type,
      talla: product.talla ?? '',
      color: product.color ?? '',
      photoUrl: product.photoUrl ?? '',
      stock: product.stock,
      stockMinimo: product.stockMinimo,
      stockMaximo: product.stockMaximo,
      categoryName: product.category?.name ?? 'General',
      categoryDescription: product.category?.description ?? '',
    });
    setEditorOpen(true);
  };

  const closeEditor = () => {
    setEditorOpen(false);
    setEditingProductId(null);
    setForm(EMPTY_FORM);
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      const result = typeof reader.result === 'string' ? reader.result : '';
      setForm((prev) => ({ ...prev, photoUrl: result }));
    };
    reader.readAsDataURL(file);
  };

  const handleSaveProduct = async () => {
    if (!form.sku.trim() || !form.name.trim() || !form.type.trim() || !form.categoryName.trim()) {
      return;
    }

    if (form.stockMinimo >= form.stockMaximo || form.stock < form.stockMinimo || form.stock > form.stockMaximo) {
      return;
    }

    if (editingProductId == null) {
      await onAddProduct(form);
    } else {
      await onEditProduct(editingProductId, form);
    }
    closeEditor();
  };

  const categories = useMemo(() =>
    Array.from(new Set(products.map(p => p.category?.name))).filter(Boolean)
    , [products]);

  const filteredProducts = useMemo(() => {
    return products.filter(p => {
      const name = p.name || '';
      const sku = p.sku || '';
      const matchesSearch = name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        sku.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCat = filterCategory === 'all' || (p.category?.name === filterCategory);
      return matchesSearch && matchesCat;
    });
  }, [products, searchTerm, filterCategory]);

  return (
    <div className="space-y-6 pb-10 animate-fade">

      {/* Header Section - COMPACT & BLUE CONTRAST */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

        {/* Banner de Inventario */}
        <div className="lg:col-span-8 bg-blue-600 dark:bg-black/40 rounded-[2.5rem] p-8 text-white relative overflow-hidden flex flex-col justify-between min-h-[350px] shadow-xl border border-blue-500 dark:border-white/5">
          <div className="absolute -top-10 -right-10 opacity-10 pointer-events-none text-white">
            <Package size={250} />
          </div>

          <div className="relative z-10 space-y-4">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/20 px-4 py-1.5 rounded-xl">
              <TrendingUp size={14} className="text-white" />
              <span className="text-[9px] font-black uppercase tracking-[0.2em]">Auditoría de Activos</span>
            </div>

            <h1 className="text-5xl font-black tracking-tighter leading-none">
              Control de <br /> <span className="text-blue-100 dark:text-blue-500">Inventario</span>
            </h1>

            <p className="text-blue-50 max-w-md text-sm font-medium leading-relaxed opacity-80">
              Gestión profesional de activos y dotación industrial con control de stock inteligente.
            </p>
          </div>

          <div className="flex flex-wrap gap-3 relative z-10 mt-6">
            <button
              onClick={openCreateEditor}
              disabled={isLoading}
              className="bg-white text-blue-700 hover:bg-blue-50 px-8 py-4 rounded-[1.5rem] font-black text-[10px] uppercase tracking-widest flex items-center gap-2 transition-all shadow-md active:scale-95"
            >
              <Plus size={16} strokeWidth={3} /> Nuevo Producto
            </button>
            <button
              onClick={() => void onBulkAddProducts([])}
              disabled={isLoading}
              className="bg-blue-800/40 hover:bg-blue-800/60 backdrop-blur-md text-white px-8 py-4 rounded-[1.5rem] font-black text-[10px] uppercase tracking-widest flex items-center gap-2 transition-all active:scale-95 border border-white/10"
            >
              <FileSpreadsheet size={16} /> Carga Masiva
            </button>
          </div>
        </div>

        {/* Métricas de Stock (Isla Derecha) */}
        <div className="lg:col-span-4 grid grid-rows-2 gap-6">
          <div className="bg-white dark:bg-white/5 border border-blue-100 dark:border-white/10 rounded-[2.5rem] p-8 flex flex-col justify-center shadow-sm relative overflow-hidden group">
            <div className="absolute -right-6 -top-6 text-blue-600 opacity-5 group-hover:scale-110 transition-transform"><Package size={140} /></div>
            <p className="text-[9px] font-black text-blue-500 dark:text-slate-400 uppercase tracking-[0.2em] mb-2">Existencias Totales</p>
            <h3 className="text-5xl font-black text-blue-900 dark:text-white leading-none tracking-tighter">
              {products.reduce((acc, p) => acc + (p.stock || 0), 0).toLocaleString()}
            </h3>
            <div className="flex items-center gap-2 mt-4 text-emerald-600 font-black text-[9px] uppercase tracking-widest bg-emerald-50 dark:bg-emerald-500/10 px-3 py-1.5 rounded-lg w-fit border border-emerald-100 dark:border-emerald-500/20">
              <Clock size={12} /> SINCRO OK
            </div>
          </div>

          <div className="bg-rose-50 border border-rose-100 dark:bg-rose-500/10 dark:border-rose-500/20 rounded-[2.5rem] p-8 flex flex-col justify-center shadow-sm relative overflow-hidden">
            <div className="absolute -right-6 -bottom-6 text-rose-500 opacity-10"><AlertTriangle size={140} /></div>
            <p className="text-[9px] font-black text-rose-600 uppercase tracking-[0.2em] mb-2">Alertas Críticas</p>
            <h3 className="text-5xl font-black text-rose-700 dark:text-rose-600 leading-none tracking-tighter">
              {alerts.length || products.filter(p => p.stock <= p.stockMinimo).length}
            </h3>
            <p className="text-[9px] font-bold mt-2 text-rose-600/60 uppercase tracking-widest">Nivel Critico</p>
          </div>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="bg-white dark:bg-white/5 border border-blue-100 dark:border-white/10 rounded-[2rem] p-3 flex flex-wrap items-center gap-3 shadow-sm">
        <div className="flex-1 min-w-[250px] relative group">
          <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-blue-600" size={18} />
          <input
            className="w-full bg-blue-50/50 dark:bg-white/5 border-none rounded-xl py-4 pl-12 pr-4 text-sm font-bold text-blue-900 dark:text-white placeholder:text-blue-300 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all"
            placeholder="Buscar por SKU o nombre..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-2 bg-blue-50/50 dark:bg-white/5 p-1.5 rounded-xl border border-blue-100 dark:border-white/5">
          <Filter size={14} className="text-blue-600 ml-2" />
          <select
            className="bg-transparent border-none text-[9px] font-black text-blue-900 dark:text-slate-300 uppercase tracking-widest focus:ring-0 cursor-pointer pr-8"
            value={filterCategory} onChange={(e) => setFilterCategory(e.target.value)}
          >
            <option value="all">CATEGORÍAS</option>
            {categories.map(c => <option key={c} value={c}>{c?.toUpperCase()}</option>)}
          </select>
        </div>
        <div className="flex bg-blue-50/50 dark:bg-white/5 p-1 rounded-xl border border-blue-100 dark:border-white/5">
          <button onClick={() => setViewMode('table')} className={`p-2 rounded-lg transition-all ${viewMode === 'table' ? 'bg-white dark:bg-blue-600 text-blue-600 dark:text-white shadow-sm' : 'text-blue-400'}`}><List size={16} /></button>
          <button onClick={() => setViewMode('grid')} className={`p-2 rounded-lg transition-all ${viewMode === 'grid' ? 'bg-white dark:bg-blue-600 text-blue-600 dark:text-white shadow-sm' : 'text-blue-400'}`}><LayoutGrid size={16} /></button>
        </div>
      </div>

      {/* Main Content Area */}
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filteredProducts.map((p) => {
            const level = getLevel(p);
            const stockPercentage = Math.min((p.stock / p.stockMaximo) * 100, 100);
            const sizes = parseSizes(p.talla);

            return (
              <motion.article
                key={p.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white dark:bg-white/5 border border-blue-100 dark:border-white/10 rounded-[1.8rem] p-5 shadow-sm"
              >
                <div className="flex items-start justify-between gap-3 mb-4">
                  <div className="min-w-0 flex items-center gap-3">
                    <div className="w-14 h-14 rounded-xl bg-blue-50 dark:bg-white/10 border border-blue-100 dark:border-white/10 overflow-hidden flex items-center justify-center shrink-0">
                      {p.photoUrl ? (
                        <img src={p.photoUrl} alt={p.name} className="w-full h-full object-cover" />
                      ) : (
                        <Package size={20} className="text-blue-400" />
                      )}
                    </div>
                    <div className="min-w-0">
                    <p className="font-black text-blue-950 dark:text-white text-sm truncate">{p.name}</p>
                    <p className="text-[9px] font-black text-blue-500 uppercase tracking-widest">{p.sku}</p>
                    </div>
                  </div>
                  <span className="bg-blue-50 dark:bg-white/10 text-blue-600 dark:text-slate-400 text-[8px] font-black px-3 py-1.5 rounded-lg uppercase tracking-widest border border-blue-100 dark:border-white/5">
                    {p.category?.name || 'GENERAL'}
                  </span>
                </div>

                <div className="space-y-2 mb-4">
                  <p className="text-[9px] font-black uppercase tracking-widest text-slate-400">Tallas</p>
                  <div className="flex flex-wrap gap-2">
                    {sizes.length > 0 ? (
                      sizes.map((size) => (
                        <span
                          key={`${p.id}-${size}`}
                          className="px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest bg-blue-600/10 text-blue-700 dark:text-blue-300 border border-blue-600/20"
                        >
                          {size}
                        </span>
                      ))
                    ) : (
                      <span className="px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest bg-slate-100 text-slate-500 border border-slate-200">
                        Unica
                      </span>
                    )}
                  </div>
                </div>

                <div className="space-y-3 mb-5">
                  <div className="flex items-center justify-between">
                    <p className="text-[9px] font-black uppercase tracking-widest text-slate-400">Nivel</p>
                    <p className={`text-[10px] font-black uppercase tracking-widest ${level.color}`}>{level.label}</p>
                  </div>

                  <div className="flex items-center justify-between gap-3">
                    <div className="flex gap-1.5">
                      {Array.from({ length: 5 }).map((_, idx) => (
                        <span
                          key={`${p.id}-mark-${idx}`}
                          className={`w-3 h-3 rounded-full border border-white/40 ${idx < level.marks ? level.bar : 'bg-slate-200 dark:bg-slate-700'}`}
                        />
                      ))}
                    </div>
                    <p className="text-[10px] font-black text-blue-400">{p.stock} U</p>
                  </div>

                  <div className="h-1.5 bg-blue-50 dark:bg-white/5 rounded-full overflow-hidden">
                    <motion.div
                      className={`h-full rounded-full ${level.bar}`}
                      initial={{ width: 0 }}
                      animate={{ width: `${stockPercentage}%` }}
                    />
                  </div>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => openEditEditor(p)}
                    className="flex-1 bg-blue-600 hover:bg-blue-500 text-white rounded-xl py-2.5 text-[10px] font-black uppercase tracking-widest"
                  >
                    Nivel +
                  </button>
                  <button onClick={() => openEditEditor(p)} className="p-2 text-blue-300 hover:text-blue-600 hover:bg-blue-100 rounded-xl transition-all"><Edit3 size={16} /></button>
                  <button onClick={() => onDeleteProduct(p.id)} className="p-2 text-blue-300 hover:text-rose-600 hover:bg-rose-100 rounded-xl transition-all"><Trash2 size={16} /></button>
                </div>
              </motion.article>
            );
          })}
        </div>
      ) : (
        <div className="bg-white dark:bg-white/5 border border-blue-100 dark:border-white/10 rounded-[2rem] shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-blue-50/30 dark:bg-black/20">
                  <th className="px-6 py-5 text-[9px] font-black text-blue-400 dark:text-slate-500 uppercase tracking-[0.2em] border-b border-blue-50 dark:border-white/5">Producto</th>
                  <th className="px-6 py-5 text-[9px] font-black text-blue-400 dark:text-slate-500 uppercase tracking-[0.2em] border-b border-blue-50 dark:border-white/5">Tallas</th>
                  <th className="px-6 py-5 text-[9px] font-black text-blue-400 dark:text-slate-500 uppercase tracking-[0.2em] border-b border-blue-50 dark:border-white/5">Nivel</th>
                  <th className="px-6 py-5 text-[9px] font-black text-blue-400 dark:text-slate-500 uppercase tracking-[0.2em] border-b border-blue-50 dark:border-white/5 text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-blue-50 dark:divide-white/5">
                {filteredProducts.map((p) => {
                  const level = getLevel(p);
                  const stockPercentage = Math.min((p.stock / p.stockMaximo) * 100, 100);
                  const sizes = parseSizes(p.talla);

                  return (
                    <motion.tr key={p.id} className="hover:bg-blue-50/30 dark:hover:bg-white/5 transition-colors group">
                      <td className="px-6 py-5">
                        <div className="min-w-0">
                          <p className="font-black text-blue-950 dark:text-white text-sm leading-tight truncate">{p.name}</p>
                          <span className="text-[9px] font-black text-blue-500 dark:text-blue-400 uppercase tracking-widest">{p.sku}</span>
                        </div>
                      </td>
                      <td className="px-6 py-5">
                        <div className="flex flex-wrap gap-1.5">
                          {(sizes.length > 0 ? sizes : ['UNICA']).map((size) => (
                            <span key={`${p.id}-tbl-${size}`} className="px-2 py-1 rounded-full text-[8px] font-black uppercase tracking-widest bg-blue-600/10 text-blue-700 border border-blue-600/20">
                              {size}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td className="px-6 py-5">
                        <div className="w-40 space-y-2">
                          <div className="flex justify-between text-[9px] font-black">
                            <span className={level.color}>● {level.label.toUpperCase()}</span>
                            <span className="text-blue-300 dark:text-slate-500">{p.stock} U</span>
                          </div>
                          <div className="h-1.5 bg-blue-50 dark:bg-white/5 rounded-full overflow-hidden">
                            <motion.div className={`h-full rounded-full ${level.bar}`} initial={{ width: 0 }} animate={{ width: `${stockPercentage}%` }} />
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-5 text-right">
                        <div className="flex justify-end gap-2">
                          <button onClick={() => openEditEditor(p)} className="px-3 py-2 text-[9px] font-black uppercase tracking-widest bg-blue-600 text-white rounded-xl hover:bg-blue-500">Nivel +</button>
                          <button onClick={() => onDeleteProduct(p.id)} className="p-2 text-blue-300 hover:text-rose-600 hover:bg-rose-100 rounded-xl transition-all"><Trash2 size={16} /></button>
                        </div>
                      </td>
                    </motion.tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <AnimatePresence>
        {editorOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[110] bg-slate-950/50 backdrop-blur-sm p-4 flex items-center justify-center"
          >
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 20, opacity: 0 }}
              className="w-full max-w-2xl rounded-[2rem] bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 shadow-2xl p-6"
            >
              <div className="flex items-center justify-between mb-5">
                <h3 className="text-lg font-black text-blue-900 dark:text-white tracking-tight">
                  {editingProductId == null ? 'Nuevo Producto' : 'Editar Producto'}
                </h3>
                <button onClick={closeEditor} className="w-9 h-9 rounded-xl bg-slate-100 dark:bg-white/10 flex items-center justify-center text-slate-500">
                  <X size={16} />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input className="bg-slate-100 dark:bg-white/10 rounded-xl px-4 py-3 text-sm font-bold" placeholder="SKU" value={form.sku} onChange={(e) => setForm((prev) => ({ ...prev, sku: e.target.value }))} />
                <input className="bg-slate-100 dark:bg-white/10 rounded-xl px-4 py-3 text-sm font-bold" placeholder="Nombre" value={form.name} onChange={(e) => setForm((prev) => ({ ...prev, name: e.target.value }))} />
                <input className="bg-slate-100 dark:bg-white/10 rounded-xl px-4 py-3 text-sm font-bold" placeholder="Tipo" value={form.type} onChange={(e) => setForm((prev) => ({ ...prev, type: e.target.value }))} />
                <input className="bg-slate-100 dark:bg-white/10 rounded-xl px-4 py-3 text-sm font-bold" placeholder="Tallas (S,M,L)" value={form.talla} onChange={(e) => setForm((prev) => ({ ...prev, talla: e.target.value }))} />
                <input className="bg-slate-100 dark:bg-white/10 rounded-xl px-4 py-3 text-sm font-bold" placeholder="Color" value={form.color} onChange={(e) => setForm((prev) => ({ ...prev, color: e.target.value }))} />
                <input className="bg-slate-100 dark:bg-white/10 rounded-xl px-4 py-3 text-sm font-bold" placeholder="Categoria" value={form.categoryName} onChange={(e) => setForm((prev) => ({ ...prev, categoryName: e.target.value }))} />
                <input className="bg-slate-100 dark:bg-white/10 rounded-xl px-4 py-3 text-sm font-bold" type="number" min={1} placeholder="Stock" value={form.stock} onChange={(e) => setForm((prev) => ({ ...prev, stock: Number(e.target.value) || 1 }))} />
                <input className="bg-slate-100 dark:bg-white/10 rounded-xl px-4 py-3 text-sm font-bold" type="number" min={1} placeholder="Stock minimo" value={form.stockMinimo} onChange={(e) => setForm((prev) => ({ ...prev, stockMinimo: Number(e.target.value) || 1 }))} />
                <input className="bg-slate-100 dark:bg-white/10 rounded-xl px-4 py-3 text-sm font-bold md:col-span-2" type="number" min={2} placeholder="Stock maximo" value={form.stockMaximo} onChange={(e) => setForm((prev) => ({ ...prev, stockMaximo: Number(e.target.value) || 2 }))} />

                <div className="md:col-span-2 border border-dashed border-blue-200 rounded-2xl p-4 bg-blue-50/40 dark:bg-white/5">
                  <div className="flex items-center justify-between gap-3">
                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">Foto del producto</p>
                    <label className="inline-flex items-center gap-2 px-3 py-2 rounded-xl bg-blue-600 text-white text-[10px] font-black uppercase tracking-widest cursor-pointer">
                      <ImagePlus size={14} /> Subir
                      <input type="file" accept="image/*" className="hidden" onChange={handleFileUpload} />
                    </label>
                  </div>
                  {form.photoUrl ? (
                    <img src={form.photoUrl} alt="preview" className="mt-3 w-full h-40 object-cover rounded-xl border border-blue-100" />
                  ) : (
                    <div className="mt-3 w-full h-24 rounded-xl border border-blue-100 bg-white/70 dark:bg-white/5 flex items-center justify-center text-slate-400 text-xs font-bold">
                      Sin foto
                    </div>
                  )}
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <button onClick={closeEditor} className="flex-1 rounded-xl border border-slate-200 px-4 py-3 text-xs font-black uppercase tracking-widest text-slate-600">Cancelar</button>
                <button onClick={() => void handleSaveProduct()} disabled={isLoading} className="flex-1 rounded-xl bg-blue-600 hover:bg-blue-500 px-4 py-3 text-xs font-black uppercase tracking-widest text-white disabled:opacity-60">
                  {editingProductId == null ? 'Crear producto' : 'Guardar cambios'}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};