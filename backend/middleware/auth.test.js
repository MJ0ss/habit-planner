require('dotenv').config();

const test = require('node:test');
const assert = require('node:assert/strict');
const jwt = require('jsonwebtoken');

const { authenticateToken } = require('./auth');

function createResponse() {
  return {
    statusCode: null,
    body: null,

    status(code) {
      this.statusCode = code;
      return this;
    },

    json(body) {
      this.body = body;
      return this;
    },
  };
}

test('returns 401 when no token is provided', () => {
  const req = {
    headers: {},
  };

  const res = createResponse();

  let nextCalled = false;
  const next = () => {
    nextCalled = true;
  };

  authenticateToken(req, res, next);

  assert.equal(res.statusCode, 401);
  assert.equal(res.body.message, 'Nicht angemeldet');
  assert.equal(nextCalled, false);
});

test('returns 403 when token is invalid', () => {
  const req = {
    headers: {
      authorization: 'Bearer invalid-token',
    },
  };

  const res = createResponse();

  let nextCalled = false;
  const next = () => {
    nextCalled = true;
  };

  authenticateToken(req, res, next);

  assert.equal(res.statusCode, 403);
  assert.equal(
    res.body.message,
    'Ungültiger oder abgelaufener Token'
  );
  assert.equal(nextCalled, false);
});

test('calls next and sets req.user when token is valid', () => {
  const token = jwt.sign(
    {
      userId: '123',
      username: 'testuser',
    },
    process.env.JWT_SECRET
  );

  const req = {
    headers: {
      authorization: `Bearer ${token}`,
    },
  };

  const res = createResponse();

  let nextCalled = false;
  const next = () => {
    nextCalled = true;
  };

  authenticateToken(req, res, next);

  assert.equal(nextCalled, true);
  assert.equal(req.user.userId, '123');
  assert.equal(req.user.username, 'testuser');
});