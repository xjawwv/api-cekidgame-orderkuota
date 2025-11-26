import React, { useState } from 'react';
import { RefreshCw, Search, ChevronLeft, ChevronRight } from 'lucide-react';
import Card from './ui/Card';
import Button from './ui/Button';
import { formatCurrency, formatDate } from '../utils/formatters';

const TransactionHistory = ({ transactions = [], onRefresh, loading = false }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Filter transactions
  const filteredTransactions = transactions.filter(tx => 
    tx.keterangan?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    tx.kredit?.includes(searchTerm) ||
    tx.debit?.includes(searchTerm)
  );

  // Pagination
  const totalPages = Math.ceil(filteredTransactions.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedTransactions = filteredTransactions.slice(startIndex, startIndex + itemsPerPage);

  const getBrandFromKeterangan = (keterangan) => {
    if (!keterangan) return '-';
    if (keterangan.includes('DANA')) return 'DANA';
    if (keterangan.includes('GOPAY')) return 'GOPAY';
    if (keterangan.includes('OVO')) return 'OVO';
    if (keterangan.includes('SHOPEE')) return 'SHOPEEPAY';
    return 'QRIS';
  };

  const getStatusBadge = (kredit, debit) => {
    if (kredit && kredit !== '' && kredit !== 'Rp 0') {
      return (
        <span className="badge badge-success">
          Berhasil
        </span>
      );
    }
    return (
      <span className="badge badge-info">
        Keluar
        </span>
    );
  };

  return (
    <Card>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-bold">Riwayat Transaksi</h3>
        <Button
          variant="ghost"
          icon={RefreshCw}
          onClick={onRefresh}
          loading={loading}
        >
          Refresh
        </Button>
      </div>

      {/* Search */}
      <div className="mb-4 relative">
        <Search
          size={18}
          style={{
            position: 'absolute',
            left: '12px',
            top: '50%',
            transform: 'translateY(-50%)',
            color: 'var(--text-tertiary)',
          }}
        />
        <input
          type="text"
          placeholder="Cari transaksi..."
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setCurrentPage(1);
          }}
          className="input"
          style={{ paddingLeft: '40px' }}
        />
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr style={{ borderBottom: '2px solid var(--border-color)' }}>
              <th className="text-left py-3 px-2 text-sm font-semibold text-secondary">Tanggal</th>
              <th className="text-left py-3 px-2 text-sm font-semibold text-secondary">Keterangan</th>
              <th className="text-left py-3 px-2 text-sm font-semibold text-secondary">Brand</th>
              <th className="text-right py-3 px-2 text-sm font-semibold text-secondary">Debit</th>
              <th className="text-right py-3 px-2 text-sm font-semibold text-secondary">Kredit</th>
              <th className="text-center py-3 px-2 text-sm font-semibold text-secondary">Status</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              // Loading skeleton
              Array.from({ length: 5 }).map((_, i) => (
                <tr key={i} style={{ borderBottom: '1px solid var(--border-color)' }}>
                  {Array.from({ length: 6 }).map((_, j) => (
                    <td key={j} className="py-3 px-2">
                      <div
                        className="h-4 rounded animate-pulse"
                        style={{ background: 'var(--bg-tertiary)' }}
                      />
                    </td>
                  ))}
                </tr>
              ))
            ) : paginatedTransactions.length > 0 ? (
              paginatedTransactions.map((tx, index) => (
                <tr
                  key={index}
                  style={{ borderBottom: '1px solid var(--border-color)' }}
                  className="hover:bg-tertiary transition-colors"
                >
                  <td className="py-3 px-2 text-sm">{formatDate(tx.tanggal)}</td>
                  <td className="py-3 px-2 text-sm">{tx.keterangan || '-'}</td>
                  <td className="py-3 px-2">
                    <span
                      className="text-xs font-semibold px-2 py-1 rounded"
                      style={{
                        background: 'var(--bg-tertiary)',
                        color: 'var(--text-primary)',
                      }}
                    >
                      {getBrandFromKeterangan(tx.keterangan)}
                    </span>
                  </td>
                  <td className="py-3 px-2 text-sm text-right font-medium" style={{ color: 'var(--accent-danger)' }}>
                    {tx.debit && tx.debit !== '' ? tx.debit : '-'}
                  </td>
                  <td className="py-3 px-2 text-sm text-right font-medium" style={{ color: 'var(--accent-success)' }}>
                    {tx.kredit && tx.kredit !== '' ? tx.kredit : '-'}
                  </td>
                  <td className="py-3 px-2 text-center">
                    {getStatusBadge(tx.kredit, tx.debit)}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="py-12 text-center">
                  <div className="flex flex-col items-center gap-2">
                    <p className="text-secondary">Tidak ada transaksi</p>
                    <p className="text-xs text-tertiary">
                      {searchTerm ? 'Coba kata kunci lain' : 'Transaksi akan muncul di sini'}
                    </p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between mt-4 pt-4 border-t" style={{ borderColor: 'var(--border-color)' }}>
          <p className="text-sm text-secondary">
            Menampilkan {startIndex + 1}-{Math.min(startIndex + itemsPerPage, filteredTransactions.length)} dari {filteredTransactions.length} transaksi
          </p>

          <div className="flex gap-2">
            <Button
              variant="ghost"
              size="sm"
              icon={ChevronLeft}
              onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
              disabled={currentPage === 1}
            />
            <span className="px-4 py-2 text-sm font-medium">
              {currentPage} / {totalPages}
            </span>
            <Button
              variant="ghost"
              size="sm"
              icon={ChevronRight}
              onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
              disabled={currentPage === totalPages}
            />
          </div>
        </div>
      )}
    </Card>
  );
};

export default TransactionHistory;
