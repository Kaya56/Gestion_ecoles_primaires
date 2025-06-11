






import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { formatDate, formatCurrency, formatGrade, formatFullName, getFullName, getGradeStatus } from './helpers';

// Configuration de l'école
export const SCHOOL_INFO = {
  name: 'École Primaire Exemple',
  address: "123 Rue de l'École, Ville, Pays",
  phone: '0123456789',
  email: 'contact@ecole-exemple.com'
};

// Configuration PDF par défaut
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
    title: 20,
    subtitle: 16,
    heading: 14,
    body: 12,
    small: 10,
    tiny: 9
  }
};

// Styles de tableaux communs
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

// Types d'interface unifiés
export interface Student {
  id?: number;
  firstName: string;
  lastName: string;
  matricule?: string;
  studentNumber?: string;
  className?: string;
  section?: string;
  academicYear?: string;
  birthDate?: string;
  dateOfBirth?: string;
  parentPhone?: string;
}

export interface Grade {
  id?: number;
  subjectName: string;
  coefficient?: number;
  firstTerm?: number;
  secondTerm?: number;
  thirdTerm?: number;
  value?: number;
  average?: number;
}

export interface Payment {
  id?: string | number;
  paymentDate?: string;
  date?: string;
  paymentType?: string;
  amount: number;
  paymentMethod?: string;
  method?: string;
  description?: string;
  studentName?: string;
  status?: string;
}

export interface DisciplineRecord {
  id?: number;
  date: string;
  type: string;
  reason: string;
  action: string;
  resolved?: boolean;
}

export interface ClassInfo {
  name: string;
  academicYear: string;
  section?: string;
  language?: string;
}

export type Semester = 'FIRST' | 'SECOND';

// Fonctions utilitaires
const createPDF = (orientation: 'portrait' | 'landscape' = 'portrait') => {
  return new jsPDF({
    orientation,
    unit: PDF_CONFIG.unit,
    format: PDF_CONFIG.format
  });
};

const addHeader = (doc: jsPDF, title: string, subtitle: string = ''): number => {
  const pageWidth = doc.internal.pageSize.width;

  // Nom de l'école
  doc.setFontSize(PDF_CONFIG.fonts.subtitle);
  doc.setFont('helvetica', 'bold');
  doc.text(SCHOOL_INFO.name, pageWidth / 2, 30, { align: 'center' });

  // Adresse de l'école
  doc.setFontSize(PDF_CONFIG.fonts.small);
  doc.setFont('helvetica', 'normal');
  doc.text(SCHOOL_INFO.address, pageWidth / 2, 37, { align: 'center' });
  doc.text(`Tél: ${SCHOOL_INFO.phone} | Email: ${SCHOOL_INFO.email}`, pageWidth / 2, 42, { align: 'center' });

  // Ligne de séparation
  doc.setLineWidth(0.5);
  doc.line(PDF_CONFIG.margins.left, 47, pageWidth - PDF_CONFIG.margins.right, 47);

  // Titre du document
  doc.setFontSize(PDF_CONFIG.fonts.title);
  doc.setFont('helvetica', 'bold');
  doc.text(title, pageWidth / 2, 57, { align: 'center' });

  if (subtitle) {
    doc.setFontSize(PDF_CONFIG.fonts.body);
    doc.setFont('helvetica', 'normal');
    doc.text(subtitle, pageWidth / 2, 64, { align: 'center' });
    return 75;
  }

  return 70;
};

const addFooter = (doc: jsPDF) => {
  const pageWidth = doc.internal.pageSize.width;
  const pageHeight = doc.internal.pageSize.height;
  const pageNumber = doc.internal.getNumberOfPages();

  doc.setFontSize(PDF_CONFIG.fonts.small);
  doc.setFont('helvetica', 'normal');

  // Numéro de page
  doc.text(`Page ${pageNumber}`, pageWidth - PDF_CONFIG.margins.right, pageHeight - 10, { align: 'right' });

  // Date de génération
  doc.text(`Généré le ${formatDate(new Date())}`, PDF_CONFIG.margins.left, pageHeight - 10);
};

