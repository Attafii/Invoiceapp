"use client"

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { 
  calculateLineItemAmount, 
  calculateSubtotal, 
  calculateTax, 
  calculateTotal, 
  formatCurrency 
} from '@/lib/invoice-utils';
import { LineItem } from '@/types/invoice';

interface InvoiceSummaryProps {
  lineItems: Array<{
    description: string;
    quantity: number;
    unitPrice: number;
  }>;
  taxRate: number;
}

export function InvoiceSummary({ lineItems, taxRate }: InvoiceSummaryProps) {
  // Convert form line items to LineItem format for calculations
  const formattedLineItems: LineItem[] = lineItems.map((item, index) => ({
    id: `item-${index + 1}`,
    description: item.description,
    quantity: item.quantity,
    unitPrice: item.unitPrice,
    amount: calculateLineItemAmount(item.quantity, item.unitPrice)
  }));

  const subtotal = calculateSubtotal(formattedLineItems);
  const tax = calculateTax(subtotal, taxRate);
  const total = calculateTotal(subtotal, tax);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Invoice Summary</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Subtotal:</span>
          <span className="font-medium">{formatCurrency(subtotal)}</span>
        </div>
        
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Tax ({taxRate}%):</span>
          <span className="font-medium">{formatCurrency(tax)}</span>
        </div>
        
        <Separator />
        
        <div className="flex justify-between text-lg font-bold">
          <span>Total:</span>
          <span className="text-blue-600">{formatCurrency(total)}</span>
        </div>
        
        {formattedLineItems.length > 0 && (
          <>
            <Separator />
            <div className="space-y-2 text-xs text-gray-500">
              <div className="font-medium">Items:</div>
              {formattedLineItems.map((item, index) => (
                item.description && (
                  <div key={index} className="flex justify-between">
                    <span className="truncate mr-2">
                      {item.description} (×{item.quantity})
                    </span>
                    <span>{formatCurrency(item.amount)}</span>
                  </div>
                )
              ))}
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}