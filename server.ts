import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { createUIResource } from '@mcp-ui/server';
import { z } from 'zod';

const server = new McpServer({
  name: 'bitcoin-builder-ui',
  version: '1.0.0',
});

// Common styles for consistent branding
const commonStyles = `
  * {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }
  body {
    font-family: 'SF Pro Display', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    background: linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f0f23 100%);
    color: #e0e0e0;
    min-height: 100vh;
    padding: 24px;
  }
  .container {
    max-width: 420px;
    margin: 0 auto;
    background: rgba(30, 30, 50, 0.95);
    border-radius: 20px;
    padding: 32px;
    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5), 0 0 40px rgba(247, 147, 26, 0.1);
    border: 1px solid rgba(247, 147, 26, 0.2);
  }
  .header {
    text-align: center;
    margin-bottom: 28px;
  }
  .logo {
    width: 56px;
    height: 56px;
    margin-bottom: 16px;
  }
  h1 {
    font-size: 1.75rem;
    font-weight: 700;
    background: linear-gradient(135deg, #F7931A 0%, #FFB84D 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    margin-bottom: 8px;
  }
  .subtitle {
    color: #8892a0;
    font-size: 0.9rem;
  }
  .btn {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    padding: 14px 24px;
    border-radius: 12px;
    font-size: 1rem;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s ease;
    border: none;
    width: 100%;
  }
  .btn-primary {
    background: linear-gradient(135deg, #F7931A 0%, #E8820A 100%);
    color: #000;
    box-shadow: 0 4px 20px rgba(247, 147, 26, 0.4);
  }
  .btn-primary:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 30px rgba(247, 147, 26, 0.5);
  }
  .btn-secondary {
    background: rgba(247, 147, 26, 0.15);
    color: #F7931A;
    border: 1px solid rgba(247, 147, 26, 0.3);
  }
  .btn-secondary:hover {
    background: rgba(247, 147, 26, 0.25);
  }
  .amount-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 12px;
    margin-bottom: 24px;
  }
  .amount-btn {
    padding: 16px 12px;
    background: rgba(255, 255, 255, 0.05);
    border: 2px solid rgba(247, 147, 26, 0.2);
    border-radius: 12px;
    color: #e0e0e0;
    font-size: 0.95rem;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s ease;
  }
  .amount-btn:hover {
    border-color: rgba(247, 147, 26, 0.5);
    background: rgba(247, 147, 26, 0.1);
  }
  .amount-btn.selected {
    border-color: #F7931A;
    background: rgba(247, 147, 26, 0.2);
    color: #F7931A;
  }
  .amount-btn small {
    display: block;
    font-size: 0.75rem;
    color: #6b7280;
    margin-top: 4px;
    font-weight: 400;
  }
  .divider {
    height: 1px;
    background: linear-gradient(90deg, transparent, rgba(247, 147, 26, 0.3), transparent);
    margin: 24px 0;
  }
  .button-group {
    display: flex;
    flex-direction: column;
    gap: 12px;
  }
`;

// Bitcoin SVG logo
const bitcoinLogo = `
<svg class="logo" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
  <circle cx="32" cy="32" r="32" fill="#F7931A"/>
  <path d="M46.1 27.4c.6-4.1-2.5-6.3-6.8-7.8l1.4-5.6-3.4-.8-1.4 5.4c-.9-.2-1.8-.4-2.7-.7l1.4-5.5-3.4-.8-1.4 5.6c-.7-.2-1.5-.4-2.2-.5v0l-4.7-1.2-.9 3.6s2.5.6 2.5.6c1.4.3 1.6 1.2 1.6 1.9l-1.6 6.4c.1 0 .2 0 .3.1-.1 0-.2-.1-.3-.1l-2.2 9c-.2.4-.6 1.1-1.6.8 0 0-2.5-.6-2.5-.6l-1.7 3.9 4.4 1.1c.8.2 1.6.4 2.4.6l-1.4 5.7 3.4.8 1.4-5.6c.9.3 1.8.5 2.7.7l-1.4 5.6 3.4.8 1.4-5.7c5.8 1.1 10.2.7 12-4.6 1.5-4.3-.1-6.7-3.1-8.3 2.2-.5 3.9-2 4.3-5zm-7.7 10.8c-1.1 4.3-8.2 2-10.5 1.4l1.9-7.5c2.3.6 9.7 1.7 8.6 6.1zm1.1-10.9c-1 3.9-6.9 1.9-8.8 1.4l1.7-6.8c1.9.5 8.1 1.4 7.1 5.4z" fill="white"/>
</svg>
`;

