import React from 'react';
import {
  Page,
  Text,
  View,
  Document,
  StyleSheet,
  Image
} from '@react-pdf/renderer';

// Interface for component props
export interface ActaProps {
  nombre: string;
  identificacion: string;
  cargo: string;
  articulos: Array<{
    imagen: string;
    descripcion: string;
    talla: string;
    cantidad: number;
  }>;
  firmaBase64: string;
  firmaGiverBase64?: string;
  nombreGiver?: string;
  evidencias?: string[];
  logoUrl?: string;
  fecha?: string;
  nroActa?: string;
}

// Styles definition
const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontFamily: 'Helvetica',
    fontSize: 10,
    color: '#333',
  },
  // Header Section
  header: {
    flexDirection: 'row',
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: 'black',
    marginBottom: 20,
    height: 60,
  },
  headerLogo: {
    width: '25%',
    borderRightWidth: 1,
    borderRightColor: 'black',
    borderRightStyle: 'solid',
    padding: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    width: '75%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  titleText: {
    fontSize: 12,
    fontWeight: 'bold',
    textTransform: 'uppercase',
  },
  // Info Section (Data Table)
  infoTable: {
    marginBottom: 20,
    borderTopWidth: 1,
    borderTopColor: 'black',
    borderTopStyle: 'solid',
    borderLeftWidth: 1,
    borderLeftColor: 'black',
    borderLeftStyle: 'solid',
  },
  infoRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: 'black',
    borderBottomStyle: 'solid',
    borderRightWidth: 1,
    borderRightColor: 'black',
    borderRightStyle: 'solid',
  },
  infoLabel: {
    width: '30%',
    backgroundColor: '#f0f0f0',
    padding: 6,
    fontWeight: 'bold',
    fontSize: 9,
    borderRightWidth: 1,
    borderRightColor: 'black',
    borderRightStyle: 'solid',
  },
  infoValue: {
    width: '70%',
    padding: 6,
    fontSize: 9,
  },
  // Products Section
  productsTable: {
    marginTop: 10,
    borderTopWidth: 1,
    borderTopColor: 'black',
    borderTopStyle: 'solid',
    borderLeftWidth: 1,
    borderLeftColor: 'black',
    borderLeftStyle: 'solid',
  },
  productsHeader: {
    flexDirection: 'row',
    backgroundColor: '#f0f0f0',
    fontWeight: 'bold',
    borderBottomWidth: 1,
    borderBottomColor: 'black',
    borderBottomStyle: 'solid',
    borderRightWidth: 1,
    borderRightColor: 'black',
    borderRightStyle: 'solid',
  },
  productsRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: 'black',
    borderBottomStyle: 'solid',
    borderRightWidth: 1,
    borderRightColor: 'black',
    borderRightStyle: 'solid',
    minHeight: 45,
    alignItems: 'center',
  },
  colFoto: { width: '20%', borderRightWidth: 1, borderRightColor: 'black', borderRightStyle: 'solid', padding: 2, alignItems: 'center', justifyContent: 'center' },
  colArticulo: { width: '50%', borderRightWidth: 1, borderRightColor: 'black', borderRightStyle: 'solid', padding: 5 },
  colTalla: { width: '15%', borderRightWidth: 1, borderRightColor: 'black', borderRightStyle: 'solid', padding: 5, textAlign: 'center' },
  colCantidad: { width: '15%', padding: 5, textAlign: 'center' },

  headerCell: {
    fontSize: 9,
    fontWeight: 'bold',
    padding: 5,
    textAlign: 'center',
  },
  productCell: {
    fontSize: 9,
    padding: 5,
  },
  productImage: {
    width: 35,
    height: 35,
    objectFit: 'contain',
  },
  // Signature Section
  signatureSection: {
    marginTop: 40,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'flex-start',
  },
  signatureBox: {
    width: 200,
    borderBottomWidth: 1,
    borderBottomColor: 'black',
    borderBottomStyle: 'solid',
    marginBottom: 5,
    alignItems: 'center',
  },
  signatureImage: {
    width: 150,
    height: 50,
    objectFit: 'contain',
  },
  signatureLabel: {
    fontSize: 10,
    fontWeight: 'bold',
    marginTop: 5,
  },
  // Footer
  footer: {
    position: 'absolute',
    bottom: 30,
    left: 40,
    right: 40,
    textAlign: 'center',
    fontSize: 8,
    color: '#999',
    borderTop: '0.5pt solid #eee',
    paddingTop: 5,
  },
  // Evidence Gallery
  evidenceSection: {
    marginTop: 20,
    padding: 10,
    backgroundColor: '#fafafa',
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#eee',
    borderStyle: 'solid',
  },
  evidenceTitle: {
    fontSize: 9,
    fontWeight: 'bold',
    marginBottom: 8,
    textTransform: 'uppercase',
    color: '#666',
  },
  evidenceGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 5,
  },
  evidencePhoto: {
    width: 100,
    height: 80,
    objectFit: 'cover',
    borderRadius: 3,
    borderWidth: 1,
    borderColor: '#ddd',
    borderStyle: 'solid',
  }
});

