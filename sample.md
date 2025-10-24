// src/components/templates/TemplatePreviewModal.tsx - UPDATED SECTIONS
// Only showing the parts that need to be updated

// In the Details tab, update the design information section:

{/* Colors - NO CHANGE NEEDED */}
<div>
  <h3 className="font-semibold mb-3">Colors</h3>
  <div className="grid grid-cols-2 gap-3">
    <div className="flex items-center gap-2">
      <div
        className="w-6 h-6 rounded border"
        style={{ backgroundColor: template.design?.colors?.primary }}
      />
      <span className="text-sm">Primary</span>
    </div>
    <div className="flex items-center gap-2">
      <div
        className="w-6 h-6 rounded border"
        style={{ backgroundColor: template.design?.colors?.secondary }}
      />
      <span className="text-sm">Secondary</span>
    </div>
    <div className="flex items-center gap-2">
      <div
        className="w-6 h-6 rounded border"
        style={{ backgroundColor: template.design?.colors?.accent }}
      />
      <span className="text-sm">Accent</span>
    </div>
  </div>
</div>

<Separator />

{/* Typography - UPDATED */}
<div>
  <h3 className="font-semibold mb-3">Typography</h3>
  <div className="space-y-2">
    <div>
      <span className="text-sm font-medium">Heading Font:</span>{" "}
      <span className="text-sm text-muted-foreground">
        {template.design?.fonts?.heading || 'Inter'}
      </span>
    </div>
    <div>
      <span className="text-sm font-medium">Body Font:</span>{" "}
      <span className="text-sm text-muted-foreground">
        {template.design?.fonts?.body || 'Inter'}
      </span>
    </div>
  </div>
</div>

<Separator />

{/* Layout - UPDATED */}
<div>
  <h3 className="font-semibold mb-3">Layout</h3>
  <div className="space-y-2">
    <div>
      <span className="text-sm font-medium">Style:</span>{" "}
      <span className="text-sm text-muted-foreground capitalize">
        {template.design?.layout || 'classic'}
      </span>
    </div>
    <div>
      <span className="text-sm font-medium">Paper Size:</span>{" "}
      <span className="text-sm text-muted-foreground">
        {template.design?.paperSize || 'A4'}
      </span>
    </div>
    <div>
      <span className="text-sm font-medium">Orientation:</span>{" "}
      <span className="text-sm text-muted-foreground capitalize">
        {template.design?.orientation || 'portrait'}
      </span>
    </div>
  </div>
</div>

<Separator />

{/* Advanced Options - NEW */}
<div>
  <h3 className="font-semibold mb-3">Advanced Options</h3>
  <div className="space-y-2">
    <div>
      <span className="text-sm font-medium">Borders:</span>{" "}
      <span className="text-sm text-muted-foreground">
        {template.design?.advanced?.showBorders ? 'Enabled' : 'Disabled'}
      </span>
    </div>
    {template.design?.advanced?.showBorders && (
      <div>
        <span className="text-sm font-medium">Border Style:</span>{" "}
        <span className="text-sm text-muted-foreground capitalize">
          {template.design?.advanced?.borderStyle || 'solid'}
        </span>
      </div>
    )}
    <div>
      <span className="text-sm font-medium">Watermark:</span>{" "}
      <span className="text-sm text-muted-foreground">
        {template.design?.advanced?.showWatermark ? 'Enabled' : 'Disabled'}
      </span>
    </div>
    {template.design?.advanced?.showWatermark && (
      <div>
        <span className="text-sm font-medium">Watermark Text:</span>{" "}
        <span className="text-sm text-muted-foreground">
          {template.design?.advanced?.watermarkText || 'DRAFT'}
        </span>
      </div>
    )}
    <div>
      <span className="text-sm font-medium">Page Numbers:</span>{" "}
      <span className="text-sm text-muted-foreground">
        {template.design?.advanced?.showPageNumbers ? 'Enabled' : 'Disabled'}
      </span>
    </div>
  </div>
</div>

<Separator />

{/* Usage Stats - NO CHANGE NEEDED */}
<div>
  <h3 className="font-semibold mb-3">Usage Statistics</h3>
  <div className="space-y-2">
    <div>
      <span className="text-sm font-medium">Times Used:</span>{" "}
      <span className="text-sm text-muted-foreground">
        {template.usageCount}
      </span>
    </div>
    {template.lastUsedAt && (
      <div>
        <span className="text-sm font-medium">Last Used:</span>{" "}
        <span className="text-sm text-muted-foreground">
          {new Date(template.lastUsedAt).toLocaleDateString()}
        </span>
      </div>
    )}
    <div>
      <span className="text-sm font-medium">Created:</span>{" "}
      <span className="text-sm text-muted-foreground">
        {new Date(template.createdAt).toLocaleDateString()}
      </span>
    </div>
  </div>
</div>