// QR Code placeholder SVG
const qrCodePlaceholder = `
<svg viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg" style="width: 100%; height: auto;">
  <rect width="200" height="200" fill="#1a1a2e"/>
  <rect x="20" y="20" width="60" height="60" stroke="#F7931A" stroke-width="4" fill="none"/>
  <rect x="30" y="30" width="40" height="40" fill="#F7931A"/>
  <rect x="120" y="20" width="60" height="60" stroke="#F7931A" stroke-width="4" fill="none"/>
  <rect x="130" y="30" width="40" height="40" fill="#F7931A"/>
  <rect x="20" y="120" width="60" height="60" stroke="#F7931A" stroke-width="4" fill="none"/>
  <rect x="30" y="130" width="40" height="40" fill="#F7931A"/>
  <rect x="90" y="90" width="20" height="20" fill="#F7931A"/>
  <rect x="120" y="120" width="20" height="20" fill="#F7931A"/>
  <rect x="150" y="120" width="20" height="20" fill="#F7931A"/>
  <rect x="120" y="150" width="20" height="20" fill="#F7931A"/>
  <rect x="150" y="150" width="20" height="20" fill="#F7931A"/>
  <text x="100" y="105" text-anchor="middle" fill="#6b7280" font-size="12" font-family="system-ui">QR Code</text>
</svg>
`;

/**
 * Tool: show_tip_jar
 * Displays a Lightning tip jar widget with Bitcoin Builder branding
 */
