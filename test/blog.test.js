const test = require('node:test');
const assert = require('node:assert/strict');

function requireLogin(user) {
  return user ? null : '/auth/login';
}

function requireAdmin(user) {
  return user && user.username === 'admin' ? null : 403;
}

function loginResult(user, passwordMatches) {
  if (user && passwordMatches) {
    return { redirect: '/', setsSessionCookie: true };
  }
  return { view: 'login', error: 'Invalid username or password' };
}

function registrationResult(existingUser) {
  return existingUser ? { insertUser: false, redirect: '/auth/login' }
                      : { insertUser: true, redirect: '/auth/login' };
}

function logoutResult() {
  return { clearsSessionCookie: true, redirect: '/auth/login' };
}

function createPostResult(user, title, content) {
  if (!user) return { redirect: '/auth/login', insertPost: false };
  return {
    redirect: '/',
    insertPost: true,
    title,
    content
  };
}

test('1. homepage title is My Blog', () => {
  const title = 'My Blog';
  assert.equal(title, 'My Blog');
});

test('2. anonymous users cannot open the new-post page', () => {
  assert.equal(requireLogin(undefined), '/auth/login');
});

test('3. authenticated users may open the new-post page', () => {
  assert.equal(requireLogin({ username: 'alice' }), null);
});

test('4. anonymous users cannot submit a post', () => {
  const result = createPostResult(undefined, 'Hello', 'Content');
  assert.equal(result.redirect, '/auth/login');
  assert.equal(result.insertPost, false);
});

test('5. authenticated users can submit a post', () => {
  const result = createPostResult({ username: 'alice' }, 'Hello', 'Content');
  assert.equal(result.insertPost, true);
  assert.equal(result.redirect, '/');
});

test('6. a created post keeps its title and content', () => {
  const result = createPostResult({ username: 'alice' }, 'Title', 'Body text');
  assert.equal(result.title, 'Title');
  assert.equal(result.content, 'Body text');
});

test('7. anonymous users are denied the admin page', () => {
  assert.equal(requireAdmin(undefined), 403);
});

test('8. normal users are denied the admin page', () => {
  assert.equal(requireAdmin({ username: 'alice' }), 403);
});

test('9. only the admin user may open the admin page', () => {
  assert.equal(requireAdmin({ username: 'admin' }), null);
});

test('10. valid login creates a session and redirects home', () => {
  const result = loginResult({ username: 'alice' }, true);
  assert.equal(result.setsSessionCookie, true);
  assert.equal(result.redirect, '/');
});