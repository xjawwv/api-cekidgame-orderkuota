import React, { useState, useEffect } from 'react';
import { Wallet, QrCode, TrendingUp } from 'lucide-react';
import Sidebar from '../components/Sidebar';
import BalanceCard from '../components/BalanceCard';
import QRISProfile from '../components/QRISProfile';
import APIConfiguration from '../components/APIConfiguration';
import TransactionHistory from '../components/TransactionHistory';
import { apiService } from '../services/api';
import { usePolling } from '../hooks/usePolling';

const Dashboard = () => {
  const [auth, setAuth] = useState(null);
  const [balance, setBalance] = useState({ total: 0, qris: 0 });
  const [transactions, setTransactions] = useState([]);
  const [apiKey, setApiKey] = useState('');
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  // Load auth from localStorage
  useEffect(() => {
    const savedAuth = localStorage.getItem('auth');
    if (savedAuth) {
      const authData = JSON.parse(savedAuth);
      setAuth(authData);
      fetchTransactions(authData);
    }
  }, []);

  // Auto-refresh transactions every 30 seconds
  usePolling(() => {
    if (auth) {
      fetchTransactions(auth, true);
    }
  }, 30000, !!auth);

  const fetchTransactions = async (authData, silent = false) => {
    if (!silent) setLoading(true);
    try {
      const response = await apiService.getMutasi(authData.username, authData.token, 'IN');
      
      if (response.qris_history?.success) {
        setTransactions(response.qris_history.results || []);
        
        // Calculate balance from transactions
        const totalBalance = response.qris_history.results?.reduce((sum, tx) => {
          const amount = parseInt(tx.kredit?.replace(/[^0-9]/g, '') || 0);
          return sum + amount;
        }, 0) || 0;
        
        setBalance({
          total: totalBalance,
          qris: totalBalance,
        });
      }
    } catch (error) {
      console.error('Error fetching transactions:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchTransactions(auth);
    setRefreshing(false);
  };

  const handleSync = async () => {
    await handleRefresh();
  };

  const handleLogout = () => {
    localStorage.removeItem('auth');
    window.location.href = '/';
  };

  const handleGenerateKey = () => {
    // Generate random API key
    const newKey = `sk_${Math.random().toString(36).substring(2, 15)}${Math.random().toString(36).substring(2, 15)}`;
    setApiKey(newKey);
    localStorage.setItem('apiKey', newKey);
  };

  const handleDeleteKey = () => {
    setApiKey('');
    localStorage.removeItem('apiKey');
  };

  // Load API key from localStorage
  useEffect(() => {
    const savedKey = localStorage.getItem('apiKey');
    if (savedKey) {
      setApiKey(savedKey);
    }
  }, []);

  return (
    <div className="flex min-h-screen">
      <Sidebar onLogout={handleLogout} />

      {/* Main Content */}
      <main className="flex-1 lg:ml-64 p-6">
        <div className="container mx-auto max-w-7xl">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold mb-2">
              Dashboard <span className="gradient-text">Payment Gateway</span>
            </h1>
            <p className="text-secondary">
              Selamat datang kembali, {auth?.username || 'User'}! 👋
            </p>
          </div>

          {/* Balance Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            <BalanceCard
              title="Total Saldo"
              amount={balance.total}
              icon={Wallet}
              gradient="var(--gradient-primary)"
              loading={loading}
              trend={{
                direction: 'up',
                value: '+12.5%',
                label: 'dari bulan lalu',
              }}
            />

            <BalanceCard
              title="Saldo QRIS"
              amount={balance.qris}
              icon={QrCode}
              gradient="var(--gradient-success)"
              loading={loading}
            />

            <BalanceCard
              title="Total Transaksi"
              amount={transactions.length}
              icon={TrendingUp}
              gradient="var(--gradient-info)"
              loading={loading}
            />
          </div>

          {/* Main Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            {/* QRIS Profile */}
            <div className="lg:col-span-1">
              <QRISProfile
                qrisString={auth?.qrisString || 'https://qris.id/sample'}
                onSync={handleSync}
                onLogout={handleLogout}
                loading={loading}
              />
            </div>

            {/* API Configuration */}
            <div className="lg:col-span-2">
              <APIConfiguration
                apiKey={apiKey}
                onGenerateKey={handleGenerateKey}
                onDeleteKey={handleDeleteKey}
              />
            </div>
          </div>

          {/* Transaction History */}
          <TransactionHistory
            transactions={transactions}
            onRefresh={handleRefresh}
            loading={refreshing}
          />
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
