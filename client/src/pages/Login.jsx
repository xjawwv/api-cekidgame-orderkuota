import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Key, Wallet } from 'lucide-react';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Card from '../components/ui/Card';

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: '',
    token: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!formData.username || !formData.token) {
      setError('Semua field harus diisi');
      return;
    }

    setLoading(true);

    try {
      // Save auth to localStorage
      const authData = {
        username: formData.username,
        token: formData.token,
        qrisString: 'https://qris.id/sample', // This should come from API
      };

      localStorage.setItem('auth', JSON.stringify(authData));

      // Redirect to dashboard
      setTimeout(() => {
        navigate('/dashboard');
      }, 500);
    } catch (err) {
      setError('Login gagal. Periksa kembali kredensial Anda.');
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center p-4"
      style={{
        background: 'var(--bg-primary)',
      }}
    >
      {/* Animated Background Elements */}
      <div
        style={{
          position: 'fixed',
          top: '10%',
          left: '10%',
          width: '300px',
          height: '300px',
          background: 'var(--gradient-primary)',
          borderRadius: '50%',
          filter: 'blur(100px)',
          opacity: 0.3,
          animation: 'float 6s ease-in-out infinite',
        }}
      />
      <div
        style={{
          position: 'fixed',
          bottom: '10%',
          right: '10%',
          width: '400px',
          height: '400px',
          background: 'var(--gradient-success)',
          borderRadius: '50%',
          filter: 'blur(100px)',
          opacity: 0.3,
          animation: 'float 8s ease-in-out infinite reverse',
        }}
      />

      <style>
        {`
          @keyframes float {
            0%, 100% {
              transform: translateY(0px);
            }
            50% {
              transform: translateY(-20px);
            }
          }
        `}
      </style>

      {/* Login Card */}
      <Card className="w-full max-w-md relative z-10 animate-fade-in">
        {/* Logo */}
        <div className="text-center mb-8">
          <div
            className="inline-flex items-center justify-center w-16 h-16 mb-4"
            style={{
              background: 'var(--gradient-primary)',
              borderRadius: 'var(--radius-xl)',
            }}
          >
            <Wallet size={32} color="white" />
          </div>
          <h1 className="text-3xl font-bold mb-2">
            <span className="gradient-text">Payment Gateway</span>
          </h1>
          <p className="text-secondary">Masuk ke Dashboard QRIS Anda</p>
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Username OrderKuota"
            name="username"
            type="text"
            placeholder="Masukkan username"
            value={formData.username}
            onChange={handleChange}
            icon={User}
            required
          />

          <Input
            label="Auth Token"
            name="token"
            type="text"
            placeholder="userId:token"
            value={formData.token}
            onChange={handleChange}
            icon={Key}
            required
          />

          {error && (
            <div
              className="p-3 rounded-lg text-sm"
              style={{
                background: 'rgba(239, 68, 68, 0.1)',
                border: '1px solid rgba(239, 68, 68, 0.2)',
                color: 'var(--accent-danger)',
              }}
            >
              {error}
            </div>
          )}

          <Button
            type="submit"
            variant="primary"
            loading={loading}
            className="w-full"
          >
            Masuk ke Dashboard
          </Button>
        </form>

        {/* Info */}
        <div
          className="mt-6 p-4 rounded-lg text-sm"
          style={{
            background: 'var(--bg-tertiary)',
            border: '1px solid var(--border-color)',
          }}
        >
          <p className="text-secondary mb-2">
            <strong>ℹ️ Informasi:</strong>
          </p>
          <ul className="text-tertiary space-y-1 text-xs">
            <li>• Gunakan kredensial OrderKuota Anda</li>
            <li>• Format token: userId:authToken</li>
            <li>• Data disimpan di browser Anda</li>
          </ul>
        </div>
      </Card>
    </div>
  );
};

export default Login;
