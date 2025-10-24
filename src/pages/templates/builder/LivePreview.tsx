// src/pages/templates/builder/LivePreview.tsx - FIXED VERSION
import { DesignConfig, TemplateDefaults } from "@/services/templateService";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

interface LivePreviewProps {
  design: DesignConfig;
  viewMode: "desktop" | "mobile";
  templateName?: string;
  defaults?: TemplateDefaults;
}

export function LivePreview({
  design,
  viewMode,
  templateName = "Untitled Template",
  defaults,
}: LivePreviewProps) {
  const {
    colors,
    fonts,
    logo,
    paperSize,
    orientation,
    spacing,
    advanced,
    sections,
  } = design;

  const containerWidth = viewMode === "desktop" ? "210mm" : "100%";
  const maxWidth = viewMode === "mobile" ? "375px" : "210mm";

  const logoSizeMap = {
    small: "60px",
    medium: "80px",
    large: "100px",
  };

  return (
    <div
      className="bg-white shadow-2xl mx-auto"
      style={{
        width: containerWidth,
        maxWidth,
        minHeight: orientation === "portrait" ? "297mm" : "210mm",
        padding: `${spacing.padding}px`,
        fontFamily: fonts.body,
        color: colors.text,
      }}
    >
      {/* Header Section */}
      {sections.header?.enabled && (
        <div
          className={cn(
            "flex items-start mb-6",
            logo.position === "center" && "justify-center",
            logo.position === "right" && "justify-end"
          )}
          style={{ marginBottom: `${spacing.sectionGap}px` }}
        >
          <div>
            {logo.enabled && (
              <div
                style={{
                  fontSize: logoSizeMap[logo.size as keyof typeof logoSizeMap],
                  fontWeight: "bold",
                  color: colors.primary,
                  marginBottom: "8px",
                }}
              >
                🏢 {templateName}
              </div>
            )}
            <div
              style={{
                fontSize: `${fonts.size.heading}px`,
                fontWeight: "bold",
                fontFamily: fonts.heading,
                color: colors.primary,
              }}
            >
              INVOICE
            </div>
            <div
              style={{
                fontSize: `${fonts.size.small}px`,
                color: colors.textSecondary,
                marginTop: "8px",
              }}
            >
              <div>Your Company Name</div>
              <div>123 Business Street</div>
              <div>City, State 12345</div>
              <div>contact@company.com</div>
            </div>
          </div>
        </div>
      )}

      {advanced?.showBorders && (
        <Separator
          style={{
            borderColor: colors.border,
            marginBottom: `${spacing.sectionGap}px`,
          }}
        />
      )}

      {/* Invoice Info Section */}
      {sections.invoiceInfo?.enabled && (
        <div style={{ marginBottom: `${spacing.sectionGap}px` }}>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: `${spacing.elementGap}px`,
              fontSize: `${fonts.size.body}px`,
            }}
          >
            <div>
              <span style={{ fontWeight: "600", color: colors.text }}>
                Invoice Number:
              </span>{" "}
              <span style={{ color: colors.textSecondary }}>INV-001</span>
            </div>
            <div>
              <span style={{ fontWeight: "600", color: colors.text }}>
                Date:
              </span>{" "}
              <span style={{ color: colors.textSecondary }}>
                {new Date().toLocaleDateString()}
              </span>
            </div>
            <div>
              <span style={{ fontWeight: "600", color: colors.text }}>
                Due Date:
              </span>{" "}
              <span style={{ color: colors.textSecondary }}>
                {new Date(
                  Date.now() + 30 * 24 * 60 * 60 * 1000
                ).toLocaleDateString()}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Bill To Section */}
      {sections.billTo?.enabled && (
        <div style={{ marginBottom: `${spacing.sectionGap}px` }}>
          <div
            style={{
              fontSize: `${fonts.size.subheading}px`,
              fontWeight: "600",
              color: colors.primary,
              marginBottom: `${spacing.elementGap}px`,
            }}
          >
            Bill To:
          </div>
          <div
            style={{
              fontSize: `${fonts.size.body}px`,
              color: colors.textSecondary,
            }}
          >
            <div style={{ fontWeight: "600", color: colors.text }}>
              Client Name
            </div>
            <div>456 Client Avenue</div>
            <div>City, State 67890</div>
            <div>client@email.com</div>
          </div>
        </div>
      )}

      {/* Items Section */}
      {sections.items?.enabled && (
        <div style={{ marginBottom: `${spacing.sectionGap}px` }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr
                style={{
                  borderBottom: advanced?.showBorders
                    ? `2px ${advanced?.borderStyle || "solid"} ${colors.border}`
                    : "none",
                }}
              >
                <th
                  style={{
                    textAlign: "left",
                    padding: `${spacing.elementGap}px 0`,
                    fontSize: `${fonts.size.body}px`,
                    fontWeight: "600",
                    color: colors.text,
                  }}
                >
                  Description
                </th>
                <th
                  style={{
                    textAlign: "right",
                    padding: `${spacing.elementGap}px 0`,
                    fontSize: `${fonts.size.body}px`,
                    fontWeight: "600",
                    color: colors.text,
                  }}
                >
                  Qty
                </th>
                <th
                  style={{
                    textAlign: "right",
                    padding: `${spacing.elementGap}px 0`,
                    fontSize: `${fonts.size.body}px`,
                    fontWeight: "600",
                    color: colors.text,
                  }}
                >
                  Rate
                </th>
                <th
                  style={{
                    textAlign: "right",
                    padding: `${spacing.elementGap}px 0`,
                    fontSize: `${fonts.size.body}px`,
                    fontWeight: "600",
                    color: colors.text,
                  }}
                >
                  Amount
                </th>
              </tr>
            </thead>
            <tbody>
              {[
                {
                  desc: "Web Development Services",
                  qty: 40,
                  rate: 125,
                  amount: 5000,
                },
                { desc: "UI/UX Design", qty: 20, rate: 150, amount: 3000 },
                { desc: "API Integration", qty: 10, rate: 175, amount: 1750 },
              ].map((item, idx) => (
                <tr
                  key={idx}
                  style={{
                    borderBottom: advanced?.showBorders
                      ? `1px ${advanced?.borderStyle || "solid"} ${
                          colors.border
                        }`
                      : "none",
                  }}
                >
                  <td
                    style={{
                      padding: `${spacing.elementGap}px 0`,
                      fontSize: `${fonts.size.body}px`,
                      color: colors.textSecondary,
                    }}
                  >
                    {item.desc}
                  </td>
                  <td
                    style={{
                      textAlign: "right",
                      padding: `${spacing.elementGap}px 0`,
                      fontSize: `${fonts.size.body}px`,
                      color: colors.textSecondary,
                    }}
                  >
                    {item.qty}
                  </td>
                  <td
                    style={{
                      textAlign: "right",
                      padding: `${spacing.elementGap}px 0`,
                      fontSize: `${fonts.size.body}px`,
                      color: colors.textSecondary,
                    }}
                  >
                    ${item.rate}
                  </td>
                  <td
                    style={{
                      textAlign: "right",
                      padding: `${spacing.elementGap}px 0`,
                      fontSize: `${fonts.size.body}px`,
                      color: colors.text,
                      fontWeight: "600",
                    }}
                  >
                    ${item.amount.toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Summary Section */}
      {sections.summary?.enabled && (
        <div
          className="flex justify-end"
          style={{ marginBottom: `${spacing.sectionGap}px` }}
        >
          <div style={{ minWidth: "250px" }}>
            <div
              className="flex justify-between"
              style={{ marginBottom: `${spacing.elementGap}px` }}
            >
              <span
                style={{
                  fontSize: `${fonts.size.body}px`,
                  color: colors.textSecondary,
                }}
              >
                Subtotal:
              </span>
              <span
                style={{
                  fontSize: `${fonts.size.body}px`,
                  color: colors.text,
                }}
              >
                $9,750.00
              </span>
            </div>
            <div
              className="flex justify-between"
              style={{ marginBottom: `${spacing.elementGap}px` }}
            >
              <span
                style={{
                  fontSize: `${fonts.size.body}px`,
                  color: colors.textSecondary,
                }}
              >
                Tax (10%):
              </span>
              <span
                style={{
                  fontSize: `${fonts.size.body}px`,
                  color: colors.text,
                }}
              >
                $975.00
              </span>
            </div>
            <div
              style={{
                borderTop: advanced?.showBorders
                  ? `2px ${advanced?.borderStyle || "solid"} ${colors.border}`
                  : "transparent",
                marginBottom: `${spacing.elementGap}px`,
                paddingTop: `${spacing.elementGap}px`,
              }}
            />
            <div className="flex justify-between">
              <span
                style={{
                  fontSize: `${fonts.size.subheading}px`,
                  color: colors.primary,
                  fontWeight: "bold",
                }}
              >
                Total:
              </span>
              <span
                style={{
                  fontSize: `${fonts.size.subheading}px`,
                  color: colors.primary,
                  fontWeight: "bold",
                }}
              >
                $10,725.00
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Footer/Notes Section */}
      {sections.footer?.enabled && (
        <div style={{ marginTop: `${spacing.sectionGap}px` }}>
          {defaults?.notes && (
            <div style={{ marginBottom: `${spacing.sectionGap}px` }}>
              <div
                style={{
                  fontSize: `${fonts.size.body}px`,
                  fontWeight: "600",
                  color: colors.text,
                  marginBottom: `${spacing.elementGap}px`,
                }}
              >
                Notes:
              </div>
              <div
                style={{
                  fontSize: `${fonts.size.small}px`,
                  color: colors.textSecondary,
                }}
              >
                {defaults.notes}
              </div>
            </div>
          )}

          {defaults?.terms && (
            <div>
              <div
                style={{
                  fontSize: `${fonts.size.body}px`,
                  fontWeight: "600",
                  color: colors.text,
                  marginBottom: `${spacing.elementGap}px`,
                }}
              >
                Terms & Conditions:
              </div>
              <div
                style={{
                  fontSize: `${fonts.size.small}px`,
                  color: colors.textSecondary,
                }}
              >
                {defaults.terms}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Watermark if enabled */}
      {advanced?.showWatermark && (
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%) rotate(-45deg)",
            fontSize: "72px",
            fontWeight: "bold",
            color: "rgba(0, 0, 0, 0.05)",
            pointerEvents: "none",
            userSelect: "none",
          }}
        >
          {advanced.watermarkText || "DRAFT"}
        </div>
      )}
    </div>
  );
}
