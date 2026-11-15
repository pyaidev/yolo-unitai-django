const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const lock = require('../package-lock.json');
const pkg = require('../package.json');

test('retired CRA toolchain and node-forge are absent from the dependency graph', () => {
  for (const name of ['react-scripts', 'node-forge', 'selfsigned', 'webpack-dev-server']) {
    assert.ok(!Object.keys(lock.packages).some(path => path.endsWith(`node_modules/${name}`)), name);
  }
});

test('all direct packages are exact versions and agree with the lockfile', () => {
  for (const section of ['dependencies', 'devDependencies']) {
    assert.deepEqual(lock.packages[''][section], pkg[section]);
    for (const [name, version] of Object.entries(pkg[section])) {
      assert.match(version, /^\d+\.\d+\.\d+$/);
      assert.equal(lock.packages[`node_modules/${name}`].version, version);
    }
  }
});

test('HTML has no vulnerable legacy jQuery, Popper or Bootstrap JS CDN dependencies', () => {
  const html = fs.readFileSync('index.html', 'utf8');
  assert.ok(!html.includes('http'));
  assert.ok(html.includes('/src/index.jsx'));
  assert.ok(!html.includes('%PUBLIC_URL%'));
});
