"use client"

import React from 'react';
import { useFieldArray, Control, useWatch } from 'react-hook-form';
import { Plus, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { InvoiceFormSchema } from '@/lib/validations';
import { calculateLineItemAmount, formatCurrency } from '@/lib/invoice-utils';

interface LineItemsProps {
  control: Control<InvoiceFormSchema>;
  errors: any;
}

export function LineItems({ control, errors }: LineItemsProps) {
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'lineItems',
  });

  const watchedLineItems = useWatch({
    control,
    name: 'lineItems',
  });

  const addLineItem = () => {
    append({
      description: '',
      quantity: 1,
      unitPrice: 0,
    });
  };

  const removeLineItem = (index: number) => {
    if (fields.length > 1) {
      remove(index);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Label className="text-base font-semibold">Line Items</Label>
        <Button
          type="button"
          onClick={addLineItem}
          size="sm"
          className="flex items-center gap-2"
        >
          <Plus className="h-4 w-4" />
          Add Item
        </Button>
      </div>

      <div className="space-y-3">
        {fields.map((field, index) => {
          const quantity = watchedLineItems?.[index]?.quantity || 0;
          const unitPrice = watchedLineItems?.[index]?.unitPrice || 0;
          const amount = calculateLineItemAmount(quantity, unitPrice);

          return (
            <Card key={field.id} className="p-4">
              <CardContent className="p-0">
                <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end">
                  {/* Description */}
                  <div className="md:col-span-5">
                    <Label htmlFor={`lineItems.${index}.description`}>
                      Description
                    </Label>
                    <Input
                      id={`lineItems.${index}.description`}
                      {...control.register(`lineItems.${index}.description`)}
                      placeholder="Enter item description"
                      className={errors?.lineItems?.[index]?.description ? 'border-red-500' : ''}
                    />
                    {errors?.lineItems?.[index]?.description && (
                      <p className="text-sm text-red-500 mt-1">
                        {errors.lineItems[index].description.message}
                      </p>
                    )}
                  </div>

                  {/* Quantity */}
                  <div className="md:col-span-2">
                    <Label htmlFor={`lineItems.${index}.quantity`}>
                      Quantity
                    </Label>
                    <Input
                      id={`lineItems.${index}.quantity`}
                      type="number"
                      step="0.01"
                      min="0"
                      {...control.register(`lineItems.${index}.quantity`, {
                        valueAsNumber: true,
                      })}
                      placeholder="1"
                      className={errors?.lineItems?.[index]?.quantity ? 'border-red-500' : ''}
                    />
                    {errors?.lineItems?.[index]?.quantity && (
                      <p className="text-sm text-red-500 mt-1">
                        {errors.lineItems[index].quantity.message}
                      </p>
                    )}
                  </div>

                  {/* Unit Price */}
                  <div className="md:col-span-2">
                    <Label htmlFor={`lineItems.${index}.unitPrice`}>
                      Unit Price (€)
                    </Label>
                    <Input
                      id={`lineItems.${index}.unitPrice`}
                      type="number"
                      step="0.01"
                      min="0"
                      {...control.register(`lineItems.${index}.unitPrice`, {
                        valueAsNumber: true,
                      })}
                      placeholder="0.00"
                      className={errors?.lineItems?.[index]?.unitPrice ? 'border-red-500' : ''}
                    />
                    {errors?.lineItems?.[index]?.unitPrice && (
                      <p className="text-sm text-red-500 mt-1">
                        {errors.lineItems[index].unitPrice.message}
                      </p>
                    )}
                  </div>

                  {/* Amount */}
                  <div className="md:col-span-2">
                    <Label>Amount</Label>
                    <div className="p-2 bg-gray-50 rounded-md border text-sm font-medium">
                      {formatCurrency(amount)}
                    </div>
                  </div>

                  {/* Remove Button */}
                  <div className="md:col-span-1">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => removeLineItem(index)}
                      disabled={fields.length === 1}
                      className="w-full"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {errors?.lineItems && typeof errors.lineItems === 'object' && !Array.isArray(errors.lineItems) && (
        <p className="text-sm text-red-500">
          {errors.lineItems.message}
        </p>
      )}
    </div>
  );
}