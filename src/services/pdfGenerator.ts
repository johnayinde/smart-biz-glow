// // src/services/pdfGenerator.ts - UPDATED WITH TEMPLATE DESIGN
// import PDFDocument from "pdfkit";
// import { Invoice } from "./invoiceService";
// import { Template, DesignConfig } from "./templateService";

// export async function generateInvoicePDF(
//   invoice: Invoice,
//   template?: Template
// ): Promise<Buffer> {
//   return new Promise((resolve, reject) => {
//     try {
//       const design = template?.design || getDefaultDesign();
//       const doc = new PDFDocument({
//         size: design.layout.pageSize === "A4" ? "A4" : "LETTER",
//         layout: design.layout.orientation,
//         margins: design.layout.margins,
//       });

//       const buffers: Buffer[] = [];
//       doc.on("data", buffers.push.bind(buffers));
//       doc.on("end", () => resolve(Buffer.concat(buffers)));
//       doc.on("error", reject);

//       const { colors, typography, spacing, borders } = design;
//       let yPosition = doc.page.margins.top;

//       // Header Section
//       if (design.sections.header.enabled) {
//         if (design.logo.enabled && design.logo.url) {
//           try {
//             const logoSize =
//               design.logo.size === "small"
//                 ? 60
//                 : design.logo.size === "large"
//                 ? 100
//                 : 80;
//             const logoX =
//               design.logo.position === "center"
//                 ? (doc.page.width - logoSize) / 2
//                 : design.logo.position === "right"
//                 ? doc.page.width - doc.page.margins.right - logoSize
//                 : doc.page.margins.left;

//             doc.image(design.logo.url, logoX, yPosition, { width: logoSize });
//             yPosition += logoSize + spacing.itemGap;
//           } catch (err) {
//             console.warn("Logo loading failed, continuing without logo");
//           }
//         }

//         doc
//           .font("Helvetica-Bold")
//           .fontSize(typography.size.heading)
//           .fillColor(colors.primary)
//           .text("INVOICE", doc.page.margins.left, yPosition);

//         yPosition += typography.size.heading + spacing.itemGap;

//         doc
//           .font("Helvetica")
//           .fontSize(typography.size.small)
//           .fillColor(colors.text)
//           .text("Your Company Name", doc.page.margins.left, yPosition);
//         yPosition += typography.size.small + 2;

//         doc.text("123 Business Street");
//         yPosition += typography.size.small + 2;

//         doc.text("City, State 12345");
//         yPosition += typography.size.small + 2;

//         doc.text("contact@company.com | (555) 123-4567");
//         yPosition += spacing.sectionGap;
//       }

//       // Separator
//       if (borders.enabled) {
//         doc
//           .strokeColor(colors.border)
//           .lineWidth(borders.width)
//           .moveTo(doc.page.margins.left, yPosition)
//           .lineTo(doc.page.width - doc.page.margins.right, yPosition)
//           .stroke();
//         yPosition += spacing.sectionGap;
//       }

//       // Invoice Details
//       const detailsY = yPosition;
//       doc
//         .font("Helvetica-Bold")
//         .fontSize(typography.size.body)
//         .fillColor(colors.text)
//         .text("Invoice Number:", doc.page.margins.left, yPosition);

//       doc
//         .font("Helvetica")
//         .fillColor(colors.textSecondary)
//         .text(invoice.invoiceNumber, doc.page.margins.left + 120, yPosition);
//       yPosition += typography.size.body + spacing.itemGap;

//       doc
//         .font("Helvetica-Bold")
//         .fillColor(colors.text)
//         .text("Date:", doc.page.margins.left, yPosition);

//       doc
//         .font("Helvetica")
//         .fillColor(colors.textSecondary)
//         .text(
//           new Date(invoice.invoiceDate).toLocaleDateString(),
//           doc.page.margins.left + 120,
//           yPosition
//         );
//       yPosition += typography.size.body + spacing.itemGap;

//       doc
//         .font("Helvetica-Bold")
//         .fillColor(colors.text)
//         .text("Due Date:", doc.page.margins.left, yPosition);

//       doc
//         .font("Helvetica")
//         .fillColor(colors.textSecondary)
//         .text(
//           new Date(invoice.dueDate).toLocaleDateString(),
//           doc.page.margins.left + 120,
//           yPosition
//         );

