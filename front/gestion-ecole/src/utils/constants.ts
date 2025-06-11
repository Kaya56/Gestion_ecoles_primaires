import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { formatDate, formatCurrency, getFullName } from './helpers';

// Define SCHOOL_INFO locally to avoid circular import
export const SCHOOL_INFO = {
  name: 'École Primaire Exemple',
  address: "123 Rue de l'École, Ville, Pays",
  phone: '0123456789',
  email: 'contact@ecole-exemple.com'
};

// Default PDF configuration
const PDF_CONFIG = {
  format: 'a4' as const,
  unit: 'mm' as const,
  orientation: 'portrait' as const,
  margins: {
    top: 20,
    right: 15,
    bottom: 20,
    left: 15
  },
  colors: {
    primary: '#1f2937',
    secondary: '#6b7280',
    accent: '#3b82f6',
    success: '#10b981',
    warning: '#f59e0b',
    danger: '#ef4444'
  },
  fonts: {
    title: 16,
    subtitle: 13,
    body: 11,
    small: 9
  }
};

// Common table styles avec types corrects
const TABLE_STYLES = {
  headStyles: {
    fillColor: [31, 41, 55] as [number, number, number],
    textColor: 255,
    fontStyle: 'bold' as const
  },
  bodyStyles: {
    textColor: 50
  },
  alternateRowStyles: {
    fillColor: [249, 250, 251] as [number, number, number]
  }
};

// Helper function to create PDF with orientation
const createPDF = (orientation: 'portrait' | 'landscape' = 'portrait') => {
  return new jsPDF({
    orientation,
    unit: PDF_CONFIG.unit,
    format: PDF_CONFIG.format
  });
};

// Helper function to add header
const addHeader = (doc: jsPDF, title: string, subtitle: string = ''): number => {
  const pageWidth = doc.internal.pageSize.width;

  // School name
  doc.setFontSize(PDF_CONFIG.fonts.title);
  doc.setFont(undefined, 'bold');
  doc.text(SCHOOL_INFO.name, pageWidth / 2, 30, { align: 'center' });

  // School address
  doc.setFontSize(PDF_CONFIG.fonts.small);
  doc.setFont(undefined, 'normal');
  doc.text(SCHOOL_INFO.address, pageWidth / 2, 37, { align: 'center' });
  doc.text(`Tél: ${SCHOOL_INFO.phone} | Email: ${SCHOOL_INFO.email}`, pageWidth / 2, 42, { align: 'center' });

  // Separator line
  doc.setLineWidth(0.5);
  doc.line(PDF_CONFIG.margins.left, 47, pageWidth - PDF_CONFIG.margins.right, 47);

  // Document title
  doc.setFontSize(PDF_CONFIG.fonts.subtitle);
  doc.setFont(undefined, 'bold');
  doc.text(title, pageWidth / 2, 57, { align: 'center' });

  if (subtitle) {
    doc.setFontSize(PDF_CONFIG.fonts.body);
    doc.setFont(undefined, 'normal');
    doc.text(subtitle, pageWidth / 2, 64, { align: 'center' });
  }

  return 70; // Return Y position for content start
};

// Helper function to add footer
const addFooter = (doc: jsPDF) => {
  const pageWidth = doc.internal.pageSize.width;
  const pageHeight = doc.internal.pageSize.height;
  const pageNumber = doc.internal.getNumberOfPages();

  doc.setFontSize(PDF_CONFIG.fonts.small);
  doc.setFont(undefined, 'normal');

  // Page number
  doc.text(`Page ${pageNumber}`, pageWidth - PDF_CONFIG.margins.right, pageHeight - 10, { align: 'right' });

  // Generation date
  doc.text(`Généré le ${formatDate(new Date(), 'DD/MM/YYYY HH:mm')}`, PDF_CONFIG.margins.left, pageHeight - 10);
};

// Type definitions for better type safety
export interface Student {
  firstName: string;
  lastName: string;
  matricule?: string;
  className?: string;
  section?: string;
  birthDate?: string;
  parentPhone?: string;
}

