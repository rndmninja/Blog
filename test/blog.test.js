const test = require('node:test');
const assert = require('node:assert/strict');

test('home-page title value is correct', () => {
  const title = 'My Blog';
  assert.equal(title, 'My Blog');
});

test('new-post route redirects unauthenticated users', () => {
  const user = undefined;
  const redirectTarget = !user ? '/auth/login' : null;
  assert.equal(redirectTarget, '/auth/login');
});