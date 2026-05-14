import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { Workbook, SpreadsheetFile } from "@oai/artifact-tool";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const outputPath = path.join(__dirname, "Cronograma_CaniVet.xlsx");
const previewDir = path.join(__dirname, "cronograma_preview");

const groups = [
  {
    phase: "FASE 1",
    label: "Analisis y Planificacion",
    color: "#EAF2FF",
    items: [
      ["1.1", "Levantamiento de requerimientos", "Desarrollador", "Completado", 1, 1],
      ["1.2", "Definicion del problema y alcance", "Desarrollador", "Completado", 1, 1],
      ["1.3", "Identificacion de actores y necesidades", "Desarrollador", "Completado", 1, 1],
      ["1.4", "Definicion de objetivos generales y especificos", "Desarrollador", "Completado", 1, 1],
      ["1.5", "Analisis de requerimientos funcionales", "Desarrollador", "Completado", 1, 2],
      ["1.6", "Analisis de requerimientos no funcionales", "Desarrollador", "Completado", 1, 2],
    ],
  },
  {
    phase: "FASE 2",
    label: "Diseno y Arquitectura",
    color: "#EAF7EE",
    items: [
      ["2.1", "Diseno del modelo de datos base", "Desarrollador", "Completado", 2, 2],
      ["2.2", "Estructura de carpetas frontend y backend", "Desarrollador", "Completado", 2, 2],
      ["2.3", "Definicion de arquitectura desacoplada", "Desarrollador", "Completado", 2, 2],
      ["2.4", "Diseno de interfaces administrativas", "Desarrollador", "Completado", 2, 3],
      ["2.5", "Diseno de flujo de autenticacion y sesiones", "Desarrollador", "Completado", 3, 3],
    ],
  },
  {
    phase: "FASE 3",
    label: "Configuracion del Entorno",
    color: "#FFF7E8",
    items: [
      ["3.1", "Configuracion del proyecto React + Vite", "Desarrollador", "Completado", 3, 3],
      ["3.2", "Configuracion del backend Flask", "Desarrollador", "Completado", 3, 3],
      ["3.3", "Configuracion de Supabase y servicios base", "Desarrollador", "Completado", 3, 4],
      ["3.4", "Configuracion de variables de entorno", "Desarrollador", "Completado", 3, 4],
    ],
  },
  {
    phase: "FASE 4",
    label: "Autenticacion y Seguridad",
    color: "#F3EEFF",
    items: [
      ["4.1", "Modulo de registro de usuarios", "Desarrollador", "Completado", 4, 4],
      ["4.2", "Inicio de sesion y persistencia de usuario", "Desarrollador", "Completado", 4, 4],
      ["4.3", "Rutas protegidas y redireccionamiento", "Desarrollador", "Completado", 4, 4],
      ["4.4", "Roles, permisos y control de acceso", "Desarrollador", "Completado", 4, 4],
    ],
  },
  {
    phase: "FASE 5",
    label: "Modulos Base del Sistema",
    color: "#FFF2F2",
    items: [
      ["5.1", "CRUD de clientes", "Desarrollador", "Completado", 4, 5],
      ["5.2", "CRUD de mascotas", "Desarrollador", "Completado", 5, 5],
      ["5.3", "CRUD de citas", "Desarrollador", "Completado", 5, 5],
      ["5.4", "CRUD de servicios", "Desarrollador", "Completado", 5, 5],
      ["5.5", "CRUD de pagos", "Desarrollador", "Completado", 5, 6],
      ["5.6", "CRUD de inventario", "Desarrollador", "Completado", 6, 6],
    ],
  },
  {
    phase: "FASE 6",
    label: "Modulos Complementarios",
    color: "#EEF9FF",
    items: [
      ["6.1", "Modulo de suscripciones", "Desarrollador", "En progreso", 6, 6],
      ["6.2", "Modulo de guarderia", "Desarrollador", "En progreso", 6, 6],
      ["6.3", "Modulo de paseos", "Desarrollador", "En progreso", 6, 6],
      ["6.4", "Vacunas e historial clinico", "Desarrollador", "En progreso", 6, 7],
      ["6.5", "Facturas, pagos online y fotos de servicio", "Desarrollador", "En progreso", 6, 7],
    ],
  },
  {
    phase: "FASE 7",
    label: "Reportes y Control",
    color: "#F2FFF4",
    items: [
      ["7.1", "Modulo de reportes financieros y operativos", "Desarrollador", "En progreso", 7, 7],
      ["7.2", "Filtros por sucursal y contexto de datos", "Desarrollador", "En progreso", 7, 7],
      ["7.3", "Notificaciones, correo y contacto", "Desarrollador", "Completado", 7, 7],
      ["7.4", "Auditoria y seguimiento de acciones", "Desarrollador", "En progreso", 7, 7],
    ],
  },
  {
    phase: "FASE 8",
    label: "Pruebas y Ajustes",
    color: "#FFF8E7",
    items: [
      ["8.1", "Pruebas de autenticacion", "Desarrollador", "En progreso", 7, 8],
      ["8.2", "Pruebas de formularios y validaciones", "Desarrollador", "En progreso", 7, 8],
      ["8.3", "Pruebas de endpoints principales", "Desarrollador", "En progreso", 7, 8],
      ["8.4", "Correccion de errores detectados", "Desarrollador", "En progreso", 8, 8],
    ],
  },
  {
    phase: "FASE 9",
    label: "Documentacion Funcional",
    color: "#EFF3FF",
    items: [
      ["9.1", "Acta de proyecto", "Desarrollador", "Completado", 8, 8],
      ["9.2", "Plan de actividades", "Desarrollador", "Completado", 8, 8],
      ["9.3", "Cronograma en Excel", "Desarrollador", "En progreso", 8, 8],
      ["9.4", "Manual de usuario", "Desarrollador", "En progreso", 8, 8],
    ],
  },
  {
    phase: "FASE 10",
    label: "Documentacion Tecnica",
    color: "#F5EEFF",
    items: [
      ["10.1", "Manual tecnico", "Desarrollador", "En progreso", 8, 8],
      ["10.2", "Analisis y diseno del sistema", "Desarrollador", "En progreso", 8, 8],
      ["10.3", "README del proyecto", "Desarrollador", "En progreso", 8, 8],
    ],
  },
  {
    phase: "FASE 11",
    label: "Entrega Final",
    color: "#EEFDF5",
    items: [
      ["11.1", "Revision general de entregables", "Desarrollador", "Pendiente", 8, 8],
      ["11.2", "Organizacion del paquete documental", "Desarrollador", "Pendiente", 8, 8],
      ["11.3", "Preparacion para sustentacion o entrega", "Desarrollador", "Pendiente", 8, 8],
    ],
  },
];

