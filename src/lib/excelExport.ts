import XLSX from 'xlsx-js-style';

export interface ExcelColumn {
  header: string;
  key: string;
  width?: number; // optional manual override, otherwise auto-calculated
  align?: 'left' | 'center' | 'right';
  format?: string; // e.g. '#,##0' for currency
}

export interface ExportExcelOptions {
  fileName: string; // without extension
  sheetName?: string;
  title?: string;
  subtitle?: string;
  institution?: string;
  columns: ExcelColumn[];
  data: Record<string, any>[];
}

/**
 * Generates and downloads a beautifully formatted, auto-fit Microsoft Excel (.xlsx) file.
 */
export function exportToExcel({
  fileName,
  sheetName = 'Data',
  title,
  subtitle,
  institution = 'Yayasan Pendidikan Imam Bonjol Majalengka',
  columns,
  data,
}: ExportExcelOptions) {
  const wb = XLSX.utils.book_new();

  const headerRows: any[][] = [];
  let dataStartRow = 0;

  // Add official header banner if title is provided
  if (title) {
    headerRows.push([institution.toUpperCase()]);
    headerRows.push([title.toUpperCase()]);
    if (subtitle) {
      headerRows.push([subtitle]);
    }
    headerRows.push([`Dicetak pada: ${new Date().toLocaleDateString('id-ID', { dateStyle: 'full' })}`]);
    headerRows.push([]); // blank separator row
    dataStartRow = headerRows.length;
  }

  // Column header row
  const tableHeaders = columns.map((c) => c.header);
  headerRows.push(tableHeaders);

  // Data rows
  const dataRows = data.map((item, rowIdx) => {
    return columns.map((col) => {
      let val = item[col.key];
      if (val === undefined || val === null) return '-';
      if (typeof val === 'boolean') return val ? 'Ya' : 'Tidak';
      return val;
    });
  });

  const allRows = [...headerRows, ...dataRows];
  const ws = XLSX.utils.aoa_to_sheet(allRows);

  // Calculate Auto-fit column widths so NOTHING gets cut off in Excel
  const colWidths = columns.map((col, colIdx) => {
    if (col.width) return { wch: col.width };

    let maxLength = col.header ? col.header.length : 10;
    data.forEach((item) => {
      const val = item[col.key];
      if (val !== undefined && val !== null) {
        const strVal = String(val);
        if (strVal.length > maxLength) {
          maxLength = strVal.length;
        }
      }
    });

    // Add generous padding so text never touches cell boundaries or truncates
    // Cap at reasonable max (e.g. 60) for long text like addresses/notes
    const calculatedWidth = Math.min(Math.max(maxLength + 4, 12), 60);
    return { wch: calculatedWidth };
  });

  ws['!cols'] = colWidths;

  // Style definitions
  const borderThin = {
    top: { style: 'thin', color: { rgb: 'CBD5E1' } },
    bottom: { style: 'thin', color: { rgb: 'CBD5E1' } },
    left: { style: 'thin', color: { rgb: 'CBD5E1' } },
    right: { style: 'thin', color: { rgb: 'CBD5E1' } },
  };

  const headerStyle = {
    font: { name: 'Calibri', sz: 11, bold: true, color: { rgb: 'FFFFFF' } },
    fill: { fgColor: { rgb: '184F48' } }, // Al-Afiyah deep islamic teal
    alignment: { vertical: 'center', horizontal: 'center', wrapText: true },
    border: borderThin,
  };

  const bannerTitleStyle = {
    font: { name: 'Calibri', sz: 13, bold: true, color: { rgb: '184F48' } },
    alignment: { vertical: 'center', horizontal: 'left' },
  };

  const bannerSubStyle = {
    font: { name: 'Calibri', sz: 10, italic: true, color: { rgb: '64748B' } },
    alignment: { vertical: 'center', horizontal: 'left' },
  };

  // Apply styles to banner rows if present
  if (title) {
    const range = XLSX.utils.decode_range(ws['!ref'] || 'A1:A1');
    for (let r = 0; r < dataStartRow - 1; r++) {
      const cellRef = XLSX.utils.encode_cell({ r, c: 0 });
      if (ws[cellRef]) {
        ws[cellRef].s = r <= 1 ? bannerTitleStyle : bannerSubStyle;
      }
    }
  }

  // Apply styles to table header row
  const tableHeaderRowIndex = dataStartRow;
  columns.forEach((_, colIdx) => {
    const cellRef = XLSX.utils.encode_cell({ r: tableHeaderRowIndex, c: colIdx });
    if (ws[cellRef]) {
      ws[cellRef].s = headerStyle;
    }
  });

  // Apply styles to data rows (clean zebra striping, borders, and proper alignment)
  const firstDataRowIndex = tableHeaderRowIndex + 1;
  data.forEach((_, rIdx) => {
    const currentRow = firstDataRowIndex + rIdx;
    const isEven = rIdx % 2 === 1;
    const rowBgColor = isEven ? 'F8FAFC' : 'FFFFFF'; // subtle alternating row

    columns.forEach((col, cIdx) => {
      const cellRef = XLSX.utils.encode_cell({ r: currentRow, c: cIdx });
      if (ws[cellRef]) {
        const align = col.align || 'left';
        ws[cellRef].s = {
          font: { name: 'Calibri', sz: 10, color: { rgb: '0F172A' } },
          fill: { fgColor: { rgb: rowBgColor } },
          alignment: { vertical: 'center', horizontal: align, wrapText: true },
          border: borderThin,
        };

        // Format numeric values if specified
        if (col.format && typeof ws[cellRef].v === 'number') {
          ws[cellRef].z = col.format;
        }
      }
    });
  });

  // Add merges for title banner if present
  if (title) {
    const lastColIndex = Math.max(columns.length - 1, 3);
    ws['!merges'] = [
      { s: { r: 0, c: 0 }, e: { r: 0, c: lastColIndex } },
      { s: { r: 1, c: 0 }, e: { r: 1, c: lastColIndex } },
      { s: { r: 2, c: 0 }, e: { r: 2, c: lastColIndex } },
      { s: { r: 3, c: 0 }, e: { r: 3, c: lastColIndex } },
    ];
  }

  // Set row heights for a comfortable, spacious look
  const rowHeights: { hpt: number }[] = [];
  for (let i = 0; i <= allRows.length; i++) {
    if (title && i < dataStartRow - 1) {
      rowHeights.push({ hpt: 22 });
    } else if (title && i === dataStartRow - 1) {
      rowHeights.push({ hpt: 12 }); // blank row
    } else if (i === tableHeaderRowIndex) {
      rowHeights.push({ hpt: 30 }); // tall spacious header
    } else {
      rowHeights.push({ hpt: 22 }); // comfortable data row height
    }
  }
  ws['!rows'] = rowHeights;

  XLSX.utils.book_append_sheet(wb, ws, sheetName);

  // Bulletproof download in browser as real .xlsx
  if (typeof window !== 'undefined') {
    const wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    const blob = new Blob([wbout], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${fileName}.xlsx`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  } else {
    XLSX.writeFile(wb, `${fileName}.xlsx`);
  }
}
