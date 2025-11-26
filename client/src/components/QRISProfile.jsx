import React, { useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { Download, RefreshCw, LogOut } from 'lucide-react';
import Card from './ui/Card';
import Button from './ui/Button';

const QRISProfile = ({ qrisString, onSync, onLogout, loading = false }) => {
  const [downloading, setDownloading] = useState(false);

  const handleDownloadQR = () => {
    setDownloading(true);
    try {
      // Get the SVG element
      const svg = document.getElementById('qris-code');
      if (!svg) return;

      // Create canvas
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const svgData = new XMLSerializer().serializeToString(svg);
      const img = new Image();

      img.onload = () => {
        canvas.width = img.width;
        canvas.height = img.height;
        ctx.drawImage(img, 0, 0);

        // Download
        const link = document.createElement('a');
        link.download = `qris-${Date.now()}.png`;
        link.href = canvas.toDataURL('image/png');
        link.click();
        setDownloading(false);
      };

      img.src = 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(svgData)));
    } catch (error) {
      console.error('Error downloading QR:', error);
      setDownloading(false);
    }
  };

  return (
    <Card>
      <h3 className="text-xl font-bold mb-4">Profil QRIS</h3>

      {loading ? (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin">
            <RefreshCw size={32} />
          </div>
        </div>
      ) : qrisString ? (
        <div className="space-y-4">
          {/* QR Code Display */}
          <div className="flex justify-center p-6 bg-white rounded-lg">
            <QRCodeSVG
              id="qris-code"
              value={qrisString}
              size={200}
              level="H"
              includeMargin={true}
            />
          </div>

          {/* Download Button */}
          <Button
            variant="secondary"
            icon={Download}
            onClick={handleDownloadQR}
            loading={downloading}
            className="w-full"
          >
            Unduh QR Code
          </Button>

          {/* Action Buttons */}
          <div className="grid grid-cols-2 gap-3">
            <Button
              variant="ghost"
              icon={LogOut}
              onClick={onLogout}
              className="w-full"
            >
              Logout OrderKuota
            </Button>

            <Button
              variant="primary"
              icon={RefreshCw}
              onClick={onSync}
              className="w-full"
            >
              Sync Manual
            </Button>
          </div>
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-secondary">Tidak ada data QRIS</p>
        </div>
      )}
    </Card>
  );
};

export default QRISProfile;