const workbook = Workbook.create();
const sheet = workbook.worksheets.add("Cronograma");

sheet.getRange("A1:Q2").merge();
sheet.getRange("A1").values = [["CaniVet - Cronograma General del Proyecto"]];
sheet.getRange("A1:Q2").format = {
  fill: "#111827",
  font: { name: "Arial", size: 18, bold: true, color: "#FFFFFF" },
  horizontalAlignment: "center",
  verticalAlignment: "center",
  borders: { preset: "outside", style: "thin", color: "#0F172A" },
};

sheet.getRange("A3:Q3").merge();
sheet.getRange("A3").values = [[
  "Planificacion por fases, responsables, estado y distribucion semanal de trabajo para la plataforma CaniVet."
]];
sheet.getRange("A3:Q3").format = {
  fill: "#F8FAFC",
  font: { name: "Arial", size: 11, italic: true, color: "#64748B" },
  horizontalAlignment: "center",
  verticalAlignment: "center",
  borders: { preset: "outside", style: "thin", color: "#E2E8F0" },
};

sheet.getRange("A5:Q5").values = [[
  "#", "Codigo", "Actividad", "Responsable", "Estado", "Fase", "Semana inicio", "Semana fin", "Duracion", "S1", "S2", "S3", "S4", "S5", "S6", "S7", "S8"
]];
sheet.getRange("A5:Q5").format = {
  fill: "#2F56D0",
  font: { name: "Arial", size: 10, bold: true, color: "#FFFFFF" },
  horizontalAlignment: "center",
  verticalAlignment: "center",
  wrapText: true,
  borders: { preset: "outside", style: "thin", color: "#1E3A8A" },
};

