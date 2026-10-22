import http from 'http';
import { AddressInfo } from 'net';
import app from '../src/index';
import { closeDb, initDb } from '../src/database/db';

async function fetchJson(url: string): Promise<any> {
  return new Promise((resolve, reject) => {
    http
      .get(url, (res) => {
        let data = '';
        res.on('data', (chunk) => (data += chunk));
        res.on('end', () => {
          try {
            resolve(JSON.parse(data));
          } catch (e) {
            resolve(data);
          }
        });
      })
      .on('error', reject);
  });
}

async function testServer() {
  console.log('Testing Express server endpoints...');
  initDb();

  const testServer = http.createServer(app);
  await new Promise<void>((resolve) => testServer.listen(0, '127.0.0.1', () => resolve()));
  const port = (testServer.address() as AddressInfo).port;

  try {
    // Query /health
    const health = await fetchJson(`http://127.0.0.1:${port}/health`);
    console.log('Health response:', health);
    if (health.status !== 'healthy') {
      throw new Error('Health check failed');
    }

    // Query /api/system/status
    const status = await fetchJson(`http://127.0.0.1:${port}/api/system/status`);
    console.log('GovTech Telemetry response:', status);
    if (status.status !== 'OPERATIONAL' || status.database !== 'CONNECTED (WAL Mode)') {
      throw new Error('GovTech telemetry check failed');
    }

    console.log('✅ All Express base server endpoints verified successfully!');
  } finally {
    testServer.close();
    closeDb();
  }
}

testServer().catch((err) => {
  console.error('❌ Server test failed:', err);
  process.exit(1);
});
