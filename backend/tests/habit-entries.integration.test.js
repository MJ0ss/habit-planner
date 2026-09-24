require('dotenv').config();

const test = require('node:test');
const assert = require('node:assert/strict');
const request = require('supertest');
const jwt = require('jsonwebtoken');
const { ObjectId } = require('mongodb');

const { createApp } = require('../app');

function createMockCollections() {
    const storedHabits = [];
    const storedHabitEntries = [];

    const habits = {
        async findOne(query) {
        return storedHabits.find(
            (habit) =>
            habit._id.toString() === query._id.toString() &&
            habit.userId === query.userId
        ) ?? null;
        },
    };

    const habitEntries = {
        find(query) {
        return {
            async toArray() {
            return storedHabitEntries.filter(
                (entry) => entry.userId === query.userId
            );
            },
        };
        },

        async findOne(query) {
        return storedHabitEntries.find(
            (entry) =>
            entry._id.toString() === query._id.toString() &&
            entry.userId === query.userId
        ) ?? null;
        },

        async insertOne(entry) {
        const insertedId = new ObjectId();

        storedHabitEntries.push({
            _id: insertedId,
            ...entry,
        });

        return { insertedId };
        },

        async updateOne(query, update) {
        const entry = storedHabitEntries.find(
            (item) =>
            item._id.toString() === query._id.toString() &&
            item.userId === query.userId
        );

        if (!entry) {
            return { matchedCount: 0 };
        }

        Object.assign(entry, update.$set);

        return { matchedCount: 1 };
        },

        async deleteOne(query) {
        const index = storedHabitEntries.findIndex(
            (entry) =>
            entry._id.toString() === query._id.toString() &&
            entry.userId === query.userId
        );

        if (index === -1) {
            return { deletedCount: 0 };
        }

        storedHabitEntries.splice(index, 1);

        return { deletedCount: 1 };
        },
    };

    function addHabit(userId = 'user-123') {
        const habit = {
        _id: new ObjectId(),
        name: 'Joggen',
        type: 'positive',
        category: 'Sport',
        userId,
        };

        storedHabits.push(habit);

        return habit;
    }

    return {
        collections: {
        habits,
        habitEntries,
        users: {},
        },
        addHabit,
    };
}

function createToken(userId = 'user-123') {
    return jwt.sign(
        {
        userId,
        username: 'testuser',
        },
        process.env.JWT_SECRET
    );
}

test('POST /api/habit-entries creates a habit entry', async () => {
    const { collections, addHabit } = createMockCollections();
    const app = createApp(collections);
    const token = createToken();

    const habit = addHabit();

    const response = await request(app)
        .post('/api/habit-entries')
        .set('Authorization', `Bearer ${token}`)
        .send({
        habitId: habit._id.toString(),
        date: '2026-09-24',
        status: 'planned',
        });

    assert.equal(response.status, 201);
    assert.equal(response.body.habitId, habit._id.toString());
    assert.equal(response.body.date, '2026-09-24');
    assert.equal(response.body.status, 'planned');
    assert.equal(response.body.userId, 'user-123');
    assert.ok(response.body._id);
});

test('POST /api/habit-entries rejects invalid status', async () => {
    const { collections, addHabit } = createMockCollections();
    const app = createApp(collections);
    const token = createToken();

    const habit = addHabit();

    const response = await request(app)
        .post('/api/habit-entries')
        .set('Authorization', `Bearer ${token}`)
        .send({
        habitId: habit._id.toString(),
        date: '2026-09-24',
        status: 'invalid',
        });

    assert.equal(response.status, 400);
    assert.equal(
        response.body.message,
        'Ungültige HabitEntry-Daten'
    );
});

test('POST /api/habit-entries rejects habit of another user', async () => {
    const { collections, addHabit } = createMockCollections();
    const app = createApp(collections);
    const token = createToken('user-123');

    const habit = addHabit('other-user');

    const response = await request(app)
        .post('/api/habit-entries')
        .set('Authorization', `Bearer ${token}`)
        .send({
        habitId: habit._id.toString(),
        date: '2026-09-24',
        status: 'planned',
        });

    assert.equal(response.status, 404);
    assert.equal(response.body.message, 'Habit nicht gefunden');
});

test('GET /api/habit-entries returns entries of authenticated user', async () => {
    const { collections, addHabit } = createMockCollections();
    const app = createApp(collections);
    const token = createToken();

    const habit = addHabit();

    await request(app)
        .post('/api/habit-entries')
        .set('Authorization', `Bearer ${token}`)
        .send({
        habitId: habit._id.toString(),
        date: '2026-09-24',
        status: 'planned',
        });

    const response = await request(app)
        .get('/api/habit-entries')
        .set('Authorization', `Bearer ${token}`);

    assert.equal(response.status, 200);
    assert.equal(response.body.length, 1);
    assert.equal(response.body[0].status, 'planned');
});

test('PUT /api/habit-entries/:id updates entry status', async () => {
    const { collections, addHabit } = createMockCollections();
    const app = createApp(collections);
    const token = createToken();

    const habit = addHabit();

    const created = await request(app)
        .post('/api/habit-entries')
        .set('Authorization', `Bearer ${token}`)
        .send({
        habitId: habit._id.toString(),
        date: '2026-09-24',
        status: 'planned',
        });

    const response = await request(app)
        .put(`/api/habit-entries/${created.body._id}`)
        .set('Authorization', `Bearer ${token}`)
        .send({
        status: 'completed',
        });

    assert.equal(response.status, 200);
    assert.equal(response.body.status, 'completed');
});

test('DELETE /api/habit-entries/:id deletes an entry', async () => {
    const { collections, addHabit } = createMockCollections();
    const app = createApp(collections);
    const token = createToken();

    const habit = addHabit();

    const created = await request(app)
        .post('/api/habit-entries')
        .set('Authorization', `Bearer ${token}`)
        .send({
        habitId: habit._id.toString(),
        date: '2026-09-24',
        status: 'planned',
        });

    const response = await request(app)
        .delete(`/api/habit-entries/${created.body._id}`)
        .set('Authorization', `Bearer ${token}`);

    assert.equal(response.status, 204);

    const getResponse = await request(app)
        .get('/api/habit-entries')
        .set('Authorization', `Bearer ${token}`);

    assert.equal(getResponse.status, 200);
    assert.equal(getResponse.body.length, 0);
});