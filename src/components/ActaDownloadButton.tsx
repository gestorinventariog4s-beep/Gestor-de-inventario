import React from 'react';
import { PDFDownloadLink } from '@react-pdf/renderer';
import { ActaReportPDF, ActaProps } from './ActaReportPDF';
import { Download, Loader2 } from 'lucide-react';

interface DownloadButtonProps {
  data: ActaProps;
  fileName?: string;
  className?: string;
}

export const ActaDownloadButton: React.FC<DownloadButtonProps> = ({ 
  data, 
  fileName = `acta-entrega-${new Date().getTime()}.pdf`,
  className = ""
}) => {
  return (
    <PDFDownloadLink
      document={<ActaReportPDF {...data} />}
      fileName={fileName}
      className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl font-bold text-xs transition-all ${className}`}
    >
      {({ loading }) => 
        loading ? (
          <>
            <Loader2 size={16} className="animate-spin" />
            <span>Generando PDF...</span>
          </>
        ) : (
          <>
            <Download size={16} />
            <span>Descargar Acta Corporativa</span>
          </>
        )
      }
    </PDFDownloadLink>
  );
};
