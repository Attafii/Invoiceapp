"use client"

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { format } from 'date-fns';
import { Save, FileText, Send } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DatePicker } from '@/components/ui/date-picker';
import { LineItems } from '@/components/invoice/line-items';
import { InvoiceSummary } from '@/components/invoice/invoice-summary';

import { invoiceFormSchema, type InvoiceFormSchema } from '@/lib/validations';
import { createInvoiceFromForm } from '@/lib/invoice-utils';
import { Invoice } from '@/types/invoice';

interface InvoiceFormProps {
  onSave?: (invoice: Invoice) => void;
  onSend?: (invoice: Invoice) => void;
  initialData?: Partial<InvoiceFormSchema>;
}

export function InvoiceForm({ onSave, onSend, initialData }: InvoiceFormProps) {
  const [invoiceDate, setInvoiceDate] = useState<Date | undefined>(
    initialData?.invoiceDate ? new Date(initialData.invoiceDate) : new Date()
  );
  const [dueDate, setDueDate] = useState<Date | undefined>(
    initialData?.dueDate ? new Date(initialData.dueDate) : undefined
  );

  const {
    register,
    control,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<InvoiceFormSchema>({
    resolver: zodResolver(invoiceFormSchema),
    defaultValues: {
      clientName: initialData?.clientName || '',
      clientAddress: initialData?.clientAddress || '',
      invoiceDate: initialData?.invoiceDate || format(new Date(), 'yyyy-MM-dd'),
      dueDate: initialData?.dueDate || '',
      lineItems: initialData?.lineItems || [
        {
          description: '',
          quantity: 1,
          unitPrice: 0,
        },
      ],
      taxRate: initialData?.taxRate || 20,
    },
  });

  const watchedLineItems = watch('lineItems');
  const watchedTaxRate = watch('taxRate');

  // Update form values when date pickers change
  React.useEffect(() => {
    if (invoiceDate) {
      setValue('invoiceDate', format(invoiceDate, 'yyyy-MM-dd'));
    }
  }, [invoiceDate, setValue]);

  React.useEffect(() => {
    if (dueDate) {
      setValue('dueDate', format(dueDate, 'yyyy-MM-dd'));
    }
  }, [dueDate, setValue]);

  const handleSave = async (data: InvoiceFormSchema) => {
    try {
      const invoice = createInvoiceFromForm(data);
      onSave?.(invoice);
    } catch (error) {
      console.error('Error saving invoice:', error);
    }
  };

  const handleSend = async (data: InvoiceFormSchema) => {
    try {
      const invoice = createInvoiceFromForm(data);
      invoice.status = 'sent';
      onSend?.(invoice);
    } catch (error) {
      console.error('Error sending invoice:', error);
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Create Invoice</h1>
        <div className="flex items-center gap-3">
          <Button
            type="button"
            variant="outline"
            onClick={handleSubmit(handleSave)}
            disabled={isSubmitting}
            className="flex items-center gap-2"
          >
            <Save className="h-4 w-4" />
            Save Draft
          </Button>
          <Button
            type="button"
            onClick={handleSubmit(handleSend)}
            disabled={isSubmitting}
            className="flex items-center gap-2"
          >
            <Send className="h-4 w-4" />
            Send Invoice
          </Button>
        </div>
      </div>

      <form onSubmit={handleSubmit(handleSave)} className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Client Information */}
          <div className="lg:col-span-2 space-y-6">
            {/* Client Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Client Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="clientName">Client Name *</Label>
                  <Input
                    id="clientName"
                    {...register('clientName')}
                    placeholder="Enter client name"
                    className={errors.clientName ? 'border-red-500' : ''}
                  />
                  {errors.clientName && (
                    <p className="text-sm text-red-500 mt-1">
                      {errors.clientName.message}
                    </p>
                  )}
                </div>

                <div>
                  <Label htmlFor="clientAddress">Client Address *</Label>
                  <Textarea
                    id="clientAddress"
                    {...register('clientAddress')}
                    placeholder="Enter client address"
                    rows={3}
                    className={errors.clientAddress ? 'border-red-500' : ''}
                  />
                  {errors.clientAddress && (
                    <p className="text-sm text-red-500 mt-1">
                      {errors.clientAddress.message}
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Line Items */}
            <Card>
              <CardHeader>
                <CardTitle>Invoice Items</CardTitle>
              </CardHeader>
              <CardContent>
                <LineItems control={control} errors={errors} />
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Invoice Details & Summary */}
          <div className="space-y-6">
            {/* Invoice Details */}
            <Card>
              <CardHeader>
                <CardTitle>Invoice Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label>Invoice Date *</Label>
                  <DatePicker
                    value={invoiceDate}
                    onChange={setInvoiceDate}
                    placeholder="Select invoice date"
                  />
                  {errors.invoiceDate && (
                    <p className="text-sm text-red-500 mt-1">
                      {errors.invoiceDate.message}
                    </p>
                  )}
                </div>

                <div>
                  <Label>Due Date *</Label>
                  <DatePicker
                    value={dueDate}
                    onChange={setDueDate}
                    placeholder="Select due date"
                  />
                  {errors.dueDate && (
                    <p className="text-sm text-red-500 mt-1">
                      {errors.dueDate.message}
                    </p>
                  )}
                </div>

                <div>
                  <Label htmlFor="taxRate">Tax Rate (%)</Label>
                  <Input
                    id="taxRate"
                    type="number"
                    step="0.01"
                    min="0"
                    max="100"
                    {...register('taxRate', { valueAsNumber: true })}
                    placeholder="20"
                    className={errors.taxRate ? 'border-red-500' : ''}
                  />
                  {errors.taxRate && (
                    <p className="text-sm text-red-500 mt-1">
                      {errors.taxRate.message}
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Invoice Summary */}
            <InvoiceSummary lineItems={watchedLineItems} taxRate={watchedTaxRate} />
          </div>
        </div>
      </form>
    </div>
  );
}