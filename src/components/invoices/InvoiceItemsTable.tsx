// src/components/invoices/InvoiceItemsTable.tsx
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, Trash2 } from "lucide-react";

interface InvoiceItemsTableProps {
  items: any[];
  register: any;
  onAdd: () => void;
  onRemove: (index: number) => void;
}

export function InvoiceItemsTable({
  items,
  register,
  onAdd,
  onRemove,
}: InvoiceItemsTableProps) {
  return (
    <div className="space-y-4">
      {items.map((item, index) => (
        <div
          key={index}
          className="grid grid-cols-12 gap-4 items-end pb-4 border-b last:border-0"
        >
          <div className="col-span-12 md:col-span-5">
            <Label>Description</Label>
            <Input
              {...register(`items.${index}.description`)}
              placeholder="Service or product"
            />
          </div>
          <div className="col-span-4 md:col-span-2">
            <Label>Quantity</Label>
            <Input
              type="number"
              {...register(`items.${index}.quantity`, { valueAsNumber: true })}
              min="1"
            />
          </div>
          <div className="col-span-4 md:col-span-2">
            <Label>Price</Label>
            <Input
              type="number"
              {...register(`items.${index}.unitPrice`, { valueAsNumber: true })}
              step="0.01"
              min="0"
            />
          </div>
          <div className="col-span-3 md:col-span-2">
            <Label>Amount</Label>
            <Input value={`$${item.amount.toFixed(2)}`} disabled />
          </div>
          <div className="col-span-1 md:col-span-1">
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={() => onRemove(index)}
              disabled={items.length === 1}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      ))}
      <Button
        type="button"
        variant="outline"
        onClick={onAdd}
        className="w-full"
      >
        <Plus className="h-4 w-4 mr-2" />
        Add Item
      </Button>
    </div>
  );
}
