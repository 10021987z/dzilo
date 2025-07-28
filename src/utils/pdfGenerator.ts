import { jsPDF } from 'jspdf';
import 'jspdf-autotable';

declare module 'jspdf' {
  interface jsPDF {
    autoTable: (options: any) => jsPDF;
  }
}

export interface PayrollPDFData {
  employee: {
    name: string;
    position: string;
    employeeId: string;
    department: string;
  };
  period: string;
  salary: {
    base: number;
    overtime: number;
    bonuses: number;
    deductions: number;
    gross: number;
    taxes: number;
    socialCharges: number;
    net: number;
  };
  workingDetails: {
    workingDays: number;
    absenceDays: number;
    overtimeHours: number;
  };
  company: {
    name: string;
    address: string;
    siret: string;
    logo?: string;
  };
}

export interface ContractPDFData {
  title: string;
  client: {
    name: string;
    email: string;
    address?: string;
  };
  contract: {
    type: string;
    value: number;
    startDate: string;
    endDate: string;
    description: string;
    terms: string[];
  };
  company: {
    name: string;
    address: string;
    siret: string;
    logo?: string;
  };
}

export interface InvoicePDFData {
  invoice: {
    number: string;
    date: string;
    dueDate: string;
    status: string;
  };
  client: {
    name: string;
    email: string;
    address?: string;
    phone?: string;
  };
  items: Array<{
    description: string;
    quantity: number;
    unitPrice: number;
    taxRate: number;
    total: number;
  }>;
  totals: {
    subtotal: number;
    taxTotal: number;
    total: number;
  };
  notes?: string;
  paymentInfo?: {
    method: string;
    details: string;
  };
  company: {
    name: string;
    address: string;
    siret: string;
    logo?: string;
    phone?: string;
    email?: string;
    website?: string;
    vatNumber?: string;
  };
}

export class PDFGenerator {
  private static addHeader(doc: jsPDF, title: string, companyInfo: any) {
    // Add company logo if available
    if (companyInfo.logo) {
      try {
        doc.addImage(companyInfo.logo, 'JPEG', 20, 15, 30, 20);
      } catch (e) {
        console.error('Error adding logo to PDF:', e);
        // Fallback to colored rectangle if logo can't be added
        doc.setFillColor(59, 130, 246);
        doc.rect(20, 15, 30, 20, 'F');
        doc.setTextColor(255, 255, 255);
        doc.setFontSize(16);
        doc.setFont('helvetica', 'bold');
        doc.text(companyInfo.name.substring(0, 1), 35, 28);
      }
    } else {
      // Logo placeholder
      doc.setFillColor(59, 130, 246);
      doc.rect(20, 15, 30, 20, 'F');
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(16);
      doc.setFont('helvetica', 'bold');
      doc.text(companyInfo.name.substring(0, 1), 35, 28);
    }

    // Company info
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(12);
    doc.setFont('helvetica', 'normal');
    doc.text(companyInfo.name, 60, 20);
    doc.setFontSize(10);
    doc.text(companyInfo.address, 60, 26);
    doc.text(`SIRET: ${companyInfo.siret}`, 60, 32);

    // Title
    doc.setFontSize(18);
    doc.setFont('helvetica', 'bold');
    doc.text(title, 20, 50);

    // Date
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text(`Généré le ${new Date().toLocaleDateString('fr-FR')}`, 150, 50);

    return 60; // Return Y position for content start
  }

  private static addFooter(doc: jsPDF, pageNumber: number = 1, totalPages: number = 1) {
    const pageHeight = doc.internal.pageSize.height;
    doc.setFontSize(8);
    doc.setTextColor(128, 128, 128);
    doc.text('Document généré par dziljo - Gestion PME Intégrée', 20, pageHeight - 10);
    doc.text(`Page ${pageNumber}/${totalPages}`, 180, pageHeight - 10);
  }

