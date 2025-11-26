import React, { useEffect, useState } from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';
import Card from './ui/Card';
import { formatCurrency } from '../utils/formatters';

const BalanceCard = ({ 
  title, 
  amount, 
  icon: Icon, 
  gradient = 'var(--gradient-primary)',
  trend,
  loading = false 
}) => {
  const [displayAmount, setDisplayAmount] = useState(0);

  // Animated counter effect
  useEffect(() => {
    if (loading) return;
    
    const numericAmount = typeof amount === 'string' 
      ? parseInt(amount.replace(/[^0-9]/g, '')) 
      : amount || 0;

    let start = 0;
    const duration = 1000;
    const increment = numericAmount / (duration / 16);

    const timer = setInterval(() => {
      start += increment;
      if (start >= numericAmount) {
        setDisplayAmount(numericAmount);
        clearInterval(timer);
      } else {
        setDisplayAmount(Math.floor(start));
      }
    }, 16);

    return () => clearInterval(timer);
  }, [amount, loading]);

  return (
    <Card className="relative overflow-hidden">
      {/* Gradient Background */}
      <div
        className="absolute inset-0 opacity-10"
        style={{ background: gradient }}
      />

      {/* Content */}
      <div className="relative z-10">
        <div className="flex items-start justify-between mb-4">
          <div>
            <p className="text-sm text-secondary mb-1">{title}</p>
            {loading ? (
              <div className="h-8 w-32 bg-tertiary animate-pulse rounded" style={{ background: 'var(--bg-tertiary)' }} />
            ) : (
              <h2 className="text-3xl font-bold text-primary">
                {formatCurrency(displayAmount)}
              </h2>
            )}
          </div>

          {/* Icon */}
          <div
            className="p-3 rounded-lg"
            style={{
              background: gradient,
              boxShadow: '0 4px 15px rgba(0, 0, 0, 0.1)',
            }}
          >
            <Icon size={24} color="white" />
          </div>
        </div>

        {/* Trend Indicator */}
        {trend && !loading && (
          <div className="flex items-center gap-2">
            {trend.direction === 'up' ? (
              <TrendingUp size={16} color="var(--accent-success)" />
            ) : (
              <TrendingDown size={16} color="var(--accent-danger)" />
            )}
            <span
              className="text-sm font-medium"
              style={{
                color: trend.direction === 'up' ? 'var(--accent-success)' : 'var(--accent-danger)',
              }}
            >
              {trend.value}
            </span>
            <span className="text-xs text-tertiary">{trend.label}</span>
          </div>
        )}
      </div>
    </Card>
  );
};

export default BalanceCard;
