// Isolated crypto regression checks: no application credentials or external services.
// Advisories: GHSA-6qrw-m8cv-hcxf and GHSA-6889-vf6x-f3g5.
const assert = require('assert').strict;
const crypto = require('crypto');
const https = require('https');
const moduleName = process.env.FORGE_TEST_MODULE || 'node-forge';
const forge = require(moduleName);
const version = require(`${moduleName}/package.json`).version;
const selfsigned = require('selfsigned');
const message = Buffer.from('Local security regression fixture');
const digest = crypto.createHash('sha256').update(message).digest('latin1');

// Synthetic exponent-one fixture lets us test the recovered signature block
// directly. It is not an application key and must never be used for real signing.
const syntheticKey = forge.pki.setRsaPublicKey(
  new forge.jsbn.BigInteger('ff'.repeat(128), 16),
  new forge.jsbn.BigInteger('1', 10),
);
function verifyDigestInfo(hex) {
  const info = Buffer.from(hex + Buffer.from(digest, 'latin1').toString('hex'), 'hex');
  const padding = Buffer.alloc(128 - info.length - 3, 0xff);
  const block = Buffer.concat([Buffer.from([0, 1]), padding, Buffer.from([0]), info]);
  try {
    return syntheticKey.verify(digest, block.toString('latin1'));
  } catch {
    return false;
  }
}

const checks = [
  ['installed version includes all fixes through 1.4.3', () => {
    const [major, minor, patch] = version.split('.').map(Number);
    assert.ok(major > 1 || (major === 1 && (minor > 4 || (minor === 4 && patch >= 3))), version);
  }],
  ['valid RSA signatures work; a different message is rejected', () => {
    const keys = crypto.generateKeyPairSync('rsa', {
      modulusLength: 2048, publicExponent: 65537,
      publicKeyEncoding: { type: 'spki', format: 'pem' },
      privateKeyEncoding: { type: 'pkcs8', format: 'pem' },
    });
    const publicKey = forge.pki.publicKeyFromPem(keys.publicKey);
    const signature = crypto.sign('sha256', message, keys.privateKey).toString('latin1');
    assert.equal(publicKey.verify(digest, signature), true);
    const otherDigest = crypto.createHash('sha256').update('Different message').digest('latin1');
    assert.equal(publicKey.verify(otherDigest, signature), false);
  }],
  ['canonical DigestInfo works both with and without NULL parameters', () => {
    assert.equal(verifyDigestInfo('3031300d060960864801650304020105000420'), true);
    assert.equal(verifyDigestInfo('302f300b06096086480165030402010420'), true);
  }],
  ['CVE-2026-119192: NULL parameters cannot contain attacker-controlled bytes', () => {
    assert.equal(verifyDigestInfo('3033300f06096086480165030402010502beef0420'), false);
  }],
  ['CVE-2026-119192: nonminimal DigestInfo length is rejected', () => {
    assert.equal(verifyDigestInfo('308131300d060960864801650304020105000420'), false);
  }],
  ['CVE-2026-125335: identity-point Ed25519 public keys are rejected', () => {
    const identity = Buffer.alloc(32);
    identity[0] = 1;
    const signature = Buffer.alloc(64);
    identity.copy(signature);
    assert.equal(forge.ed25519.verify({ message, signature, publicKey: identity }), false);
  }],
  ['selfsigned certificates still work with a verifying local HTTPS client', async () => {
    const pem = selfsigned.generate([{ name: 'commonName', value: 'localhost' }], {
      days: 1, keySize: 2048, algorithm: 'sha256',
      extensions: [{ name: 'subjectAltName', altNames: [{ type: 7, ip: '127.0.0.1' }] }],
    });
    const server = https.createServer({ key: pem.private, cert: pem.cert }, (_req, res) => res.end('ok'));
    await new Promise((resolve, reject) => {
      server.once('error', reject);
      server.listen(0, '127.0.0.1', resolve);
    });
    try {
      await new Promise((resolve, reject) => {
        const request = https.get({ hostname: '127.0.0.1', port: server.address().port,
          ca: pem.cert, rejectUnauthorized: true, timeout: 5000 }, response => {
          const authorized = response.socket.authorized;
          let body = '';
          response.setEncoding('utf8');
          response.on('data', chunk => { body += chunk; });
          response.on('end', () => {
            try {
              assert.equal(response.statusCode, 200);
              assert.equal(authorized, true);
              assert.equal(body, 'ok');
              resolve();
            } catch (error) { reject(error); }
          });
        });
        request.on('error', reject);
        request.on('timeout', () => request.destroy(new Error('Local HTTPS test timed out')));
      });
    } finally {
      await new Promise(resolve => server.close(resolve));
    }
  }],
];

(async () => {
  let failed = 0;
  for (const [name, check] of checks) {
    try { await check(); console.log(`PASS ${name}`); }
    catch (error) { failed++; console.error(`FAIL ${name}: ${error.message}`); }
  }
  console.log(`node-forge ${version}: ${checks.length - failed}/${checks.length} checks passed`);
  if (failed) process.exitCode = 1;
})().catch(error => { console.error(error.message); process.exitCode = 1; });