const getStudentFullName = (student: Student): string => {
  return formatFullName ? 
    formatFullName(student.firstName, student.lastName) : 
    getFullName(student.firstName, student.lastName);
};

const getStudentMatricule = (student: Student): string => {
  return student.matricule || student.studentNumber || 'N/A';
};

const getStudentBirthDate = (student: Student): string => {
  const birthDate = student.birthDate || student.dateOfBirth;
  return birthDate ? formatDate(birthDate) : 'N/A';
};

const getPaymentDate = (payment: Payment): string => {
  const date = payment.paymentDate || payment.date;
  return date ? formatDate(date) : 'N/A';
};

const getPaymentMethod = (payment: Payment): string => {
  return payment.paymentMethod || payment.method || 'Espèces';
};

/**
 * Générateur de bulletin de notes unifié
 */
export const generateBulletin = (
  student: Student,
  grades: Grade[],
  academicYear: string,
  semester?: Semester,
  term?: string
): jsPDF => {
  if (!grades || grades.length === 0) {
    throw new Error('Les notes sont requises pour générer le bulletin.');
  }

  const doc = createPDF();

  // Déterminer le sous-titre
  let subtitle = '';
  if (semester) {
    subtitle = `${academicYear} - ${semester === 'FIRST' ? '1er' : '2ème'} Semestre`;
  } else if (term) {
    subtitle = `${academicYear} - ${term}`;
  } else {
    subtitle = academicYear;
  }

  const startY = addHeader(doc, 'BULLETIN DE NOTES', subtitle);
  let currentY = startY + 15;

  // Informations de l'élève
  doc.setFontSize(PDF_CONFIG.fonts.body);
  doc.setFont('helvetica', 'bold');
  doc.text('INFORMATIONS ÉLÈVE', PDF_CONFIG.margins.left, currentY);

  currentY += 8;
  doc.setFont('helvetica', 'normal');
  doc.text(`Nom: ${getStudentFullName(student)}`, PDF_CONFIG.margins.left, currentY);
  doc.text(`Matricule: ${getStudentMatricule(student)}`, 120, currentY);

  currentY += 6;
  doc.text(`Classe: ${student.className || 'N/A'}`, PDF_CONFIG.margins.left, currentY);
  doc.text(`Section: ${student.section || 'N/A'}`, 120, currentY);

  currentY += 15;

  // Tableau des notes
  const tableData = grades.map((grade: Grade) => {
    const gradeValue = grade.value !== undefined ? grade.value : grade.average || 0;
    const coefficient = grade.coefficient || 1;
    
    return [
      grade.subjectName,
      coefficient.toString(),
      grade.firstTerm?.toFixed(2) || '-',
      grade.secondTerm?.toFixed(2) || '-',
      grade.thirdTerm?.toFixed(2) || '-',
      formatGrade ? formatGrade(gradeValue) : gradeValue.toFixed(1),
      getGradeStatus ? getGradeStatus(gradeValue) : (gradeValue >= 10 ? 'Admis' : 'Échec')
    ];
  });

  // Calcul des totaux
  const totalPoints = grades.reduce((sum: number, grade: Grade) => {
    const gradeValue = grade.value !== undefined ? grade.value : grade.average || 0;
    const coefficient = grade.coefficient || 1;
    return sum + gradeValue * coefficient;
  }, 0);

  const totalCoefficients = grades.reduce((sum: number, grade: Grade) => {
    return sum + (grade.coefficient || 1);
  }, 0);

  const average = totalCoefficients > 0 ? (totalPoints / totalCoefficients) : 0;

  autoTable(doc, {
    head: [['Matière', 'Coef.', 'T1', 'T2', 'T3', 'Moyenne', 'Appréciation']],
    body: [
      ...tableData,
      [
        'MOYENNE GÉNÉRALE',
        totalCoefficients.toString(),
        '',
        '',
        '',
        formatGrade ? formatGrade(average) : average.toFixed(2),
        getGradeStatus ? getGradeStatus(average) : (average >= 10 ? 'ADMIS' : 'ÉCHEC')
      ]
    ],
    startY: currentY,
    margin: { left: PDF_CONFIG.margins.left, right: PDF_CONFIG.margins.right },
    styles: { fontSize: PDF_CONFIG.fonts.small, cellPadding: 3 },
    ...TABLE_STYLES,
    columnStyles: {
      1: { halign: 'center' },
      2: { halign: 'center' },
      3: { halign: 'center' },
      4: { halign: 'center' },
      5: { halign: 'center' },
      6: { halign: 'center' }
    },
    didParseCell: function (data) {
      if (data.row.index === tableData.length) {
        data.cell.styles.fillColor = [59, 130, 246];
        data.cell.styles.textColor = 255;
        data.cell.styles.fontStyle = 'bold';
      }
    }
  });

  currentY = (doc as any).lastAutoTable.finalY + 20;

  // Section observations
  doc.setFontSize(PDF_CONFIG.fonts.body);
  doc.setFont('helvetica', 'bold');
  doc.text('OBSERVATIONS', PDF_CONFIG.margins.left, currentY);

  currentY += 8;
  doc.setFont('helvetica', 'normal');

  let comment = '';
  if (average >= 16) {
    comment = 'Excellent travail. Continuez ainsi!';
  } else if (average >= 14) {
    comment = 'Très bon travail. Bon élève.';
  } else if (average >= 12) {
    comment = 'Bon travail. Peut mieux faire.';
  } else if (average >= 10) {
    comment = 'Travail satisfaisant. Doit faire des efforts.';
  } else {
    comment = "Travail insuffisant. Doit redoubler d'efforts.";
  }
  doc.text(comment, PDF_CONFIG.margins.left, currentY + 6);

  addFooter(doc);
  return doc;
};