export interface Grade {
  subjectName: string;
  coefficient?: number;
  value: number;
}

export type Semester = 'FIRST' | 'SECOND';

export const generateBulletin = (
  student: Student,
  grades: Grade[],
  academicYear: string,
  semester: Semester
) => {
  if (!grades || grades.length === 0) {
    throw new Error('Les notes sont requises pour générer le bulletin.');
  }

  const doc = createPDF();

  // Add header
  const startY = addHeader(
    doc,
    'BULLETIN DE NOTES',
    `${academicYear} - ${semester === 'FIRST' ? '1er' : '2ème'} Semestre`
  );

  let currentY = startY + 15;

  // Student information
  doc.setFontSize(PDF_CONFIG.fonts.body);
  doc.setFont(undefined, 'bold');
  doc.text('INFORMATIONS ÉLÈVE', PDF_CONFIG.margins.left, currentY);

  currentY += 8;
  doc.setFont(undefined, 'normal');
  doc.text(`Nom: ${getFullName(student.firstName, student.lastName)}`, PDF_CONFIG.margins.left, currentY);
  doc.text(`Matricule: ${student.matricule || 'N/A'}`, 120, currentY);

  currentY += 6;
  doc.text(`Classe: ${student.className || 'N/A'}`, PDF_CONFIG.margins.left, currentY);
  doc.text(`Section: ${student.section || 'N/A'}`, 120, currentY);

  currentY += 15;

  // Grades table
  const tableData = grades.map((grade: Grade) => [
    grade.subjectName,
    grade.coefficient?.toString() || '1',
    grade.value?.toFixed(1) || '0.0',
    (grade.value * (grade.coefficient || 1)).toFixed(1),
    grade.value >= 10 ? 'Admis' : 'Échec'
  ]);

  // Calculate totals
  const totalPoints = grades.reduce(
    (sum: number, grade: Grade) => sum + grade.value * (grade.coefficient || 1),
    0
  );
  const totalCoefficients = grades.reduce(
    (sum: number, grade: Grade) => sum + (grade.coefficient || 1),
    0
  );
  const average = totalCoefficients > 0 ? (totalPoints / totalCoefficients).toFixed(2) : '0.00';

  autoTable(doc, {
    head: [['Matière', 'Coeff.', 'Note', 'Points', 'Mention']],
    body: [
      ...tableData,
      [
        'MOYENNE GÉNÉRALE',
        totalCoefficients.toString(),
        average,
        totalPoints.toFixed(1),
        parseFloat(average) >= 10 ? 'ADMIS' : 'ÉCHEC'
      ]
    ],
    startY: currentY,
    margin: { left: PDF_CONFIG.margins.left, right: PDF_CONFIG.margins.right },
    styles: { fontSize: PDF_CONFIG.fonts.body, cellPadding: 3 },
    ...TABLE_STYLES,
    didParseCell: function (data) {
      // Highlight average row
      if (data.row.index === tableData.length) {
        data.cell.styles.fillColor = [59, 130, 246];
        data.cell.styles.textColor = 255;
        data.cell.styles.fontStyle = 'bold';
      }
    }
  });

  currentY = (doc as any).lastAutoTable.finalY + 20;

  // Comments section
  doc.setFontSize(PDF_CONFIG.fonts.body);
  doc.setFont(undefined, 'bold');
  doc.text('OBSERVATIONS', PDF_CONFIG.margins.left, currentY);

  currentY += 8;
  doc.setFont(undefined, 'normal');

  let comment = '';
  const avgValue = parseFloat(average);
  if (avgValue >= 16) {
    comment = 'Excellent travail. Continuez ainsi!';
  } else if (avgValue >= 14) {
    comment = 'Très bon travail. Bon élève.';
  } else if (avgValue >= 12) {
    comment = 'Bon travail. Peut mieux faire.';
  } else if (avgValue >= 10) {
    comment = 'Travail satisfaisant. Doit faire des efforts.';
  } else {
    comment = "Travail insuffisant. Doit redoubler d'efforts.";
  }
  doc.text(comment, PDF_CONFIG.margins.left, currentY + 6);

  // Add footer
  addFooter(doc);

  return doc;
};