//       yPosition = Math.max(yPosition, detailsY) + spacing.sectionGap;

//       // Bill To Section
//       if (design.sections.billTo.enabled) {
//         doc
//           .font("Helvetica-Bold")
//           .fontSize(typography.size.subheading)
//           .fillColor(colors.primary)
//           .text("Bill To:", doc.page.margins.left, yPosition);
//         yPosition += typography.size.subheading + spacing.itemGap;

//         doc
//           .font("Helvetica-Bold")
//           .fontSize(typography.size.body)
//           .fillColor(colors.text)
//           .text(invoice.clientName, doc.page.margins.left, yPosition);
//         yPosition += typography.size.body + 4;

//         if (invoice.clientAddress) {
//           doc
//             .font("Helvetica")
//             .fillColor(colors.textSecondary)
//             .text(invoice.clientAddress, doc.page.margins.left, yPosition);
//           yPosition += typography.size.body + 4;
//         }

//         doc.text(invoice.clientEmail, doc.page.margins.left, yPosition);
//         yPosition += spacing.sectionGap;
//       }

//       // Items Table
//       if (design.sections.items.enabled) {
//         const tableTop = yPosition;
//         const col1X = doc.page.margins.left;
//         const col2X = doc.page.width - doc.page.margins.right - 200;
//         const col3X = doc.page.width - doc.page.margins.right - 130;
//         const col4X = doc.page.width - doc.page.margins.right - 60;
//         const col5X = doc.page.width - doc.page.margins.right;

//         // Table Header
//         doc
//           .font("Helvetica-Bold")
//           .fontSize(typography.size.body)
//           .fillColor(colors.text);

//         doc.text("Description", col1X, tableTop);
//         doc.text("Qty", col2X, tableTop, { width: 70, align: "right" });
//         doc.text("Rate", col3X, tableTop, { width: 70, align: "right" });
//         doc.text("Amount", col4X, tableTop, { width: 60, align: "right" });

//         yPosition = tableTop + typography.size.body + spacing.itemGap;

//         if (borders.enabled) {
//           doc
//             .strokeColor(colors.border)
//             .lineWidth(borders.width)
//             .moveTo(col1X, yPosition)
//             .lineTo(col5X, yPosition)
//             .stroke();
//         }
//         yPosition += spacing.itemGap;

//         // Table Items
//         doc
//           .font("Helvetica")
//           .fontSize(typography.size.body)
//           .fillColor(colors.textSecondary);

//         invoice.items.forEach((item) => {
//           doc.text(item.description, col1X, yPosition, { width: 250 });
//           doc.text(item.quantity.toString(), col2X, yPosition, {
//             width: 70,
//             align: "right",
//           });
//           doc.text(`$${item.unitPrice.toFixed(2)}`, col3X, yPosition, {
//             width: 70,
//             align: "right",
//           });
//           doc
//             .font("Helvetica-Bold")
//             .fillColor(colors.text)
//             .text(`$${item.amount.toFixed(2)}`, col4X, yPosition, {
//               width: 60,
//               align: "right",
//             });

//           yPosition += typography.size.body + spacing.itemGap;
//           doc.font("Helvetica").fillColor(colors.textSecondary);

//           if (borders.enabled) {
//             doc
//               .strokeColor(colors.border)
//               .lineWidth(borders.width)
//               .moveTo(col1X, yPosition)
//               .lineTo(col5X, yPosition)
//               .stroke();
//             yPosition += spacing.itemGap;
//           }
//         });

//         yPosition += spacing.sectionGap;
//       }

//       // Summary Section
//       if (design.sections.summary.enabled) {
//         const summaryX = doc.page.width - doc.page.margins.right - 200;
//         const amountX = doc.page.width - doc.page.margins.right;

//         doc
//           .font("Helvetica")
//           .fontSize(typography.size.body)
//           .fillColor(colors.textSecondary);

//         doc.text("Subtotal:", summaryX, yPosition);
//         doc
//           .font("Helvetica-Bold")
//           .fillColor(colors.text)
//           .text(`$${invoice.subtotal.toFixed(2)}`, summaryX + 80, yPosition, {
//             width: 120,
//             align: "right",
//           });
//         yPosition += typography.size.body + spacing.itemGap;