/**
 * Générateur de reçu de paiement unifié
 */
export const generatePaymentReceipt = (payment: Payment, student: Student): jsPDF => {
  if (!payment.amount || payment.amount <= 0) {
    throw new Error('Le montant du paiement doit être spécifié et positif.');
  }

  const doc = createPDF();
  const startY = addHeader(doc, 'REÇU DE PAIEMENT', `N° ${payment.id || 'XXXX'}`);
  let currentY = startY + 15;

  // Informations du paiement
  doc.setFontSize(PDF_CONFIG.fonts.body);
  doc.setFont('helvetica', 'bold');
  doc.text('DÉTAILS DU PAIEMENT', PDF_CONFIG.margins.left, currentY);

  currentY += 10;
  doc.setFont('helvetica', 'normal');

  const paymentData = [
    ['Date de paiement', getPaymentDate(payment)],
    ['Élève', getStudentFullName(student)],
    ['Matricule', getStudentMatricule(student)],
    ['Classe', student.className || 'N/A'],
    ['Type de paiement', payment.paymentType || 'N/A'],
    ['Montant', formatCurrency(payment.amount)],
    ['Mode de paiement', getPaymentMethod(payment)],
    ['Description', payment.description || 'N/A'],
    ['Statut', payment.status === 'PAID' ? 'Payé' : payment.status === 'PENDING' ? 'En attente' : payment.status || 'N/A']
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

  // Montant en lettres
  doc.setFont('helvetica', 'bold');
  doc.text('Montant en lettres:', PDF_CONFIG.margins.left, currentY);
  doc.setFont('helvetica', 'normal');
  doc.text(`${formatCurrency(payment.amount)} (${payment.amount} Francs CFA)`, PDF_CONFIG.margins.left, currentY + 7);

  addFooter(doc);
  return doc;
};

/**
 * Générateur de liste de classe unifié
 */
export const generateClassList = (classInfo: ClassInfo, students: Student[]): jsPDF => {
  const doc = createPDF();
  const startY = addHeader(doc, 'LISTE DE CLASSE', `${classInfo.name} - ${classInfo.academicYear}`);
  let currentY = startY + 10;

  // Informations de la classe
  doc.setFontSize(PDF_CONFIG.fonts.body);
  doc.setFont('helvetica', 'normal');
  doc.text(`Section: ${classInfo.section || 'N/A'}`, PDF_CONFIG.margins.left, currentY);
  doc.text(`Langue: ${classInfo.language || 'N/A'}`, 120, currentY);
  doc.text(`Effectif: ${students.length}`, 160, currentY);

  currentY += 15;

  // Tableau des élèves
  if (students && students.length > 0) {
    const tableData = students.map((student: Student, index: number) => [
      (index + 1).toString(),
      getStudentMatricule(student),
      getStudentFullName(student),
      getStudentBirthDate(student),
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
        0: { cellWidth: 15, halign: 'center' },
        1: { cellWidth: 30, halign: 'center' },
        2: { cellWidth: 60 },
        3: { cellWidth: 35, halign: 'center' },
        4: { cellWidth: 40, halign: 'center' }
      }
    });
  }

  addFooter(doc);
  return doc;
};

