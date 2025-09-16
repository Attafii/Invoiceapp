"use client"

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { 
  FileText, 
  Download, 
  Send, 
  Edit,
  Calendar,
  User,
  MapPin
} from 'lucide-react';

import { Invoice } from '@/types/invoice';
import { formatCurrency, formatDate } from '@/lib/invoice-utils';

interface InvoiceDisplayProps {
  invoice: Invoice;
  onEdit?: () => void;
  onDownload?: () => void;
  onSend?: () => void;
}

const statusColors = {
  draft: 'bg-gray-100 text-gray-800',
  sent: 'bg-blue-100 text-blue-800',
  paid: 'bg-green-100 text-green-800',
  overdue: 'bg-red-100 text-red-800',
};

const statusLabels = {
  draft: 'Draft',
  sent: 'Sent',
  paid: 'Paid',
  overdue: 'Overdue',
};

export function InvoiceDisplay({ 
  invoice, 
  onEdit, 
  onDownload, 
  onSend 
}: InvoiceDisplayProps) {
  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <h1 className="text-3xl font-bold text-gray-900">
            {invoice.invoiceNumber}
          </h1>
          <Badge 
            variant="secondary" 
            className={statusColors[invoice.status]}
          >
            {statusLabels[invoice.status]}
          </Badge>
        </div>
        
        <div className="flex items-center gap-2">
          {onEdit && (
            <Button variant="outline" onClick={onEdit} size="sm">
              <Edit className="h-4 w-4 mr-2" />
              Edit
            </Button>
          )}
          {onDownload && (
            <Button variant="outline" onClick={onDownload} size="sm">
              <Download className="h-4 w-4 mr-2" />
              Download
            </Button>
          )}
          {onSend && invoice.status === 'draft' && (
            <Button onClick={onSend} size="sm">
              <Send className="h-4 w-4 mr-2" />
              Send
            </Button>
          )}
        </div>
      </div>

      {/* Invoice Details */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Client Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <User className="h-5 w-5" />
              Bill To
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <p className="font-semibold text-lg">{invoice.client.name}</p>
              <div className="flex items-start gap-2 text-gray-600">
                <MapPin className="h-4 w-4 mt-1 flex-shrink-0" />
                <p className="whitespace-pre-line">{invoice.client.address}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Invoice Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <FileText className="h-5 w-5" />
              Invoice Details
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-gray-500" />
                <span className="text-sm text-gray-600">Invoice Date:</span>
                <span className="font-medium">{formatDate(invoice.invoiceDate)}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-gray-500" />
                <span className="text-sm text-gray-600">Due Date:</span>
                <span className="font-medium">{formatDate(invoice.dueDate)}</span>
              </div>
              <div className="text-sm text-gray-600">
                <span>Created:</span>
                <span className="ml-2 font-medium">{formatDate(invoice.createdAt)}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Line Items */}
      <Card>
        <CardHeader>
          <CardTitle>Items</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[50%]">Description</TableHead>
                <TableHead className="text-right">Qty</TableHead>
                <TableHead className="text-right">Unit Price</TableHead>
                <TableHead className="text-right">Amount</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {invoice.lineItems.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="font-medium">
                    {item.description}
                  </TableCell>
                  <TableCell className="text-right">
                    {item.quantity}
                  </TableCell>
                  <TableCell className="text-right">
                    {formatCurrency(item.unitPrice)}
                  </TableCell>
                  <TableCell className="text-right font-medium">
                    {formatCurrency(item.amount)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          <div className="mt-6 space-y-2">
            <Separator />
            <div className="flex justify-end">
              <div className="w-64 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Subtotal:</span>
                  <span>{formatCurrency(invoice.subtotal)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Tax ({invoice.taxRate}%):</span>
                  <span>{formatCurrency(invoice.tax)}</span>
                </div>
                <Separator />
                <div className="flex justify-between text-lg font-bold">
                  <span>Total:</span>
                  <span className="text-blue-600">
                    {formatCurrency(invoice.total)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}