  static generatePayrollPDF(data: PayrollPDFData): void {
    const doc = new jsPDF();
    
    // Header
    const startY = this.addHeader(doc, `Fiche de Paie - ${data.period}`, data.company);

    // Employee info
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('Informations Employé', 20, startY + 10);
    
    doc.autoTable({
      startY: startY + 15,
      head: [['Champ', 'Valeur']],
      body: [
        ['Nom', data.employee.name],
        ['Poste', data.employee.position],
        ['ID Employé', data.employee.employeeId],
        ['Département', data.employee.department],
        ['Période', data.period]
      ],
      theme: 'grid',
      headStyles: { fillColor: [59, 130, 246] },
      margin: { left: 20, right: 20 }
    });

    // Salary breakdown
    const salaryStartY = doc.lastAutoTable.finalY + 20;
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('Détail de la Rémunération', 20, salaryStartY);

    doc.autoTable({
      startY: salaryStartY + 5,
      head: [['Élément', 'Montant (€)']],
      body: [
        ['Salaire de base', data.salary.base.toFixed(2)],
        ['Heures supplémentaires', data.salary.overtime.toFixed(2)],
        ['Primes et bonus', data.salary.bonuses.toFixed(2)],
        ['Déductions', `-${data.salary.deductions.toFixed(2)}`],
        ['TOTAL BRUT', data.salary.gross.toFixed(2)],
        ['Impôts sur le revenu', `-${data.salary.taxes.toFixed(2)}`],
        ['Cotisations sociales', `-${data.salary.socialCharges.toFixed(2)}`],
        ['NET À PAYER', data.salary.net.toFixed(2)]
      ],
      theme: 'grid',
      headStyles: { fillColor: [59, 130, 246] },
      bodyStyles: {
        0: { fontStyle: 'normal' },
        1: { fontStyle: 'normal' },
        2: { fontStyle: 'normal' },
        3: { fontStyle: 'normal', textColor: [220, 38, 38] },
        4: { fontStyle: 'bold', fillColor: [243, 244, 246] },
        5: { fontStyle: 'normal', textColor: [220, 38, 38] },
        6: { fontStyle: 'normal', textColor: [220, 38, 38] },
        7: { fontStyle: 'bold', fillColor: [34, 197, 94], textColor: [255, 255, 255] }
      },
      margin: { left: 20, right: 20 }
    });

    // Working details
    const workingStartY = doc.lastAutoTable.finalY + 20;
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('Détails de Présence', 20, workingStartY);

    doc.autoTable({
      startY: workingStartY + 5,
      head: [['Détail', 'Valeur']],
      body: [
        ['Jours travaillés', data.workingDetails.workingDays.toString()],
        ['Jours d\'absence', data.workingDetails.absenceDays.toString()],
        ['Heures supplémentaires', `${data.workingDetails.overtimeHours}h`]
      ],
      theme: 'grid',
      headStyles: { fillColor: [59, 130, 246] },
      margin: { left: 20, right: 20 }
    });

    // Footer
    this.addFooter(doc);

    // Save
    doc.save(`Fiche_Paie_${data.employee.name.replace(/\s+/g, '_')}_${data.period}.pdf`);
  }

  static generateContractPDF(data: ContractPDFData): void {
    const doc = new jsPDF();
    
    // Header
    const startY = this.addHeader(doc, data.title, data.company);

    // Contract details
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('Détails du Contrat', 20, startY + 10);
    
    doc.autoTable({
      startY: startY + 15,
      head: [['Champ', 'Valeur']],
      body: [
        ['Client', data.client.name],
        ['Email', data.client.email],
        ['Type de contrat', data.contract.type],
        ['Valeur', `${data.contract.value.toLocaleString()} €`],
        ['Date de début', data.contract.startDate],
        ['Date de fin', data.contract.endDate]
      ],
      theme: 'grid',
      headStyles: { fillColor: [59, 130, 246] },
      margin: { left: 20, right: 20 }
    });

    // Description
    const descStartY = doc.lastAutoTable.finalY + 20;
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('Description', 20, descStartY);
    
    doc.setFontSize(11);
    doc.setFont('helvetica', 'normal');
    const splitDescription = doc.splitTextToSize(data.contract.description, 170);
    doc.text(splitDescription, 20, descStartY + 10);

    // Terms
    const termsStartY = descStartY + 10 + (splitDescription.length * 5) + 15;
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('Conditions', 20, termsStartY);

    doc.setFontSize(11);
    doc.setFont('helvetica', 'normal');
    data.contract.terms.forEach((term, index) => {
      doc.text(`${index + 1}. ${term}`, 25, termsStartY + 10 + (index * 8));
    });

    // Footer
    this.addFooter(doc);

    // Save
    doc.save(`Contrat_${data.client.name.replace(/\s+/g, '_')}.pdf`);
  }

