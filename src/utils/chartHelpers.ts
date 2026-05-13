import { Product, InventoryMovement, DashboardDemandResponse } from '../types';

/**
 * Universal Data Transformer for Invetarx Charts
 * This ensures that no matter how the backend data arrives, 
 * the charts can always "read" it correctly.
 */

export const ChartTransformers = {
  /**
   * Transforms raw movements into a time-series for the Area Chart
   */
  toOperationalFlow: (movements: InventoryMovement[]) => {
    if (!movements || movements.length === 0) {
      // Fallback to a baseline if no data exists
      return [
        { name: 'Inicio', value: 0 },
        { name: 'Actual', value: 0 }
      ];
    }

    // Group by date and count outbound movements (deliveries)
    const groups: Record<string, number> = {};
    movements.forEach(m => {
      const date = new Date(m.createdAt).toLocaleDateString('es-ES', { day: '2-digit', month: 'short' });
      if (m.movementType === 'OUTBOUND') {
        groups[date] = (groups[date] || 0) + Math.abs(m.quantity);
      }
    });

    return Object.entries(groups).map(([name, value]) => ({ name, value }));
  },

  /**
   * Ensures demand data is always sorted and capped for the Top Products bar
   */
  toTopProducts: (demand: DashboardDemandResponse | null) => {
    if (!demand || !demand.topProducts) return [];
    return [...demand.topProducts]
      .sort((a, b) => b.quantity - a.quantity)
      .slice(0, 5);
  },

  /**
   * Groups products by category for distribution charts
   */
  toCategoryDistribution: (products: Product[]) => {
    const distribution: Record<string, number> = {};
    products.forEach(p => {
      const cat = p.category.name;
      distribution[cat] = (distribution[cat] || 0) + p.stock;
    });

    return Object.entries(distribution).map(([name, value]) => ({ 
      name, 
      value,
      color: '#' + Math.floor(Math.random()*16777215).toString(16) // Random color if not defined
    }));
  }
};

/**
 * Universal Currency & Number Formatter
 */
export const formatters = {
  number: (val: number) => new Intl.NumberFormat('es-CO').format(val),
  date: (dateStr: string) => new Date(dateStr).toLocaleString('es-ES', {
    day: '2-digit',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit'
  })
};