/**
 * Générateur de rapport financier unifié
 */
export const generateFinancialReport = (payments: Payment[], startDate: string, endDate: string): jsPDF => {
  const doc = createPDF('landscape');
  const startY = addHeader(doc, 'RAPPORT FINANCIER', `Période: ${formatDate(startDate)} - ${formatDate(endDate)}`);
  let currentY = startY + 15;

  if (payments && payments.length > 0) {
    // Calcul des totaux par type de paiement
    const totals = payments.reduce((acc: any, payment: Payment) => {
      const type = payment.paymentType || 'OTHER';
      acc[type] = (acc[type] || 0) + (payment.amount || 0);
      acc.total = (acc.total || 0) + (payment.amount || 0);
      return acc;
    }, { total: 0 });

    // Tableau de résumé
    doc.setFontSize(PDF_CONFIG.fonts.body);
    doc.setFont('helvetica', 'bold');
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

    // Tableau détaillé des paiements
    doc.setFont('helvetica', 'bold');
    doc.text('DÉTAIL DES PAIEMENTS', PDF_CONFIG.margins.left, currentY);

    currentY += 10;

    const detailData = payments.map((payment: Payment) => [
      getPaymentDate(payment),
      payment.studentName || 'N/A',
      payment.paymentType || 'N/A',
      formatCurrency(payment.amount),
      getPaymentMethod(payment),
      payment.status === 'PAID' ? 'Payé' : payment.status === 'PENDING' ? 'En attente' : payment.status || 'N/A'
    ]);

    autoTable(doc, {
      head: [['Date', 'Élève', 'Type', 'Montant', 'Mode', 'Statut']],
      body: detailData,
      startY: currentY,
      margin: { left: PDF_CONFIG.margins.left, right: PDF_CONFIG.margins.right },
      styles: { fontSize: PDF_CONFIG.fonts.small, cellPadding: 2 },
      ...TABLE_STYLES,
      columnStyles: {
        0: { cellWidth: 30, halign: 'center' },
        1: { cellWidth: 50 },
        2: { cellWidth: 35 },
        3: { cellWidth: 30, halign: 'right' },
        4: { cellWidth: 25, halign: 'center' },
        5: { cellWidth: 25, halign: 'center' }
      }
    });
  }

  addFooter(doc);
  return doc;
};

/**
 * Générateur de rapport disciplinaire unifié
 */