  static generateInvoicePDF(data: InvoicePDFData): void {
    const doc = new jsPDF();
    
    const pageWidth = doc.internal.pageSize.width;
    const pageHeight = doc.internal.pageSize.height;
    
    // Colors
    const primaryColor = [59, 130, 246]; // Blue
    const secondaryColor = [71, 85, 105]; // Slate
    const lightGray = [248, 250, 252]; // Light background
    
    // Header background
    doc.setFillColor(...lightGray);
    doc.rect(0, 0, pageWidth, 60, 'F');
    
    // Company logo and info section
    let yPos = 25;
    if (data.company.logo) {
      try {
        doc.addImage(data.company.logo, 'JPEG', 20, 15, 40, 25);
      } catch (e) {
        console.error('Error adding logo to PDF:', e);
        // Fallback logo
        doc.setFillColor(...primaryColor);
        doc.rect(20, 15, 40, 25, 'F');
        doc.setTextColor(255, 255, 255);
        doc.setFontSize(18);
        doc.setFont('helvetica', 'bold');
        doc.text(data.company.name.substring(0, 1), 40, 32);
      }
    } else {
      // Default logo placeholder
      doc.setFillColor(...primaryColor);
      doc.rect(20, 15, 40, 25, 'F');
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(18);
      doc.setFont('helvetica', 'bold');
      doc.text(data.company.name.substring(0, 1), 40, 32);
    }
    
    // Company information
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text(data.company.name, 70, 25);
    
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(...secondaryColor);
    doc.text(data.company.address, 70, 32);
    
    if (data.company.phone) {
      doc.text(`Tél: ${data.company.phone}`, 70, 38);
    }
    
    if (data.company.email) {
      doc.text(`Email: ${data.company.email}`, 70, 44);
    }
    
    if (data.company.website) {
      doc.text(`Web: ${data.company.website}`, 70, 50);
    }
    
    doc.text(`SIRET: ${data.company.siret}`, 70, 56);
    
    if (data.company.vatNumber) {
      doc.text(`TVA: ${data.company.vatNumber}`, 140, 56);
    }

    // Invoice title - large and prominent
    doc.setFontSize(24);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(0, 0, 0);
    doc.text(`FACTURE N° ${data.invoice.number}`, 20, 80);

    // Two-column layout for invoice info and client info
    const leftColumnX = 20;
    const rightColumnX = 110;
    const sectionY = 95;
    
    // Invoice information section
    doc.setFillColor(...lightGray);
    doc.rect(leftColumnX, sectionY, 85, 35, 'F');
    
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(0, 0, 0);
    doc.text('Informations Facture', leftColumnX + 5, sectionY + 10);
    
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(...secondaryColor);
    doc.text(`Date: ${data.invoice.date}`, leftColumnX + 5, sectionY + 18);
    doc.text(`Échéance: ${data.invoice.dueDate}`, leftColumnX + 5, sectionY + 24);
    doc.text(`Statut: ${data.invoice.status}`, leftColumnX + 5, sectionY + 30);
    
    // Client information section
    doc.setFillColor(...lightGray);
    doc.rect(rightColumnX, sectionY, 85, 35, 'F');
    
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(0, 0, 0);
    doc.text('Facturer à', rightColumnX + 5, sectionY + 10);
    
    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.text(`${data.client.name}`, rightColumnX + 5, sectionY + 18);
    
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(...secondaryColor);
    if (data.client.address) {
      doc.text(`${data.client.address}`, rightColumnX + 5, sectionY + 24);
    }
    doc.text(`Email: ${data.client.email}`, rightColumnX + 5, sectionY + 30);
    if (data.client.phone) {
      doc.text(`Tél: ${data.client.phone}`, rightColumnX + 5, sectionY + 36);
    }

    // Invoice items section
    const itemsStartY = 145;
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(0, 0, 0);
    doc.text('Détail des Prestations', 20, itemsStartY);

    const tableBody = data.items.map(item => [
      item.description,
      item.quantity.toString(),
      `${item.unitPrice.toFixed(2)} €`,
      `${item.taxRate}%`,
      `${item.total.toFixed(2)} €`
    ]);

    // Enhanced table styling
    doc.autoTable({
      startY: itemsStartY + 5,
      head: [['Description', 'Quantité', 'Prix Unitaire', 'TVA', 'Total']],
      body: tableBody,
      theme: 'striped',
      headStyles: { 
        fillColor: primaryColor,
        textColor: [255, 255, 255],
        fontSize: 11,
        fontStyle: 'bold'
      },
      margin: { left: 20, right: 20 },
      columnStyles: {
        0: { cellWidth: 'auto' },
        1: { cellWidth: 20, halign: 'center' },
        2: { cellWidth: 30, halign: 'right' },
        3: { cellWidth: 20, halign: 'center' },
        4: { cellWidth: 30, halign: 'right' }
      },
      bodyStyles: {
        fontSize: 10,
        cellPadding: 5
      },
      alternateRowStyles: { fillColor: [249, 250, 251] }
    });

    // Totals
    const totalsY = doc.lastAutoTable.finalY + 10;
    
    doc.autoTable({
      startY: totalsY,
      head: [['', '']],
      body: [
        ['Sous-total', `${data.totals.subtotal.toFixed(2)} €`],
        ['TVA', `${data.totals.taxTotal.toFixed(2)} €`],
        ['TOTAL', `${data.totals.total.toFixed(2)} €`]
      ],
      theme: 'grid',
      showHead: false,
      styles: { 
        fontSize: 11,
        cellPadding: 4
      },
      columnStyles: {
        0: { cellWidth: 130, fontStyle: 'bold', halign: 'right' },
        1: { cellWidth: 40, halign: 'right', fontStyle: 'bold' }
      },
      margin: { left: 110, right: 20 },
      bodyStyles: {
        2: { 
          fillColor: primaryColor,
          textColor: [255, 255, 255],
          fontStyle: 'bold',
          fontSize: 12
        }
      }
    });

    // Payment information
    if (data.paymentInfo) {
      const paymentY = doc.lastAutoTable.finalY + 15;
      doc.setFontSize(12);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(0, 0, 0);
      doc.text('Informations de Paiement', 20, paymentY);
      
      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(...secondaryColor);
      
      // Payment info in a box
      doc.text(`Méthode de paiement: ${data.paymentInfo.method}`, 20, paymentY + 10);
      doc.text(`${data.paymentInfo.details}`, 20, paymentY + 15);
    }

    // Notes
    if (data.notes) {
      const notesY = doc.lastAutoTable.finalY + 20;
      doc.setFontSize(12);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(0, 0, 0);
      doc.text('Notes', 20, notesY);
      
      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(...secondaryColor);
      const splitNotes = doc.splitTextToSize(data.notes, 170);
      doc.text(splitNotes, 20, notesY + 10);
    }

    // Footer
    this.addFooter(doc);

    // Add a subtle border around the entire document
    doc.setDrawColor(...secondaryColor);
    doc.setLineWidth(0.5);
    doc.rect(10, 10, pageWidth - 20, pageHeight - 20);
    
    // Add page number
    doc.setFontSize(8);
    doc.setTextColor(...secondaryColor);
    doc.text(`Page 1`, pageWidth - 30, pageHeight - 10);

    // Save
    doc.save(`Facture_${data.invoice.number.replace(/\s+/g, '_')}.pdf`);
  }

  static generateEmployeeListPDF(employees: any[]): void {
    const doc = new jsPDF();
    
    // Header
    const startY = this.addHeader(doc, 'Liste des Employés', {
      name: 'dziljo SaaS',
      address: '123 Rue de la Tech, 75001 Paris',
      siret: '12345678901234'
    });

    // Employee table
    const tableData = employees.map(emp => [
      emp.firstName + ' ' + emp.lastName,
      emp.position,
      emp.department,
      emp.email,
      emp.startDate,
      emp.status === 'active' ? 'Actif' : 'Inactif'
    ]);

    doc.autoTable({
      startY: startY + 10,
      head: [['Nom', 'Poste', 'Département', 'Email', 'Date d\'embauche', 'Statut']],
      body: tableData,
      theme: 'grid',
      headStyles: { fillColor: [59, 130, 246] },
      margin: { left: 10, right: 10 },
      styles: { fontSize: 9 }
    });

    // Footer
    this.addFooter(doc);

    // Save
    doc.save(`Liste_Employes_${new Date().toISOString().split('T')[0]}.pdf`);
  }
}