export interface Payment {
  id?: string;
  paymentDate: string;
  paymentType?: string;
  amount: number;
  paymentMethod?: string;
  description?: string;
  studentName?: string;
}

export const generatePaymentReceipt = (payment: Payment, student: Student) => {
  if (!payment.amount || payment.amount <= 0) {
    throw new Error('Le montant du paiement doit être spécifié et positif.');
  }

  const doc = createPDF();

  // Add header
  const startY = addHeader(doc, 'REÇU DE PAIEMENT', `N° ${payment.id || 'XXXX'}`);

  let currentY = startY + 15;

  // Payment information
  doc.setFontSize(PDF_CONFIG.fonts.body);
  doc.setFont(undefined, 'bold');
  doc.text('DÉTAILS DU PAIEMENT', PDF_CONFIG.margins.left, currentY);

  currentY += 10;
  doc.setFont(undefined, 'normal');

  const paymentData = [
    ['Date de paiement', payment.paymentDate ? formatDate(payment.paymentDate) : 'N/A'],
    ['Élève', getFullName(student.firstName, student.lastName)],
    ['Matricule', student.matricule || 'N/A'],
    ['Classe', student.className || 'N/A'],
    ['Type de paiement', payment.paymentType || 'N/A'],
    ['Montant', formatCurrency(payment.amount)],
    ['Mode de paiement', payment.paymentMethod || 'Espèces'],
    ['Description', payment.description || 'N/A']
  ];

  autoTable(doc, {
    body: paymentData,
    startY: currentY,
    margin: { left: PDF_CONFIG.margins.left, right: PDF_CONFIG.margins.right },
    styles: { fontSize: PDF_CONFIG.fonts.body, cellPadding: 4 },
    columnStyles: {
      0: { fontStyle: 'bold' as const, cellWidth: 50 },
      1: { cellWidth: 'auto' }
    },
    showHead: false,
    theme: 'plain'
  });

  currentY = (doc as any).lastAutoTable.finalY + 20;

  // Amount in words (simplified)
  doc.setFont(undefined, 'bold');
  doc.text('Montant en lettres:', PDF_CONFIG.margins.left, currentY);
  doc.setFont(undefined, 'normal');
  doc.text(`${formatCurrency(payment.amount)} (${payment.amount} Francs CFA)`, PDF_CONFIG.margins.left, currentY + 7);

  currentY += 30;

  // Add footer
  addFooter(doc);

  return doc;
};

export interface ClassInfo {
  name: string;
  academicYear: string;
  section?: string;
  language?: string;
}

export const generateClassList = (classInfo: ClassInfo, students: Student[]) => {
  const doc = createPDF();

  // Add header
  const startY = addHeader(doc, 'LISTE DE CLASSE', `${classInfo.name} - ${classInfo.academicYear}`);

  let currentY = startY + 10;

  // Class information
  doc.setFontSize(PDF_CONFIG.fonts.body);
  doc.setFont(undefined, 'normal');
  doc.text(`Section: ${classInfo.section || 'N/A'}`, PDF_CONFIG.margins.left, currentY);
  doc.text(`Langue: ${classInfo.language || 'N/A'}`, 120, currentY);
  doc.text(`Effectif: ${students.length}`, 160, currentY);

  currentY += 15;

  // Students table
  if (students && students.length > 0) {
    const tableData = students.map((student: Student, index: number) => [
      (index + 1).toString(),
      student.matricule || 'N/A',
      getFullName(student.firstName, student.lastName),
      student.birthDate ? formatDate(student.birthDate) : 'N/A',
      student.parentPhone || 'N/A'
    ]);

    autoTable(doc, {
      head: [['N°', 'Matricule', 'Nom et Prénom', 'Date de naissance', 'Tél. Parent']],
      body: tableData,
      startY: currentY,
      margin: { left: PDF_CONFIG.margins.left, right: PDF_CONFIG.margins.right },
      styles: { fontSize: PDF_CONFIG.fonts.body, cellPadding: 3 },
      ...TABLE_STYLES,
      columnStyles: {
        0: { cellWidth: 15 },
        1: { cellWidth: 30 },
        2: { cellWidth: 60 },
        3: { cellWidth: 35 },
        4: { cellWidth: 40 }
      }
    });
  }

  // Add footer
  addFooter(doc);

  return doc;
};