let row = 6;
let n = 1;
for (const group of groups) {
  sheet.getRange(`A${row}:Q${row}`).merge();
  sheet.getRange(`A${row}`).values = [[`${group.phase} - ${group.label}`]];
  sheet.getRange(`A${row}:Q${row}`).format = {
    fill: "#C9D3E2",
    font: { name: "Arial", size: 10, bold: true, color: "#111827" },
    horizontalAlignment: "left",
    verticalAlignment: "center",
    borders: { preset: "outside", style: "thin", color: "#AAB7C8" },
  };
  row += 1;

  for (const item of group.items) {
    const [code, activity, owner, status, startWeek, endWeek] = item;
    const duration = endWeek - startWeek + 1;
    const weekMarks = [];
    for (let w = 1; w <= 8; w += 1) weekMarks.push(w >= startWeek && w <= endWeek ? "X" : "");

    sheet.getRange(`A${row}:Q${row}`).values = [[
      n, code, activity, owner, status, group.phase, startWeek, endWeek, duration, ...weekMarks,
    ]];
    sheet.getRange(`A${row}:Q${row}`).format = {
      fill: group.color,
      font: { name: "Arial", size: 10, color: "#1F2937" },
      verticalAlignment: "center",
      wrapText: true,
      borders: { preset: "outside", style: "thin", color: "#D6DCE5" },
    };
    sheet.getRange(`A${row}:B${row}`).format.horizontalAlignment = "center";
    sheet.getRange(`D${row}:I${row}`).format.horizontalAlignment = "center";
    sheet.getRange(`J${row}:Q${row}`).format.horizontalAlignment = "center";

    const stateColor =
      status === "Completado" ? "#E7F6EE" :
      status === "En progreso" ? "#FFF4D6" :
      "#FEECEC";
    const stateFont =
      status === "Completado" ? "#059669" :
      status === "En progreso" ? "#B45309" :
      "#B91C1C";
    sheet.getRange(`E${row}`).format = {
      fill: stateColor,
      font: { name: "Arial", size: 10, bold: true, color: stateFont },
      horizontalAlignment: "center",
      verticalAlignment: "center",
      borders: { preset: "outside", style: "thin", color: "#D6DCE5" },
    };

    for (let w = 0; w < 8; w += 1) {
      const col = String.fromCharCode("J".charCodeAt(0) + w);
      if (weekMarks[w] === "X") {
        sheet.getRange(`${col}${row}`).format = {
          fill: "#A9CCF5",
          font: { name: "Arial", size: 10, bold: true, color: "#123456" },
          horizontalAlignment: "center",
          verticalAlignment: "center",
          borders: { preset: "outside", style: "thin", color: "#8FB6DE" },
        };
      }
    }
    row += 1;
    n += 1;
  }
}

sheet.getRange(`A${row + 1}:Q${row + 1}`).merge();
sheet.getRange(`A${row + 1}`).values = [[
  "Leyenda: Completado = actividad cerrada | En progreso = actividad en desarrollo | Pendiente = actividad prevista para cierre. Las columnas S1-S8 representan semanas del cronograma."
]];
sheet.getRange(`A${row + 1}:Q${row + 1}`).format = {
  fill: "#F8FAFC",
  font: { name: "Arial", size: 10, italic: true, color: "#475569" },
  wrapText: true,
  horizontalAlignment: "left",
  verticalAlignment: "center",
  borders: { preset: "outside", style: "thin", color: "#E2E8F0" },
};

sheet.freezePanes.freezeRows(5);
sheet.freezePanes.freezeColumns(3);

sheet.getRange("A:A").format.numberFormat = "0";
sheet.getRange("G:I").format.numberFormat = "0";
sheet.getRange("A:Q").format.autofitColumns();
sheet.getRange(`1:${row + 3}`).format.autofitRows();

await fs.mkdir(previewDir, { recursive: true });
const preview = await workbook.render({ sheetName: "Cronograma", range: "A1:Q40", format: "png" });
await fs.writeFile(path.join(previewDir, "cronograma_principal.png"), Buffer.from(await preview.arrayBuffer()));

const exported = await SpreadsheetFile.exportXlsx(workbook);
await exported.save(outputPath);

console.log(outputPath);
