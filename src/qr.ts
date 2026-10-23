import QRCode from 'qrcode';

declare global {
  interface Window {
    generateAppQRCode: (text: string, options?: any) => Promise<string>;
    renderAppQRCodeToCanvas: (canvas: HTMLCanvasElement, text: string, options?: any) => Promise<void>;
  }
}

window.generateAppQRCode = async (text: string, options = {}) => {
  return QRCode.toDataURL(text, {
    errorCorrectionLevel: 'Q',
    margin: 2,
    color: {
      dark: '#301934',
      light: '#ffffff',
    },
    ...options,
  });
};

window.renderAppQRCodeToCanvas = async (canvas: HTMLCanvasElement, text: string, options = {}) => {
  await QRCode.toCanvas(canvas, text, {
    errorCorrectionLevel: 'Q',
    margin: 2,
    scale: 8,
    color: {
      dark: '#301934',
      light: '#ffffff',
    },
    ...options,
  });
};
