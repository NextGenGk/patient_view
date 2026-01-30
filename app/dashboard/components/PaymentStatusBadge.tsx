import React from 'react';
import { CheckCircle2, Clock, XCircle, RefreshCw } from 'lucide-react';
import { TranslatedText } from '../../components/TranslatedText';

interface PaymentStatusBadgeProps {
  status: 'pending' | 'completed' | 'failed' | 'refunded';
  paymentId?: string;
}

export default function PaymentStatusBadge({ status, paymentId }: PaymentStatusBadgeProps) {
  const statusConfig = {
    completed: {
      icon: CheckCircle2,
      text: 'Paid',
      className: 'bg-green-100 text-green-700 border-green-300',
      iconColor: 'text-green-600',
    },
    pending: {
      icon: Clock,
      text: 'Payment Pending',
      className: 'bg-yellow-100 text-yellow-700 border-yellow-300',
      iconColor: 'text-yellow-600',
    },
    failed: {
      icon: XCircle,
      text: 'Payment Failed',
      className: 'bg-red-100 text-red-700 border-red-300',
      iconColor: 'text-red-600',
    },
    refunded: {
      icon: RefreshCw,
      text: 'Refunded',
      className: 'bg-blue-100 text-blue-700 border-blue-300',
      iconColor: 'text-blue-600',
    },
  };

  const config = statusConfig[status] || statusConfig.pending;
  const Icon = config.icon;

  return (
    <div className={`inline-flex items-center space-x-2 px-3 py-1.5 rounded-lg border-2 text-sm font-medium ${config.className}`}>
      <Icon className={`w-4 h-4 ${config.iconColor}`} />
      <span><TranslatedText>{config.text}</TranslatedText></span>
      {paymentId && (
        <span className="text-xs opacity-70 ml-1">
          (ID: {paymentId.slice(-8)})
        </span>
      )}
    </div>
  );
}
