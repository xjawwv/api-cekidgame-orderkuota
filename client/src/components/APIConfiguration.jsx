import React, { useState } from 'react';
import { Copy, Key, Trash2, ChevronDown, ChevronUp, Check } from 'lucide-react';
import Card from './ui/Card';
import Button from './ui/Button';
import { copyToClipboard } from '../utils/formatters';

const APIConfiguration = ({ apiKey, onGenerateKey, onDeleteKey, loading = false }) => {
  const [showJSExample, setShowJSExample] = useState(false);
  const [showGenerateQRIS, setShowGenerateQRIS] = useState(false);
  const [copied, setCopied] = useState('');

  const handleCopy = async (text, type) => {
    const success = await copyToClipboard(text);
    if (success) {
      setCopied(type);
      setTimeout(() => setCopied(''), 2000);
    }
  };

  const apiEndpoint = `${window.location.origin}/api/mutasi`;
  const generateQRISEndpoint = `${window.location.origin}/api/qris`;

  const jsExample = `// Contoh penggunaan API dengan JavaScript
const axios = require('axios');

// Get Mutasi QRIS
async function getMutasi() {
  try {
    const response = await axios.get(
      'http://localhost:3003/mutasi/username/token?jenis=IN',
      {
        headers: {
          'Authorization': 'Bearer ${apiKey || 'YOUR_API_KEY'}'
        }
      }
    );
    console.log(response.data);
  } catch (error) {
    console.error('Error:', error.message);
  }
}

// Long Polling - Tunggu transaksi
async function waitTransaction(nominal, startTime) {
  try {
    const response = await axios.get(
      \`http://localhost:3003/mutasi/username/token/\${nominal}/\${startTime}\`,
      {
        headers: {
          'Authorization': 'Bearer ${apiKey || 'YOUR_API_KEY'}'
        }
      }
    );
    console.log('Transaksi ditemukan:', response.data);
  } catch (error) {
    console.error('Error:', error.message);
  }
}

getMutasi();`;

  const generateQRISExample = `// Generate QRIS dengan nominal
async function generateQRIS(qrisString, nominal) {
  try {
    const response = await axios.get(
      \`http://localhost:3003/qris/\${encodeURIComponent(qrisString)}/\${nominal}\`,
      {
        headers: {
          'Authorization': 'Bearer ${apiKey || 'YOUR_API_KEY'}'
        }
      }
    );
    console.log('QRIS Generated:', response.data);
    console.log('Image URL:', response.data.image_url);
  } catch (error) {
    console.error('Error:', error.message);
  }
}

generateQRIS('YOUR_QRIS_STRING', 15000);`;

  return (
    <Card>
      <h3 className="text-xl font-bold mb-4">Konfigurasi API</h3>

      <div className="space-y-4">
        {/* API Key Display */}
        <div>
          <label className="text-sm font-semibold text-secondary mb-2 block">
            API KEY (BEARER TOKEN)
          </label>
          <div className="flex gap-2">
            <div
              className="flex-1 px-4 py-3 rounded-lg font-mono text-sm"
              style={{
                background: 'var(--bg-tertiary)',
                border: '1px solid var(--border-color)',
                wordBreak: 'break-all',
              }}
            >
              {apiKey || 'Belum ada API Key'}
            </div>
            <Button
              variant="ghost"
              icon={copied === 'key' ? Check : Copy}
              onClick={() => handleCopy(apiKey, 'key')}
              disabled={!apiKey}
            />
          </div>
          <p className="text-xs text-tertiary mt-1">
            Gunakan key ini untuk autentikasi. Contoh: YOUR_API_KEY
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3">
          <Button
            variant="success"
            icon={Key}
            onClick={onGenerateKey}
            loading={loading}
            className="flex-1"
          >
            Generate New Key
          </Button>
          <Button
            variant="danger"
            icon={Trash2}
            onClick={onDeleteKey}
            disabled={!apiKey || loading}
            className="flex-1"
          >
            Delete Key
          </Button>
        </div>

        {/* API Endpoints */}
        <div className="space-y-3 pt-4 border-t" style={{ borderColor: 'var(--border-color)' }}>
          <div>
            <label className="text-sm font-semibold text-secondary mb-1 block">
              API Endpoint - Check Transaction
            </label>
            <div className="flex gap-2">
              <code
                className="flex-1 px-3 py-2 rounded text-xs"
                style={{
                  background: 'var(--bg-tertiary)',
                  border: '1px solid var(--border-color)',
                }}
              >
                {apiEndpoint}
              </code>
              <Button
                variant="ghost"
                size="sm"
                icon={copied === 'endpoint' ? Check : Copy}
                onClick={() => handleCopy(apiEndpoint, 'endpoint')}
              />
            </div>
          </div>

          <div>
            <label className="text-sm font-semibold text-secondary mb-1 block">
              Generate QRIS
            </label>
            <div className="flex gap-2">
              <code
                className="flex-1 px-3 py-2 rounded text-xs"
                style={{
                  background: 'var(--bg-tertiary)',
                  border: '1px solid var(--border-color)',
                }}
              >
                {generateQRISEndpoint}
              </code>
              <Button
                variant="ghost"
                size="sm"
                icon={copied === 'qris-endpoint' ? Check : Copy}
                onClick={() => handleCopy(generateQRISEndpoint, 'qris-endpoint')}
              />
            </div>
          </div>
        </div>

        {/* JavaScript Example - Collapsible */}
        <div className="border rounded-lg" style={{ borderColor: 'var(--border-color)' }}>
          <button
            onClick={() => setShowJSExample(!showJSExample)}
            className="w-full flex items-center justify-between p-4 hover:bg-tertiary transition-colors"
            style={{ background: showJSExample ? 'var(--bg-tertiary)' : 'transparent' }}
          >
            <span className="font-semibold">📝 JavaScript Example</span>
            {showJSExample ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
          </button>

          {showJSExample && (
            <div className="p-4 border-t" style={{ borderColor: 'var(--border-color)' }}>
              <div className="relative">
                <pre
                  className="p-4 rounded-lg overflow-x-auto text-xs"
                  style={{
                    background: 'var(--bg-tertiary)',
                    border: '1px solid var(--border-color)',
                  }}
                >
                  <code>{jsExample}</code>
                </pre>
                <Button
                  variant="ghost"
                  size="sm"
                  icon={copied === 'js-example' ? Check : Copy}
                  onClick={() => handleCopy(jsExample, 'js-example')}
                  className="absolute top-2 right-2"
                />
              </div>
            </div>
          )}
        </div>

        {/* Generate QRIS Example - Collapsible */}
        <div className="border rounded-lg" style={{ borderColor: 'var(--border-color)' }}>
          <button
            onClick={() => setShowGenerateQRIS(!showGenerateQRIS)}
            className="w-full flex items-center justify-between p-4 hover:bg-tertiary transition-colors"
            style={{ background: showGenerateQRIS ? 'var(--bg-tertiary)' : 'transparent' }}
          >
            <span className="font-semibold">🎨 Generate QRIS</span>
            {showGenerateQRIS ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
          </button>

          {showGenerateQRIS && (
            <div className="p-4 border-t" style={{ borderColor: 'var(--border-color)' }}>
              <div className="relative">
                <pre
                  className="p-4 rounded-lg overflow-x-auto text-xs"
                  style={{
                    background: 'var(--bg-tertiary)',
                    border: '1px solid var(--border-color)',
                  }}
                >
                  <code>{generateQRISExample}</code>
                </pre>
                <Button
                  variant="ghost"
                  size="sm"
                  icon={copied === 'qris-example' ? Check : Copy}
                  onClick={() => handleCopy(generateQRISExample, 'qris-example')}
                  className="absolute top-2 right-2"
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </Card>
  );
};

export default APIConfiguration;