export const generateFinancialReport = (payments: Payment[], startDate: string, endDate: string) => {
  const doc = createPDF('landscape');

  // Add header
  const startY = addHeader(doc, 'RAPPORT FINANCIER', `Période: ${formatDate(startDate)} - ${formatDate(endDate)}`);

  let currentY = startY + 15;

  if (payments && payments.length > 0) {
    // Calculate totals by payment type
    const totals = payments.reduce((acc: any, payment: Payment) => {
      const type = payment.paymentType || 'OTHER';
      acc[type] = (acc[type] || 0) + (payment.amount || 0);
      acc.total = (acc.total || 0) + (payment.amount || 0);
      return acc;
    }, { total: 0 });

    // Summary table
    doc.setFontSize(PDF_CONFIG.fonts.body);
    doc.setFont(undefined, 'bold');
    doc.text('RÉSUMÉ PAR TYPE DE PAIEMENT', PDF_CONFIG.margins.left, currentY);

    currentY += 10;

    const summaryData = Object.entries(totals)
      .filter(([key]) => key !== 'total')
      .map(([type, amount]) => [type, formatCurrency(amount as number)]);

    summaryData.push(['TOTAL GÉNÉRAL', formatCurrency(totals.total)]);

    autoTable(doc, {
      head: [['Type de paiement', 'Montant']],
      body: summaryData,
      startY: currentY,
      margin: { left: PDF_CONFIG.margins.left, right: PDF_CONFIG.margins.right },
      styles: { fontSize: PDF_CONFIG.fonts.body, cellPadding: 4 },
      ...TABLE_STYLES,
      columnStyles: {
        0: { cellWidth: 80 },
        1: { cellWidth: 60, halign: 'right' as const }
      },
      didParseCell: function (data) {
        if (data.row.index === summaryData.length - 1) {
          data.cell.styles.fillColor = [59, 130, 246];
          data.cell.styles.textColor = 255;
          data.cell.styles.fontStyle = 'bold';
        }
      }
    });

    currentY = (doc as any).lastAutoTable.finalY + 20;

    // Detailed payments table
    doc.setFont(undefined, 'bold');
    doc.text('DÉTAIL DES PAIEMENTS', PDF_CONFIG.margins.left, currentY);

    currentY += 10;

    const detailData = payments.map((payment: Payment) => [
      payment.paymentDate ? formatDate(payment.paymentDate) : 'N/A',
      payment.studentName || 'N/A',
      payment.paymentType || 'N/A',
      formatCurrency(payment.amount),
      payment.paymentMethod || 'N/A'
    ]);

    autoTable(doc, {
      head: [['Date', 'Élève', 'Type', 'Montant', 'Mode']],
      body: detailData,
      startY: currentY,
      margin: { left: PDF_CONFIG.margins.left, right: PDF_CONFIG.margins.right },
      styles: { fontSize: PDF_CONFIG.fonts.small, cellPadding: 2 },
      ...TABLE_STYLES,
      columnStyles: {
        0: { cellWidth: 30 },
        1: { cellWidth: 60 },
        2: { cellWidth: 40 },
        3: { cellWidth: 35, halign: 'right' as const },
        4: { cellWidth: 30 }
      }
    });
  }

  // Add footer
  addFooter(doc);

  return doc;
};

// Stub for discipline report to avoid syntax error
export const generateDisciplineReport = (incidents: any[], startDate: string, endDate: string) => {
  const doc = createPDF();
  // Add header
  addHeader(doc, 'RAPPORT DE DISCIPLINE', `Période: ${formatDate(startDate)} - ${formatDate(endDate)}`);
  // ... implement the rest as needed
  addFooter(doc);
  return doc;
};