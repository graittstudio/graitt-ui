/**
 * Excel/PDF-export voor kostenboekingen. `xlsx` en `jspdf` zijn optionele
 * peer dependencies - dynamisch geïmporteerd zodat een app die deze module
 * niet gebruikt ze niet in de bundel krijgt (zelfde patroon als
 * TravelCampGo's src/routes/kosten.index.tsx).
 */

export interface ExportRecord {
  datum: string;
  categorieLabel: string;
  bedrag: number;
  omschrijving?: string;
}

export async function exporteerExcel(records: ExportRecord[], bestandsnaam: string): Promise<void> {
  const XLSX = await import("xlsx");
  const rows = records.map((r) => ({
    Datum: r.datum,
    Categorie: r.categorieLabel,
    Bedrag: r.bedrag,
    Omschrijving: r.omschrijving ?? "",
  }));
  const ws = XLSX.utils.json_to_sheet(rows);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Kosten");
  XLSX.writeFile(wb, `${bestandsnaam}.xlsx`);
}

export async function exporteerPdf(records: ExportRecord[], titel: string, bestandsnaam: string): Promise<void> {
  const { default: jsPDF } = await import("jspdf");
  const doc = new jsPDF();
  doc.setFontSize(16);
  doc.text(titel, 14, 18);
  doc.setFontSize(10);
  let y = 30;
  for (const r of records) {
    doc.text(
      `${r.datum}  ${r.categorieLabel.padEnd(14)}  € ${r.bedrag.toFixed(2)}  ${r.omschrijving ?? ""}`.slice(0, 90),
      14,
      y,
    );
    y += 6;
    if (y > 270) {
      doc.addPage();
      y = 20;
    }
  }
  doc.setFontSize(12);
  const totaal = records.reduce((s, r) => s + r.bedrag, 0);
  doc.text(`Totaal: € ${totaal.toFixed(2)}`, 14, y + 6);
  doc.save(`${bestandsnaam}.pdf`);
}
