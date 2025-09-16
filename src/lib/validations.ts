import { z } from 'zod';

// Line item validation schema
export const lineItemSchema = z.object({
  description: z.string().min(1, 'Description is required').max(200, 'Description is too long'),
  quantity: z.number().min(0.01, 'Quantity must be greater than 0').max(10000, 'Quantity is too large'),
  unitPrice: z.number().min(0, 'Unit price must be greater than or equal to 0').max(1000000, 'Unit price is too large'),
});

// Invoice form validation schema
export const invoiceFormSchema = z.object({
  clientName: z.string().min(1, 'Client name is required').max(100, 'Client name is too long'),
  clientAddress: z.string().min(1, 'Client address is required').max(500, 'Client address is too long'),
  invoiceDate: z.string().min(1, 'Invoice date is required'),
  dueDate: z.string().min(1, 'Due date is required'),
  lineItems: z.array(lineItemSchema).min(1, 'At least one line item is required'),
  taxRate: z.number().min(0, 'Tax rate must be greater than or equal to 0').max(100, 'Tax rate cannot exceed 100%'),
}).refine((data) => {
  const invoiceDate = new Date(data.invoiceDate);
  const dueDate = new Date(data.dueDate);
  return dueDate >= invoiceDate;
}, {
  message: 'Due date must be on or after the invoice date',
  path: ['dueDate'],
});

export type InvoiceFormSchema = z.infer<typeof invoiceFormSchema>;
export type LineItemSchema = z.infer<typeof lineItemSchema>;