server.tool('show_tip_jar', 'Displays a Lightning Network tip jar widget with amount selection', {}, async () => {
  const html = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <style>
        ${commonStyles}
        .qr-container {
          background: rgba(255, 255, 255, 0.03);
          border-radius: 16px;
          padding: 20px;
          margin-bottom: 24px;
          border: 1px solid rgba(255, 255, 255, 0.05);
        }
        .qr-placeholder {
          width: 180px;
          height: 180px;
          margin: 0 auto;
          border-radius: 12px;
          overflow: hidden;
        }
        .qr-label {
          text-align: center;
          color: #6b7280;
          font-size: 0.85rem;
          margin-top: 12px;
        }
        .selected-amount {
          text-align: center;
          padding: 16px;
          background: rgba(247, 147, 26, 0.1);
          border-radius: 12px;
          margin-bottom: 24px;
          border: 1px solid rgba(247, 147, 26, 0.2);
        }
        .selected-amount .label {
          font-size: 0.85rem;
          color: #8892a0;
          margin-bottom: 4px;
        }
        .selected-amount .value {
          font-size: 1.5rem;
          font-weight: 700;
          color: #F7931A;
        }
        .selected-amount .value small {
          font-size: 0.9rem;
          font-weight: 400;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          ${bitcoinLogo}
          <h1>Bitcoin Builder</h1>
          <p class="subtitle">Lightning Network Tip Jar</p>
        </div>

        <div class="qr-container">
          <div class="qr-placeholder">
            ${qrCodePlaceholder}
          </div>
          <p class="qr-label">Select an amount to generate invoice</p>
        </div>

        <div class="selected-amount">
          <p class="label">Selected Amount</p>
          <p class="value" id="selectedValue">5,000 <small>sats</small></p>
        </div>

        <div class="amount-grid">
          <button class="amount-btn" data-amount="1000" onclick="selectAmount(1000)">
            1,000
            <small>sats</small>
          </button>
          <button class="amount-btn selected" data-amount="5000" onclick="selectAmount(5000)">
            5,000
            <small>sats</small>
          </button>
          <button class="amount-btn" data-amount="10000" onclick="selectAmount(10000)">
            10,000
            <small>sats</small>
          </button>
        </div>

        <div class="divider"></div>

        <div class="button-group">
          <button class="btn btn-primary" onclick="generateInvoice()">
            Generate Invoice
          </button>
          <button class="btn btn-secondary" onclick="checkPayment()">
            Check Payment Status
          </button>
        </div>
      </div>

      <script>
        let selectedAmount = 5000;

        function selectAmount(amount) {
          selectedAmount = amount;

          // Update button states
          document.querySelectorAll('.amount-btn').forEach(btn => {
            btn.classList.remove('selected');
            if (parseInt(btn.dataset.amount) === amount) {
              btn.classList.add('selected');
            }
          });

          // Update display
          document.getElementById('selectedValue').innerHTML =
            amount.toLocaleString() + ' <small>sats</small>';
        }

        function generateInvoice() {
          window.parent.postMessage({
            type: 'tool',
            payload: {
              toolName: 'generate_invoice',
              params: { amount: selectedAmount }
            }
          }, '*');
        }

        function checkPayment() {
          window.parent.postMessage({
            type: 'tool',
            payload: {
              toolName: 'check_payment',
              params: {}
            }
          }, '*');
        }
      </script>
    </body>
    </html>
  `;

  return {
    content: [
      createUIResource({
        uri: 'ui://tip-jar/main',
        content: { type: 'rawHtml', htmlString: html },
        encoding: 'text',
      }),
    ],
  };
});

/**
 * Tool: generate_invoice
 * Generates a Lightning invoice for the specified amount
 */
server.tool(
  'generate_invoice',
  'Generates a Lightning Network invoice for the specified amount in satoshis',
  {
    amount: z.number().positive().describe('Amount in satoshis'),
  },
  async ({ amount }) => {
    // Generate a mock BOLT11 invoice string
    const mockBolt11 = `lnbc${amount}n1pj9npkpp5hl6djf8jrh0c4t8v9gt7j3s5tkf8q5w9hzv7m2tc5e9qjq4s7${Math.random().toString(36).substring(2, 15)}sp5qypqxpq9qcrsszg2pvxq6rs0zqg3yyc5z5tpwxqerq0d5xjmr9qdqqcqzzsxqyz5vqsp5usv5j3h3h8qmxxc5g5h5k5n5r5t5w5y525355a5c5e5g5i5k5m5q9qyyssq${Math.random().toString(36).substring(2, 30)}qp5zv3ns`;

    const html = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>
          ${commonStyles}
          .invoice-box {
            background: rgba(0, 0, 0, 0.3);
            border-radius: 12px;
            padding: 20px;
            margin-bottom: 24px;
            border: 1px solid rgba(247, 147, 26, 0.2);
          }
          .invoice-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 16px;
          }
          .invoice-label {
            font-size: 0.85rem;
            color: #8892a0;
          }
          .invoice-amount {
            font-size: 1.25rem;
            font-weight: 700;
            color: #F7931A;
          }
          .qr-container {
            background: white;
            border-radius: 12px;
            padding: 16px;
            margin-bottom: 20px;
          }
          .qr-image {
            width: 200px;
            height: 200px;
            margin: 0 auto;
            display: block;
          }
          .bolt11-container {
            background: rgba(0, 0, 0, 0.4);
            border-radius: 8px;
            padding: 12px;
            margin-bottom: 16px;
          }
          .bolt11-label {
            font-size: 0.75rem;
            color: #6b7280;
            margin-bottom: 8px;
            text-transform: uppercase;
            letter-spacing: 0.5px;
          }
          .bolt11-string {
            font-family: 'SF Mono', Monaco, 'Courier New', monospace;
            font-size: 0.7rem;
            color: #9ca3af;
            word-break: break-all;
            line-height: 1.6;
          }
          .copy-feedback {
            position: fixed;
            top: 20px;
            left: 50%;
            transform: translateX(-50%);
            background: rgba(34, 197, 94, 0.9);
            color: white;
            padding: 12px 24px;
            border-radius: 8px;
            font-weight: 600;
            opacity: 0;
            transition: opacity 0.3s ease;
            z-index: 100;
          }
          .copy-feedback.show {
            opacity: 1;
          }
          .status-badge {
            display: inline-flex;
            align-items: center;
            gap: 6px;
            padding: 6px 12px;
            background: rgba(251, 191, 36, 0.15);
            color: #fbbf24;
            border-radius: 20px;
            font-size: 0.8rem;
            font-weight: 600;
          }
          .status-badge::before {
            content: '';
            width: 8px;
            height: 8px;
            background: currentColor;
            border-radius: 50%;
            animation: pulse 1.5s infinite;
          }
          @keyframes pulse {
            0%, 100% { opacity: 1; }
            50% { opacity: 0.5; }
          }
          .timer {
            text-align: center;
            color: #6b7280;
            font-size: 0.85rem;
            margin-top: 12px;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            ${bitcoinLogo}
            <h1>Lightning Invoice</h1>
            <p class="subtitle">Scan or copy to pay</p>
          </div>

          <div class="invoice-box">
            <div class="invoice-header">
              <span class="invoice-label">Amount Due</span>
              <span class="invoice-amount">${amount.toLocaleString()} sats</span>
            </div>
            <div class="invoice-header" style="margin-bottom: 0;">
              <span class="invoice-label">Status</span>
              <span class="status-badge">Awaiting Payment</span>
            </div>
          </div>

          <div class="qr-container">
            <svg class="qr-image" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect width="200" height="200" fill="white"/>
              <rect x="10" y="10" width="50" height="50" stroke="#000" stroke-width="4" fill="none"/>
              <rect x="20" y="20" width="30" height="30" fill="#000"/>
              <rect x="140" y="10" width="50" height="50" stroke="#000" stroke-width="4" fill="none"/>
              <rect x="150" y="20" width="30" height="30" fill="#000"/>
              <rect x="10" y="140" width="50" height="50" stroke="#000" stroke-width="4" fill="none"/>
              <rect x="20" y="150" width="30" height="30" fill="#000"/>
              <rect x="70" y="10" width="10" height="10" fill="#000"/>
              <rect x="90" y="10" width="10" height="10" fill="#000"/>
              <rect x="110" y="10" width="10" height="10" fill="#000"/>
              <rect x="70" y="30" width="10" height="10" fill="#000"/>
              <rect x="90" y="30" width="10" height="10" fill="#000"/>
              <rect x="110" y="30" width="10" height="10" fill="#000"/>
              <rect x="70" y="50" width="10" height="10" fill="#000"/>
              <rect x="90" y="50" width="10" height="10" fill="#000"/>
              <rect x="110" y="50" width="10" height="10" fill="#000"/>
              <rect x="70" y="70" width="10" height="10" fill="#000"/>
              <rect x="90" y="70" width="20" height="20" fill="#F7931A"/>
              <rect x="120" y="70" width="10" height="10" fill="#000"/>
              <rect x="70" y="90" width="10" height="10" fill="#000"/>
              <rect x="120" y="90" width="10" height="10" fill="#000"/>
              <rect x="140" y="90" width="10" height="10" fill="#000"/>
              <rect x="160" y="90" width="10" height="10" fill="#000"/>
              <rect x="180" y="90" width="10" height="10" fill="#000"/>
              <rect x="70" y="110" width="10" height="10" fill="#000"/>
              <rect x="90" y="110" width="10" height="10" fill="#000"/>
              <rect x="110" y="110" width="10" height="10" fill="#000"/>
              <rect x="140" y="110" width="10" height="10" fill="#000"/>
              <rect x="70" y="130" width="10" height="10" fill="#000"/>
              <rect x="110" y="130" width="10" height="10" fill="#000"/>
              <rect x="140" y="130" width="10" height="10" fill="#000"/>
              <rect x="160" y="130" width="10" height="10" fill="#000"/>
              <rect x="70" y="150" width="10" height="10" fill="#000"/>
              <rect x="90" y="150" width="10" height="10" fill="#000"/>
              <rect x="110" y="150" width="10" height="10" fill="#000"/>
              <rect x="140" y="150" width="50" height="10" fill="#000"/>
              <rect x="70" y="170" width="10" height="10" fill="#000"/>
              <rect x="110" y="170" width="10" height="10" fill="#000"/>
              <rect x="140" y="170" width="10" height="10" fill="#000"/>
              <rect x="170" y="170" width="20" height="20" fill="#000"/>
            </svg>
          </div>

          <div class="bolt11-container">
            <p class="bolt11-label">BOLT11 Invoice</p>
            <p class="bolt11-string" id="bolt11">${mockBolt11}</p>
          </div>

          <div class="button-group">
            <button class="btn btn-primary" onclick="copyInvoice()">
              Copy Invoice
            </button>
            <button class="btn btn-secondary" onclick="checkStatus()">
              Check Status
            </button>
          </div>

          <p class="timer">Invoice expires in 10 minutes</p>
        </div>

        <div class="copy-feedback" id="copyFeedback">Copied to clipboard!</div>

        <script>
          const bolt11 = "${mockBolt11}";

          async function copyInvoice() {
            try {
              await navigator.clipboard.writeText(bolt11);
              const feedback = document.getElementById('copyFeedback');
              feedback.classList.add('show');
              setTimeout(() => feedback.classList.remove('show'), 2000);

              window.parent.postMessage({
                type: 'notify',
                payload: { message: 'Invoice copied to clipboard!' }
              }, '*');
            } catch (err) {
              window.parent.postMessage({
                type: 'notify',
                payload: { message: 'Failed to copy invoice' }
              }, '*');
            }
          }

          function checkStatus() {
            window.parent.postMessage({
              type: 'tool',
              payload: {
                toolName: 'check_payment',
                params: {}
              }
            }, '*');
          }
        </script>
      </body>
      </html>
    `;

    return {
      content: [
        createUIResource({
          uri: `ui://invoice/${amount}`,
          content: { type: 'rawHtml', htmlString: html },
          encoding: 'text',
        }),
      ],
    };
  }
);

/**
 * Tool: check_payment
 * Checks the payment status of the current invoice
 */
server.tool('check_payment', 'Checks the payment status of the current Lightning invoice', {}, async () => {
  // Mock payment status - randomly return pending or paid for demo
  const isPaid = Math.random() > 0.5;

  const paidHtml = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <style>
        ${commonStyles}
        .success-icon {
          width: 100px;
          height: 100px;
          margin: 0 auto 24px;
          display: block;
        }
        .success-message {
          text-align: center;
          margin-bottom: 32px;
        }
        .success-message h2 {
          color: #22c55e;
          font-size: 1.5rem;
          margin-bottom: 8px;
        }
        .success-message p {
          color: #8892a0;
        }
        .details-card {
          background: rgba(34, 197, 94, 0.1);
          border: 1px solid rgba(34, 197, 94, 0.3);
          border-radius: 12px;
          padding: 20px;
          margin-bottom: 24px;
        }
        .detail-row {
          display: flex;
          justify-content: space-between;
          padding: 12px 0;
          border-bottom: 1px solid rgba(255, 255, 255, 0.05);
        }
        .detail-row:last-child {
          border-bottom: none;
        }
        .detail-label {
          color: #8892a0;
          font-size: 0.9rem;
        }
        .detail-value {
          color: #e0e0e0;
          font-weight: 600;
        }
        .confetti {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          pointer-events: none;
          overflow: hidden;
          z-index: 1000;
        }
        .confetti-piece {
          position: absolute;
          width: 10px;
          height: 10px;
          top: -10px;
          animation: confetti-fall 3s ease-out forwards;
        }
        @keyframes confetti-fall {
          0% { transform: translateY(0) rotate(0deg); opacity: 1; }
          100% { transform: translateY(100vh) rotate(720deg); opacity: 0; }
        }
      </style>
    </head>
    <body>
      <div class="confetti" id="confetti"></div>

      <div class="container">
        <div class="header">
          ${bitcoinLogo}
          <h1>Bitcoin Builder</h1>
          <p class="subtitle">Lightning Network Tip Jar</p>
        </div>

        <svg class="success-icon" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="50" cy="50" r="48" stroke="#22c55e" stroke-width="4" fill="rgba(34, 197, 94, 0.1)"/>
          <path d="M30 50L45 65L70 35" stroke="#22c55e" stroke-width="6" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>

        <div class="success-message">
          <h2>Payment Received!</h2>
          <p>Thank you for your support!</p>
        </div>

        <div class="details-card">
          <div class="detail-row">
            <span class="detail-label">Amount</span>
            <span class="detail-value" style="color: #22c55e;">5,000 sats</span>
          </div>
          <div class="detail-row">
            <span class="detail-label">Status</span>
            <span class="detail-value" style="color: #22c55e;">Confirmed</span>
          </div>
          <div class="detail-row">
            <span class="detail-label">Settled At</span>
            <span class="detail-value">${new Date().toLocaleString()}</span>
          </div>
        </div>

        <button class="btn btn-primary" onclick="newTip()">
          Send Another Tip
        </button>
      </div>

      <script>
        // Create confetti effect
        const confettiContainer = document.getElementById('confetti');
        const colors = ['#F7931A', '#22c55e', '#fbbf24', '#60a5fa', '#f472b6'];

        for (let i = 0; i < 50; i++) {
          const piece = document.createElement('div');
          piece.className = 'confetti-piece';
          piece.style.left = Math.random() * 100 + '%';
          piece.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
          piece.style.animationDelay = Math.random() * 0.5 + 's';
          piece.style.borderRadius = Math.random() > 0.5 ? '50%' : '0';
          confettiContainer.appendChild(piece);
        }

        function newTip() {
          window.parent.postMessage({
            type: 'tool',
            payload: {
              toolName: 'show_tip_jar',
              params: {}
            }
          }, '*');
        }
      </script>
    </body>
    </html>
  `;

  const pendingHtml = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <style>
        ${commonStyles}
        .pending-icon {
          width: 100px;
          height: 100px;
          margin: 0 auto 24px;
          display: block;
          animation: spin 2s linear infinite;
        }
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        .pending-message {
          text-align: center;
          margin-bottom: 32px;
        }
        .pending-message h2 {
          color: #fbbf24;
          font-size: 1.5rem;
          margin-bottom: 8px;
        }
        .pending-message p {
          color: #8892a0;
        }
        .status-card {
          background: rgba(251, 191, 36, 0.1);
          border: 1px solid rgba(251, 191, 36, 0.3);
          border-radius: 12px;
          padding: 20px;
          margin-bottom: 24px;
          text-align: center;
        }
        .status-text {
          color: #fbbf24;
          font-weight: 600;
          margin-bottom: 8px;
        }
        .status-subtext {
          color: #8892a0;
          font-size: 0.85rem;
        }
        .dots {
          display: inline-block;
        }
        .dots::after {
          content: '';
          animation: dots 1.5s infinite;
        }
        @keyframes dots {
          0%, 20% { content: '.'; }
          40% { content: '..'; }
          60%, 100% { content: '...'; }
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          ${bitcoinLogo}
          <h1>Bitcoin Builder</h1>
          <p class="subtitle">Lightning Network Tip Jar</p>
        </div>

        <svg class="pending-icon" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="50" cy="50" r="48" stroke="rgba(251, 191, 36, 0.3)" stroke-width="4"/>
          <path d="M50 2 A48 48 0 0 1 98 50" stroke="#fbbf24" stroke-width="4" stroke-linecap="round"/>
        </svg>

        <div class="pending-message">
          <h2>Awaiting Payment</h2>
          <p>The invoice has not been paid yet</p>
        </div>

        <div class="status-card">
          <p class="status-text">Checking for payment<span class="dots"></span></p>
          <p class="status-subtext">This page will update when payment is received</p>
        </div>

        <div class="button-group">
          <button class="btn btn-primary" onclick="checkAgain()">
            Check Again
          </button>
          <button class="btn btn-secondary" onclick="backToTipJar()">
            Back to Tip Jar
          </button>
        </div>
      </div>

      <script>
        function checkAgain() {
          window.parent.postMessage({
            type: 'tool',
            payload: {
              toolName: 'check_payment',
              params: {}
            }
          }, '*');
        }

        function backToTipJar() {
          window.parent.postMessage({
            type: 'tool',
            payload: {
              toolName: 'show_tip_jar',
              params: {}
            }
          }, '*');
        }
      </script>
    </body>
    </html>
  `;

  return {
    content: [
      createUIResource({
        uri: `ui://payment-status/${Date.now()}`,
        content: { type: 'rawHtml', htmlString: isPaid ? paidHtml : pendingHtml },
        encoding: 'text',
      }),
    ],
  };
});

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
}

main().catch(console.error);
