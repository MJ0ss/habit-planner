require('dotenv').config();

const test = require('node:test');
const assert = require('node:assert/strict');
const request = require('supertest');
const jwt = require('jsonwebtoken');
const { ObjectId } = require('mongodb');

const { createApp } = require('../app');

function createMockCollections() {
    const storedHabits = [];

    const habits = {
        find(query) {
        return {
            async toArray() {
            return storedHabits.filter(
                (habit) => habit.userId === query.userId
            );
            },
        };
        },

        async findOne(query) {
        return storedHabits.find(
            (habit) =>
            habit._id.toString() === query._id.toString() &&
            habit.userId === query.userId
        ) ?? null;
        },

        async insertOne(habit) {
        const insertedId = new ObjectId();

        storedHabits.push({
            _id: insertedId,
            ...habit,
        });

        return { insertedId };
        },

        async updateOne(query, update) {
        const habit = storedHabits.find(
            (item) =>
            item._id.toString() === query._id.toString() &&
            item.userId === query.userId
        );

        if (!habit) {
            return { matchedCount: 0 };
        }

        Object.assign(habit, update.$set);

        return { matchedCount: 1 };
        },

        async deleteOne(query) {
        const index = storedHabits.findIndex(
            (habit) =>
            habit._id.toString() === query._id.toString() &&
            habit.userId === query.userId
        );

        if (index === -1) {
            return { deletedCount: 0 };
        }

        storedHabits.splice(index, 1);

        return { deletedCount: 1 };
        },
    };

    const habitEntries = {
        async deleteMany() {
        return { deletedCount: 0 };
        },
    };

    return {
        habits,
        habitEntries,
        users: {},
    };
}

function createToken(userId = 'user-123') {
    return jwt.sign(
        {
        userId,
        username: 'testuser',
        },
        process.env.JWT_SECRET,
    );
}

test('GET /api/habits rejects request without token', async () => {
    const app = createApp(createMockCollections());

    const response = await request(app).get('/api/habits');

    assert.equal(response.status, 401);
    assert.equal(response.body.message, 'Nicht angemeldet');
});

test('POST /api/habits creates a habit for authenticated user', async () => {
    const collections = createMockCollections();
    const app = createApp(collections);
    const token = createToken();

    const response = await request(app)
        .post('/api/habits')
        .set('Authorization', `Bearer ${token}`)
        .send({
        name: 'Joggen',
        type: 'positive',
        category: 'Sport',
    });

    assert.equal(response.status, 201);
    assert.equal(response.body.name, 'Joggen');
    assert.equal(response.body.type, 'positive');
    assert.equal(response.body.category, 'Sport');
    assert.equal(response.body.userId, 'user-123');
    assert.ok(response.body._id);
});

test('GET /api/habits returns habits of authenticated user', async () => {
    const collections = createMockCollections();
    const app = createApp(collections);

    const token = createToken('user-123');

    await request(app)
        .post('/api/habits')
        .set('Authorization', `Bearer ${token}`)
        .send({
        name: 'Joggen',
        type: 'positive',
        category: 'Sport',
    });

    const response = await request(app)
        .get('/api/habits')
        .set('Authorization', `Bearer ${token}`);

    assert.equal(response.status, 200);
    assert.equal(response.body.length, 1);
    assert.equal(response.body[0].name, 'Joggen');
    assert.equal(response.body[0].userId, 'user-123');
});

test('POST /api/habits rejects invalid habit data', async () => {
    const app = createApp(createMockCollections());
    const token = createToken();

    const response = await request(app)
        .post('/api/habits')
        .set('Authorization', `Bearer ${token}`)
        .send({
        name: '   ',
        type: 'positive',
        category: 'Sport',
    });

    assert.equal(response.status, 400);
    assert.equal(response.body.message, 'Ungültige Habit-Daten');
});

test('GET /api/habits/:id returns a habit', async () => {
    const collections = createMockCollections();
    const app = createApp(collections);
    const token = createToken();

    const created = await request(app)
        .post('/api/habits')
        .set('Authorization', `Bearer ${token}`)
        .send({
        name: 'Joggen',
        type: 'positive',
        category: 'Sport',
        });

    const response = await request(app)
        .get(`/api/habits/${created.body._id}`)
        .set('Authorization', `Bearer ${token}`);

    assert.equal(response.status, 200);
    assert.equal(response.body.name, 'Joggen');
    assert.equal(response.body.category, 'Sport');
    });

    test('PUT /api/habits/:id updates a habit', async () => {
    const collections = createMockCollections();
    const app = createApp(collections);
    const token = createToken();

    const created = await request(app)
        .post('/api/habits')
        .set('Authorization', `Bearer ${token}`)
        .send({
        name: 'Joggen',
        type: 'positive',
        category: 'Sport',
        });

    const response = await request(app)
        .put(`/api/habits/${created.body._id}`)
        .set('Authorization', `Bearer ${token}`)
        .send({
        name: 'Laufen',
        type: 'positive',
        category: 'Sport',
        });

    assert.equal(response.status, 200);
    assert.equal(response.body.name, 'Laufen');
    assert.equal(response.body.type, 'positive');
    assert.equal(response.body.category, 'Sport');
    });

    test('DELETE /api/habits/:id deletes a habit', async () => {
    const collections = createMockCollections();
    const app = createApp(collections);
    const token = createToken();

    const created = await request(app)
        .post('/api/habits')
        .set('Authorization', `Bearer ${token}`)
        .send({
        name: 'Joggen',
        type: 'positive',
        category: 'Sport',
        });

    const deleteResponse = await request(app)
        .delete(`/api/habits/${created.body._id}`)
        .set('Authorization', `Bearer ${token}`);

    assert.equal(deleteResponse.status, 204);

    const getResponse = await request(app)
        .get(`/api/habits/${created.body._id}`)
        .set('Authorization', `Bearer ${token}`);

    assert.equal(getResponse.status, 404);
});