import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import {
  Search, Plus, Edit3, Trash2,
  FileSpreadsheet,
  Package, Filter,
  LayoutGrid, List, AlertTriangle,
  TrendingUp, Clock
} from 'lucide-react';
import { Product, StockAlert } from '../types';

type InventoryPayload = Record<string, never>;

interface InventoryManagerProps {
  products: Product[];
  alerts: StockAlert[];
  onAddProduct: (p: InventoryPayload) => Promise<void>;
  onEditProduct: (p: Product) => void;
  onDeleteProduct: (id: number) => Promise<void>;
  onBulkAddProducts: (products: InventoryPayload[]) => Promise<void>;
  isLoading: boolean;
}

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
  const [viewMode, setViewMode] = useState<'table' | 'grid'>('table');

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
              onClick={() => onAddProduct({})}
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
            <p className="text-[9px] font-bold mt-2 text-rose-600/60 uppercase tracking-widest">Reponer Stock</p>
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
      <div className="bg-white dark:bg-white/5 border border-blue-100 dark:border-white/10 rounded-[2rem] shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-blue-50/30 dark:bg-black/20">
                <th className="px-6 py-5 text-[9px] font-black text-blue-400 dark:text-slate-500 uppercase tracking-[0.2em] border-b border-blue-50 dark:border-white/5">Producto</th>
                <th className="px-6 py-5 text-[9px] font-black text-blue-400 dark:text-slate-500 uppercase tracking-[0.2em] border-b border-blue-50 dark:border-white/5">Categoría</th>
                <th className="px-6 py-5 text-[9px] font-black text-blue-400 dark:text-slate-500 uppercase tracking-[0.2em] border-b border-blue-50 dark:border-white/5">Stock</th>
                <th className="px-6 py-5 text-[9px] font-black text-blue-400 dark:text-slate-500 uppercase tracking-[0.2em] border-b border-blue-50 dark:border-white/5 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-blue-50 dark:divide-white/5">
              {filteredProducts.map((p) => {
                const isLow = p.stock <= p.stockMinimo && p.stock > 0;
                const isOut = p.stock === 0;
                const stockPercentage = Math.min((p.stock / p.stockMaximo) * 100, 100);

                return (
                  <motion.tr key={p.id} className="hover:bg-blue-50/30 dark:hover:bg-white/5 transition-colors group">
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-xl bg-blue-600 dark:bg-blue-600 flex items-center justify-center text-white font-black text-base shadow-lg">
                          {p.name.charAt(0)}
                        </div>
                        <div className="min-w-0">
                          <p className="font-black text-blue-950 dark:text-white text-sm leading-tight truncate">{p.name}</p>
                          <span className="text-[9px] font-black text-blue-500 dark:text-blue-400 uppercase tracking-widest">{p.sku}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <span className="bg-blue-50 dark:bg-white/10 text-blue-600 dark:text-slate-400 text-[8px] font-black px-3 py-1.5 rounded-lg uppercase tracking-widest border border-blue-100 dark:border-white/5">
                        {p.category?.name || 'GENERAL'}
                      </span>
                    </td>
                    <td className="px-6 py-5">
                      <div className="w-32 space-y-2">
                        <div className="flex justify-between text-[9px] font-black">
                          <span className={isOut ? 'text-rose-600' : isLow ? 'text-amber-600' : 'text-emerald-600'}>
                            {isOut ? '● AGOTADO' : isLow ? '● BAJO' : '● OK'}
                          </span>
                          <span className="text-blue-300 dark:text-slate-500">{p.stock} U</span>
                        </div>
                        <div className="h-1.5 bg-blue-50 dark:bg-white/5 rounded-full overflow-hidden">
                          <motion.div
                            className={`h-full rounded-full ${isOut ? 'bg-slate-300 dark:bg-slate-700' : isLow ? 'bg-amber-500' : 'bg-emerald-500'}`}
                            initial={{ width: 0 }} animate={{ width: `${stockPercentage}%` }}
                          />
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-5 text-right">
                      <div className="flex justify-end gap-2">
                        <button onClick={() => onEditProduct(p)} className="p-2 text-blue-300 hover:text-blue-600 hover:bg-blue-100 rounded-xl transition-all"><Edit3 size={16} /></button>
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
    </div>
  );
};