// src/components/templates/builder/LivePreview.tsx
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
  const { colors, typography, logo, layout, spacing, borders, sections } =
    design;

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
        minHeight: layout.orientation === "portrait" ? "297mm" : "210mm",
        padding: `${layout.margins.top}px ${layout.margins.right}px ${layout.margins.bottom}px ${layout.margins.left}px`,
        fontFamily: typography.body,
        fontSize: `${typography.size.body}px`,
        color: colors.text,
        lineHeight: spacing.lineHeight,
      }}
    >
      {/* Header Section */}
      {sections.header.enabled && (
        <div style={{ marginBottom: `${spacing.sectionGap}px` }}>
          <div
            className={cn(
              "flex items-start gap-4",
              logo.position === "center" && "justify-center text-center",
              logo.position === "right" && "justify-end text-right"
            )}
          >
            <div className="flex-1">
              {logo.enabled && logo.url && (
                <img
                  src={logo.url}
                  alt="Logo"
                  style={{
                    height: logoSizeMap[logo.size],
                    width: "auto",
                    objectFit: "contain",
                    marginBottom: "12px",
                  }}
                />
              )}
              <div
                style={{
                  fontFamily: typography.heading,
                  fontSize: `${typography.size.heading}px`,
                  fontWeight: "bold",
                  color: colors.primary,
                  marginBottom: "8px",
                }}
              >
                INVOICE
              </div>
              <div
                style={{
                  fontSize: `${typography.size.small}px`,
                  color: colors.textSecondary,
                }}
              >
                <div style={{ fontWeight: "600", color: colors.text }}>
                  Your Company Name
                </div>
                <div>123 Business Street</div>
                <div>City, State 12345</div>
                <div>contact@company.com | (555) 123-4567</div>
              </div>
            </div>
          </div>
        </div>
      )}

      <Separator
        style={{
          backgroundColor: borders.enabled ? colors.border : "transparent",
          height: borders.enabled ? `${borders.width}px` : "0",
          marginBottom: `${spacing.sectionGap}px`,
        }}
      />

      {/* Invoice Details */}
      <div
        className="grid grid-cols-2 gap-4"
        style={{ marginBottom: `${spacing.sectionGap}px` }}
      >
        <div>
          <div
            style={{
              fontSize: `${typography.size.small}px`,
              fontWeight: "600",
              color: colors.text,
              marginBottom: "4px",
            }}
          >
            Invoice Number:
          </div>
          <div
            style={{
              fontSize: `${typography.size.body}px`,
              color: colors.textSecondary,
            }}
          >
            INV-2024-001
          </div>
        </div>
        <div>
          <div
            style={{
              fontSize: `${typography.size.small}px`,
              fontWeight: "600",
              color: colors.text,
              marginBottom: "4px",
            }}
          >
            Date:
          </div>
          <div
            style={{
              fontSize: `${typography.size.body}px`,
              color: colors.textSecondary,
            }}
          >
            {new Date().toLocaleDateString()}
          </div>
        </div>
        <div>
          <div
            style={{
              fontSize: `${typography.size.small}px`,
              fontWeight: "600",
              color: colors.text,
              marginBottom: "4px",
            }}
          >
            Due Date:
          </div>
          <div
            style={{
              fontSize: `${typography.size.body}px`,
              color: colors.textSecondary,
            }}
          >
            {new Date(
              Date.now() + 30 * 24 * 60 * 60 * 1000
            ).toLocaleDateString()}
          </div>
        </div>
        <div>
          <div
            style={{
              fontSize: `${typography.size.small}px`,
              fontWeight: "600",
              color: colors.text,
              marginBottom: "4px",
            }}
          >
            Payment Terms:
          </div>
          <div
            style={{
              fontSize: `${typography.size.body}px`,
              color: colors.textSecondary,
            }}
          >
            {defaults?.paymentTerms || "Net 30"}
          </div>
        </div>
      </div>

      {/* Bill To Section */}
      {sections.billTo.enabled && (
        <div style={{ marginBottom: `${spacing.sectionGap}px` }}>
          <div
            style={{
              fontSize: `${typography.size.subheading}px`,
              fontWeight: "600",
              color: colors.primary,
              marginBottom: "8px",
            }}
          >
            Bill To:
          </div>
          <div
            style={{
              fontSize: `${typography.size.body}px`,
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
      {sections.items.enabled && (
        <div style={{ marginBottom: `${spacing.sectionGap}px` }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr
                style={{
                  borderBottom: borders.enabled
                    ? `${borders.width}px ${borders.style} ${colors.border}`
                    : "none",
                }}
              >
                <th
                  style={{
                    textAlign: "left",
                    padding: `${spacing.itemGap}px 0`,
                    fontSize: `${typography.size.body}px`,
                    fontWeight: "600",
                    color: colors.text,
                  }}
                >
                  Description
                </th>
                <th
                  style={{
                    textAlign: "right",
                    padding: `${spacing.itemGap}px 0`,
                    fontSize: `${typography.size.body}px`,
                    fontWeight: "600",
                    color: colors.text,
                  }}
                >
                  Qty
                </th>
                <th
                  style={{
                    textAlign: "right",
                    padding: `${spacing.itemGap}px 0`,
                    fontSize: `${typography.size.body}px`,
                    fontWeight: "600",
                    color: colors.text,
                  }}
                >
                  Rate
                </th>
                <th
                  style={{
                    textAlign: "right",
                    padding: `${spacing.itemGap}px 0`,
                    fontSize: `${typography.size.body}px`,
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
                    borderBottom: borders.enabled
                      ? `${borders.width}px ${borders.style} ${colors.border}`
                      : "none",
                  }}
                >
                  <td
                    style={{
                      padding: `${spacing.itemGap}px 0`,
                      fontSize: `${typography.size.body}px`,
                      color: colors.textSecondary,
                    }}
                  >
                    {item.desc}
                  </td>
                  <td
                    style={{
                      textAlign: "right",
                      padding: `${spacing.itemGap}px 0`,
                      fontSize: `${typography.size.body}px`,
                      color: colors.textSecondary,
                    }}
                  >
                    {item.qty}
                  </td>
                  <td
                    style={{
                      textAlign: "right",
                      padding: `${spacing.itemGap}px 0`,
                      fontSize: `${typography.size.body}px`,
                      color: colors.textSecondary,
                    }}
                  >
                    ${item.rate}
                  </td>
                  <td
                    style={{
                      textAlign: "right",
                      padding: `${spacing.itemGap}px 0`,
                      fontSize: `${typography.size.body}px`,
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
      {sections.summary.enabled && (
        <div
          className="flex justify-end"
          style={{ marginBottom: `${spacing.sectionGap}px` }}
        >
          <div style={{ minWidth: "250px" }}>
            <div
              className="flex justify-between"
              style={{ marginBottom: "8px" }}
            >
              <span
                style={{
                  fontSize: `${typography.size.body}px`,
                  color: colors.textSecondary,
                }}
              >
                Subtotal:
              </span>
              <span
                style={{
                  fontSize: `${typography.size.body}px`,
                  color: colors.text,
                  fontWeight: "600",
                }}
              >
                $9,750.00
              </span>
            </div>
            <div
              className="flex justify-between"
              style={{ marginBottom: "8px" }}
            >
              <span
                style={{
                  fontSize: `${typography.size.body}px`,
                  color: colors.textSecondary,
                }}
              >
                Tax (10%):
              </span>
              <span
                style={{
                  fontSize: `${typography.size.body}px`,
                  color: colors.text,
                  fontWeight: "600",
                }}
              >
                $975.00
              </span>
            </div>
            <Separator
              style={{
                backgroundColor: borders.enabled
                  ? colors.border
                  : "transparent",
                height: borders.enabled ? `${borders.width}px` : "0",
                marginBottom: "8px",
              }}
            />
            <div className="flex justify-between">
              <span
                style={{
                  fontSize: `${typography.size.subheading}px`,
                  color: colors.primary,
                  fontWeight: "bold",
                }}
              >
                Total:
              </span>
              <span
                style={{
                  fontSize: `${typography.size.subheading}px`,
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

      {/* Notes Section */}
      {sections.notes.enabled && defaults?.notes && (
        <div style={{ marginBottom: `${spacing.sectionGap}px` }}>
          <div
            style={{
              fontSize: `${typography.size.body}px`,
              fontWeight: "600",
              color: colors.text,
              marginBottom: "8px",
            }}
          >
            Notes:
          </div>
          <div
            style={{
              fontSize: `${typography.size.small}px`,
              color: colors.textSecondary,
            }}
          >
            {defaults.notes}
          </div>
        </div>
      )}

      {/* Terms Section */}
      {sections.footer.enabled && defaults?.terms && (
        <div style={{ marginTop: `${spacing.sectionGap}px` }}>
          <div
            style={{
              fontSize: `${typography.size.body}px`,
              fontWeight: "600",
              color: colors.text,
              marginBottom: "8px",
            }}
          >
            Terms & Conditions:
          </div>
          <div
            style={{
              fontSize: `${typography.size.small}px`,
              color: colors.textSecondary,
            }}
          >
            {defaults.terms}
          </div>
        </div>
      )}
    </div>
  );
}