export const generateDisciplineReport = (
  student: Student, 
  records: DisciplineRecord[], 
  startDate?: string, 
  endDate?: string
): jsPDF => {
  const doc = createPDF();
  
  let subtitle = '';
  if (startDate && endDate) {
    subtitle = `Période: ${formatDate(startDate)} - ${formatDate(endDate)}`;
  }
  
  const startY = addHeader(doc, 'RAPPORT DISCIPLINAIRE', subtitle);
  let currentY = startY + 15;

  // Informations de l'élève
  doc.setFontSize(PDF_CONFIG.fonts.body);
  doc.setFont('helvetica', 'bold');
  doc.text('INFORMATIONS ÉLÈVE', PDF_CONFIG.margins.left, currentY);

  currentY += 8;
  doc.setFont('helvetica', 'normal');
  doc.text(`Nom: ${getStudentFullName(student)}`, PDF_CONFIG.margins.left, currentY);
  doc.text(`Matricule: ${getStudentMatricule(student)}`, 120, currentY);

  currentY += 6;
  doc.text(`Classe: ${student.className || 'N/A'}`, PDF_CONFIG.margins.left, currentY);
  doc.text(`Année scolaire: ${student.academicYear || 'N/A'}`, 120, currentY);

  currentY += 15;

  // Tableau des incidents
  if (records && records.length > 0) {
    const tableData = records.map((record: DisciplineRecord) => [
      formatDate(record.date),
      record.type,
      record.reason,
      record.action,
      record.resolved ? 'Résolu' : 'En cours'
    ]);

    autoTable(doc, {
      head: [['Date', 'Type', 'Motif', 'Action', 'Statut']],
      body: tableData,
      startY: currentY,
      margin: { left: PDF_CONFIG.margins.left, right: PDF_CONFIG.margins.right },
      styles: { fontSize: PDF_CONFIG.fonts.small, cellPadding: 3 },
      ...TABLE_STYLES,
      columnStyles: {
        0: { cellWidth: 25, halign: 'center' },
        1: { cellWidth: 30, halign: 'center' },
        2: { cellWidth: 50 },
        3: { cellWidth: 50 },
        4: { cellWidth: 25, halign: 'center' }
      }
    });

    currentY = (doc as any).lastAutoTable.finalY + 20;

    // Statistiques
    const totalIncidents = records.length;
    const resolvedIncidents = records.filter(r => r.resolved).length;
    const pendingIncidents = totalIncidents - resolvedIncidents;

    doc.setFont('helvetica', 'bold');
    doc.text('STATISTIQUES', PDF_CONFIG.margins.left, currentY);

    currentY += 8;
    doc.setFont('helvetica', 'normal');
    doc.text(`Total incidents: ${totalIncidents}`, PDF_CONFIG.margins.left, currentY);
    doc.text(`Incidents résolus: ${resolvedIncidents}`, PDF_CONFIG.margins.left, currentY + 6);
    doc.text(`Incidents en cours: ${pendingIncidents}`, PDF_CONFIG.margins.left, currentY + 12);
  }

  addFooter(doc);
  return doc;
};

// Fonctions de génération avec téléchargement automatique
export const generateBulletinPDF = (
  student: Student,
  grades: Grade[],
  term: string = 'Trimestre 1'
): void => {
  const doc = generateBulletin(student, grades, student.academicYear || '', undefined, term);
  const fileName = `bulletin_${student.lastName}_${student.firstName}_${term.replace(/\s+/g, '_')}.pdf`;
  doc.save(fileName);
};

export const generatePaymentReportPDF = (student: Student, payments: Payment[]): void => {
  const doc = generateFinancialReport(payments, '', '');
  const fileName = `paiements_${student.lastName}_${student.firstName}.pdf`;
  doc.save(fileName);
};

export const generateDisciplineReportPDF = (student: Student, records: DisciplineRecord[]): void => {
  const doc = generateDisciplineReport(student, records);
  const fileName = `discipline_${student.lastName}_${student.firstName}.pdf`;
  doc.save(fileName);
};

export const generateStudentListPDF = (students: Student[], className?: string): void => {
  const classInfo: ClassInfo = {
    name: className || 'Toutes les classes',
    academicYear: students[0]?.academicYear || new Date().getFullYear().toString(),
    section: 'Toutes les sections'
  };
  
  const doc = generateClassList(classInfo, students);
  const fileName = className ? `liste_eleves_${className.replace(/\s+/g, '_')}.pdf` : 'liste_eleves.pdf';
  doc.save(fileName);
};