// Component
export const ActaReportPDF: React.FC<ActaProps> = ({
  nombre,
  identificacion,
  cargo,
  articulos,
  firmaBase64,
  firmaGiverBase64,
  nombreGiver,
  evidencias,
  logoUrl,
  fecha = new Date().toLocaleDateString(),
  nroActa = 'S/N'
}) => (
  <Document>
    <Page size="A4" style={styles.page}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLogo}>
          {logoUrl ? (
            <Image src={logoUrl} style={{ width: 40, height: 40 }} />
          ) : (
            <Text style={{ fontSize: 8, fontWeight: 'bold' }}>LOGO EMPRESA</Text>
          )}
        </View>
        <View style={styles.headerTitle}>
          <Text style={styles.titleText}>Acta Entrega - Elementos Dotación</Text>
          <Text style={{ fontSize: 8, marginTop: 4 }}>Gestión de Suministros Industriales</Text>
        </View>
      </View>

      {/* Info Section */}
      <View style={styles.infoTable}>
        <View style={styles.infoRow}>
          <View style={styles.infoLabel}><Text>NRO. ACTA</Text></View>
          <View style={styles.infoValue}><Text>{nroActa}</Text></View>
        </View>
        <View style={styles.infoRow}>
          <View style={styles.infoLabel}><Text>FECHA DE ENTREGA</Text></View>
          <View style={styles.infoValue}><Text>{fecha}</Text></View>
        </View>
        <View style={styles.infoRow}>
          <View style={styles.infoLabel}><Text>NOMBRE COMPLETO</Text></View>
          <View style={styles.infoValue}><Text>{nombre}</Text></View>
        </View>
        <View style={styles.infoRow}>
          <View style={styles.infoLabel}><Text>IDENTIFICACIÓN</Text></View>
          <View style={styles.infoValue}><Text>{identificacion}</Text></View>
        </View>
        <View style={styles.infoRow}>
          <View style={styles.infoLabel}><Text>CARGO / ÁREA</Text></View>
          <View style={styles.infoValue}><Text>{cargo}</Text></View>
        </View>
      </View>

      {/* Products Table */}
      <Text style={{ fontSize: 10, fontWeight: 'bold', marginBottom: 5 }}>DETALLE DE DOTACIÓN ENTREGADA</Text>
      <View style={styles.productsTable}>
        <View style={styles.productsHeader}>
          <View style={[styles.colFoto, { borderRight: '1pt solid black' }]}><Text style={styles.headerCell}>FOTO</Text></View>
          <View style={[styles.colArticulo, { borderRight: '1pt solid black' }]}><Text style={styles.headerCell}>ARTÍCULO / DESCRIPCIÓN</Text></View>
          <View style={[styles.colTalla, { borderRight: '1pt solid black' }]}><Text style={styles.headerCell}>TALLA</Text></View>
          <View style={styles.colCantidad}><Text style={styles.headerCell}>CANT.</Text></View>
        </View>

        {articulos.map((art, index) => (
          <View key={index} style={styles.productsRow}>
            <View style={styles.colFoto}>
              {art.imagen ? (
                <Image src={art.imagen} style={styles.productImage} />
              ) : (
                <View style={{ width: 30, height: 30, backgroundColor: '#eee' }} />
              )}
            </View>
            <View style={styles.colArticulo}>
              <Text style={styles.productCell}>{art.descripcion}</Text>
            </View>
            <View style={styles.colTalla}>
              <Text style={[styles.productCell, { textAlign: 'center' }]}>{art.talla || 'N/A'}</Text>
            </View>
            <View style={styles.colCantidad}>
              <Text style={[styles.productCell, { textAlign: 'center' }]}>{art.cantidad}</Text>
            </View>
          </View>
        ))}
      </View>

      {/* Evidence Section */}
      {evidencias && evidencias.length > 0 && (
        <View style={styles.evidenceSection}>
          <Text style={styles.evidenceTitle}>Evidencia Fotográfica de Entrega</Text>
          <View style={styles.evidenceGrid}>
            {evidencias.map((photo, i) => (
              <Image key={i} src={photo} style={styles.evidencePhoto} />
            ))}
          </View>
        </View>
      )}

      {/* Signature Section */}
      <View style={styles.signatureSection}>
        {/* Giver Signature */}
        <View style={{ alignItems: 'center' }}>
          <View style={styles.signatureBox}>
            {firmaGiverBase64 && (
              <Image src={firmaGiverBase64} style={styles.signatureImage} />
            )}
          </View>
          <Text style={styles.signatureLabel}>Firma Quien Entrega</Text>
          <Text style={{ fontSize: 8, marginTop: 2 }}>{nombreGiver || 'Administrador'}</Text>
        </View>

        {/* Receiver Signature */}
        <View style={{ alignItems: 'center' }}>
          <View style={styles.signatureBox}>
            {firmaBase64 && (
              <Image src={firmaBase64} style={styles.signatureImage} />
            )}
          </View>
          <Text style={styles.signatureLabel}>Firma Quien Recibe</Text>
          <Text style={{ fontSize: 8, marginTop: 2 }}>{nombre}</Text>
          <Text style={{ fontSize: 8 }}>{identificacion}</Text>
        </View>
      </View>

      <Text style={styles.footer}>
        Este documento certifica la entrega de los elementos descritos anteriormente.
        El trabajador se compromete a darles un uso adecuado y reportar cualquier novedad.
      </Text>
    </Page>
  </Document>
);
