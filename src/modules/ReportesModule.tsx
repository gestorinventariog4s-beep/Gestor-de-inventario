import React from 'react';
import { BarChart3, Download, FileSpreadsheet, FileText } from 'lucide-react';
import type { DashboardDemandResponse } from '../types';

interface ReportesModuleProps {
  demand: DashboardDemandResponse | null;
  movementsCount: number;
  alertsCount: number;
  reportFrom: string;
  reportTo: string;
  setReportFrom: (value: string) => void;
  setReportTo: (value: string) => void;
  actaId: string;
  setActaId: (value: string) => void;
  onExportInventory: () => Promise<void>;
  onExportMovements: () => Promise<void>;
  onExportAuditPdf: () => Promise<void>;
  onExportActaPdf: () => Promise<void>;
  isLoading: boolean;
}

export const ReportesModule: React.FC<ReportesModuleProps> = ({
  demand,
  movementsCount,
  alertsCount,
  reportFrom,
  reportTo,
  setReportFrom,
  setReportTo,
  actaId,
  setActaId,
  onExportInventory,
  onExportMovements,
  onExportAuditPdf,
  onExportActaPdf,
  isLoading,
}) => {
  return (
    <div className="flex flex-col gap-8 w-full animate-fade">
      <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1.5rem' }}>
        <div className="glass-card p-8">
          <p style={{ fontSize: '0.65rem', fontWeight: 900, textTransform: 'uppercase', color: '#94a3b8', letterSpacing: '0.12em' }}>Movimientos</p>
          <h3 style={{ fontSize: '2.2rem', fontWeight: 900, marginTop: '0.4rem' }}>{movementsCount}</h3>
        </div>
        <div className="glass-card p-8">
          <p style={{ fontSize: '0.65rem', fontWeight: 900, textTransform: 'uppercase', color: '#94a3b8', letterSpacing: '0.12em' }}>Alertas activas</p>
          <h3 style={{ fontSize: '2.2rem', fontWeight: 900, marginTop: '0.4rem', color: 'var(--danger)' }}>{alertsCount}</h3>
        </div>
        <div className="glass-card p-8">
          <p style={{ fontSize: '0.65rem', fontWeight: 900, textTransform: 'uppercase', color: '#94a3b8', letterSpacing: '0.12em' }}>Top demanda</p>
          <h3 style={{ fontSize: '1.2rem', fontWeight: 900, marginTop: '0.5rem' }}>{demand?.topProducts?.[0]?.productName ?? 'Sin datos'}</h3>
        </div>
      </div>

      <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '2rem' }}>
        <div className="glass-card p-10">
          <div className="flex items-center gap-3" style={{ marginBottom: '1rem' }}>
            <FileSpreadsheet size={18} style={{ color: 'var(--primary-light)' }} />
            <h3 style={{ fontSize: '1.2rem', fontWeight: 900 }}>Exportaciones CSV</h3>
          </div>
          <div className="flex flex-col gap-4">
            <button className="btn-elite btn-primary" disabled={isLoading} onClick={() => void onExportInventory()}>
              <Download size={16} /> Inventario CSV
            </button>
            <input type="date" value={reportFrom} onChange={(e) => setReportFrom(e.target.value)} style={{ padding: '0.95rem', borderRadius: '0.9rem', border: '1px solid #e2e8f0' }} />
            <input type="date" value={reportTo} onChange={(e) => setReportTo(e.target.value)} style={{ padding: '0.95rem', borderRadius: '0.9rem', border: '1px solid #e2e8f0' }} />
            <button className="btn-elite" style={{ background: '#eff6ff', color: '#1d4ed8' }} disabled={isLoading} onClick={() => void onExportMovements()}>
              <BarChart3 size={16} /> Movimientos CSV
            </button>
          </div>
        </div>

        <div className="glass-card p-10">
          <div className="flex items-center gap-3" style={{ marginBottom: '1rem' }}>
            <FileText size={18} style={{ color: '#7c3aed' }} />
            <h3 style={{ fontSize: '1.2rem', fontWeight: 900 }}>PDFs operativos</h3>
          </div>
          <div className="flex flex-col gap-4">
            <button className="btn-elite" style={{ background: '#faf5ff', color: '#7c3aed' }} disabled={isLoading} onClick={() => void onExportAuditPdf()}>
              <Download size={16} /> Auditoria PDF
            </button>
            <input value={actaId} onChange={(e) => setActaId(e.target.value)} placeholder="ID de acta" style={{ padding: '0.95rem', borderRadius: '0.9rem', border: '1px solid #e2e8f0' }} />
            <button className="btn-elite" style={{ background: '#fff7ed', color: '#c2410c' }} disabled={isLoading || !actaId.trim()} onClick={() => void onExportActaPdf()}>
              <Download size={16} /> Acta PDF
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};