//         if (invoice.tax) {
//           doc
//             .font("Helvetica")
//             .fillColor(colors.textSecondary)
//             .text("Tax:", summaryX, yPosition);
//           doc
//             .font("Helvetica-Bold")
//             .fillColor(colors.text)
//             .text(`$${invoice.tax.toFixed(2)}`, summaryX + 80, yPosition, {
//               width: 120,
//               align: "right",
//             });
//           yPosition += typography.size.body + spacing.itemGap;
//         }

//         if (invoice.discount) {
//           doc
//             .font("Helvetica")
//             .fillColor(colors.textSecondary)
//             .text("Discount:", summaryX, yPosition);
//           doc
//             .font("Helvetica-Bold")
//             .fillColor(colors.text)
//             .text(
//               `-$${invoice.discount.toFixed(2)}`,
//               summaryX + 80,
//               yPosition,
//               { width: 120, align: "right" }
//             );
//           yPosition += typography.size.body + spacing.itemGap;
//         }

//         if (borders.enabled) {
//           doc
//             .strokeColor(colors.border)
//             .lineWidth(borders.width)
//             .moveTo(summaryX, yPosition)
//             .lineTo(amountX, yPosition)
//             .stroke();
//           yPosition += spacing.itemGap;
//         }

//         doc
//           .font("Helvetica-Bold")
//           .fontSize(typography.size.subheading)
//           .fillColor(colors.primary)
//           .text("Total:", summaryX, yPosition);

//         doc.text(`$${invoice.total.toFixed(2)}`, summaryX + 80, yPosition, {
//           width: 120,
//           align: "right",
//         });
//         yPosition += spacing.sectionGap * 2;
//       }

//       // Notes
//       if (design.sections.notes.enabled && invoice.notes) {
//         doc
//           .font("Helvetica-Bold")
//           .fontSize(typography.size.body)
//           .fillColor(colors.text)
//           .text("Notes:", doc.page.margins.left, yPosition);
//         yPosition += typography.size.body + spacing.itemGap;

//         doc
//           .font("Helvetica")
//           .fontSize(typography.size.small)
//           .fillColor(colors.textSecondary)
//           .text(invoice.notes, doc.page.margins.left, yPosition, {
//             width: 500,
//           });
//         yPosition += spacing.sectionGap;
//       }

//       // Terms
//       if (design.sections.footer.enabled && invoice.terms) {
//         doc
//           .font("Helvetica-Bold")
//           .fontSize(typography.size.body)
//           .fillColor(colors.text)
//           .text("Terms & Conditions:", doc.page.margins.left, yPosition);
//         yPosition += typography.size.body + spacing.itemGap;

//         doc
//           .font("Helvetica")
//           .fontSize(typography.size.small)
//           .fillColor(colors.textSecondary)
//           .text(invoice.terms, doc.page.margins.left, yPosition, {
//             width: 500,
//           });
//       }

//       doc.end();
//     } catch (error) {
//       reject(error);
//     }
//   });
// }

// function getDefaultDesign(): DesignConfig {
//   return {
//     colors: {
//       primary: "#667eea",
//       secondary: "#764ba2",
//       text: "#333333",
//       textSecondary: "#666666",
//       accent: "#28a745",
//       background: "#ffffff",
//       border: "#e0e0e0",
//     },
//     typography: {
//       heading: "Helvetica",
//       body: "Helvetica",
//       size: { heading: 24, subheading: 18, body: 14, small: 12 },
//     },
//     logo: { url: "", position: "left", size: "medium", enabled: false },
//     layout: {
//       pageSize: "A4",
//       orientation: "portrait",
//       margins: { top: 40, right: 40, bottom: 40, left: 40 },
//     },
//     sections: {
//       header: { enabled: true, fields: [], order: 1 },
//       billTo: { enabled: true, fields: [], order: 2 },
//       items: { enabled: true, fields: [], order: 3 },
//       summary: { enabled: true, fields: [], order: 4 },
//       footer: { enabled: true, fields: [], order: 5 },
//       notes: { enabled: true, fields: [], order: 6 },
//     },
//     spacing: { lineHeight: 1.5, sectionGap: 24, itemGap: 12 },
//     borders: { enabled: true, width: 1, style: "solid", color: "#e0e0e0" },
//   };
// }
