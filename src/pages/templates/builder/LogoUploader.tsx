// src/components/templates/builder/LogoUploader.tsx
import { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { LogoConfig } from "@/services/templateService";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Upload, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface LogoUploaderProps {
  logo: LogoConfig;
  onChange: (logo: LogoConfig) => void;
}

export function LogoUploader({ logo, onChange }: LogoUploaderProps) {
  const [uploading, setUploading] = useState(false);

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      const file = acceptedFiles[0];
      if (!file) return;

      setUploading(true);
      const reader = new FileReader();
      reader.onloadend = () => {
        onChange({ ...logo, url: reader.result as string });
        setUploading(false);
      };
      reader.readAsDataURL(file);
    },
    [logo, onChange]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/*": [".png", ".jpg", ".jpeg", ".svg"],
    },
    maxFiles: 1,
    multiple: false,
  });

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Label>Enable Logo</Label>
        <Switch
          checked={logo.enabled}
          onCheckedChange={(enabled) => onChange({ ...logo, enabled })}
        />
      </div>

      {logo.enabled && (
        <>
          <div className="space-y-2">
            <Label>Logo Image</Label>
            {logo.url ? (
              <div className="relative">
                <div className="border rounded-lg p-4 bg-muted/30 flex items-center justify-center">
                  <img
                    src={logo.url}
                    alt="Logo"
                    className="max-h-24 max-w-full object-contain"
                  />
                </div>
                <Button
                  variant="destructive"
                  size="icon"
                  className="absolute top-2 right-2"
                  onClick={() => onChange({ ...logo, url: "" })}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ) : (
              <div
                {...getRootProps()}
                className={cn(
                  "border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors",
                  isDragActive
                    ? "border-primary bg-primary/5"
                    : "border-muted-foreground/25 hover:border-primary/50"
                )}
              >
                <input {...getInputProps()} />
                <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                <p className="text-sm text-muted-foreground">
                  {uploading
                    ? "Uploading..."
                    : isDragActive
                    ? "Drop the logo here"
                    : "Drag & drop logo here, or click to browse"}
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  PNG, JPG, SVG up to 5MB
                </p>
              </div>
            )}
          </div>

          <div className="space-y-2">
            <Label>Logo Position</Label>
            <RadioGroup
              value={logo.position}
              onValueChange={(position: "left" | "center" | "right") =>
                onChange({ ...logo, position })
              }
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="left" id="left" />
                <Label htmlFor="left" className="font-normal cursor-pointer">
                  Left
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="center" id="center" />
                <Label htmlFor="center" className="font-normal cursor-pointer">
                  Center
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="right" id="right" />
                <Label htmlFor="right" className="font-normal cursor-pointer">
                  Right
                </Label>
              </div>
            </RadioGroup>
          </div>

          <div className="space-y-2">
            <Label>Logo Size</Label>
            <RadioGroup
              value={logo.size}
              onValueChange={(size: "small" | "medium" | "large") =>
                onChange({ ...logo, size })
              }
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="small" id="small" />
                <Label htmlFor="small" className="font-normal cursor-pointer">
                  Small
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="medium" id="medium" />
                <Label htmlFor="medium" className="font-normal cursor-pointer">
                  Medium
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="large" id="large" />
                <Label htmlFor="large" className="font-normal cursor-pointer">
                  Large
                </Label>
              </div>
            </RadioGroup>
          </div>
        </>
      )}
    </div>
  );
}
