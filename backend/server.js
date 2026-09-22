require('dotenv').config();

const express = require('express');
const cors = require('cors');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { MongoClient, ObjectId } = require('mongodb');

const JWT_SECRET = process.env.JWT_SECRET;

const app = express();
const port = 3000;

const mongoUrl = 'mongodb://localhost:27017';
const client = new MongoClient(mongoUrl);

app.use(cors({
  origin: 'http://localhost:4200'
}));
app.use(express.json());

async function startServer() {
  try {
    await client.connect();

    const db = client.db('habit-planner');

    const habits = db.collection('habits');
    const habitEntries = db.collection('habitEntries');

    const users = db.collection('users');

    console.log('Mit MongoDB verbunden');

    app.post('/api/register', async (req, res) => {
        const { username, password } = req.body;

        if (!username || !password) {
            return res.status(400).json({
            message: 'Benutzername und Passwort sind erforderlich',
            });
        }

        const existingUser = await users.findOne({ username });

        if (existingUser) {
            return res.status(409).json({
            message: 'Benutzername ist bereits vergeben',
            });
        }

        const passwordHash = await bcrypt.hash(password, 10);

        const user = {
            username,
            passwordHash,
        };

        const result = await users.insertOne(user);

        res.status(201).json({
            _id: result.insertedId,
            username,
        });
    });

    app.post('/api/login', async (req, res) => {
        const { username, password } = req.body;

        if (!username || !password) {
            return res.status(400).json({
            message: 'Benutzername und Passwort sind erforderlich',
            });
        }

        const user = await users.findOne({ username });

        if (!user) {
            return res.status(401).json({
            message: 'Benutzername oder Passwort ist falsch',
            });
        }

        const passwordIsCorrect = await bcrypt.compare(
            password,
            user.passwordHash
        );

        if (!passwordIsCorrect) {
            return res.status(401).json({
            message: 'Benutzername oder Passwort ist falsch',
            });
        }

        const token = jwt.sign(
            {
            userId: user._id.toString(),
            username: user.username,
            },
            JWT_SECRET,
            {
            expiresIn: '1h',
            }
        );

        res.status(200).json({
            token,
            username: user.username,
        });
        });

    app.get('/api/habits', authenticateToken, async (req, res) => {
      const result = await habits.find({ userId: req.user.userId }).toArray();
      res.json(result);
    });

    app.get('/api/habits/:id', authenticateToken, async (req, res) => {
        const id = req.params.id;

        if (!ObjectId.isValid(id)) {
            return res.status(400).json({
                message: 'Ungültige Habit-ID'
            });
        }

        const habit = await habits.findOne({
            _id: new ObjectId(id),
            userId: req.user.userId,
        });

        if (!habit) {
            return res.status(404).json({
            message: 'Habit nicht gefunden'
            });
        }

        res.json(habit);
    });

    app.put('/api/habits/:id', authenticateToken, async (req, res) => {
        const id = req.params.id;
        const { name, type, category } = req.body;

        if (!ObjectId.isValid(id)) {
            return res.status(400).json({
                message: 'Ungültige Habit-ID'
            });
        }

        if (
            !name ||
            !category ||
            !['positive', 'negative'].includes(type)
        ) {
            return res.status(400).json({
                message: 'Ungültige Habit-Daten'
            });
        }

        const updatedHabit = {
            name: name.trim(),
            type,
            category,
        };

        const result = await habits.updateOne(
            {
                _id: new ObjectId(id),
                userId: req.user.userId
            },
            {
                $set: updatedHabit
            }
        );

        if (result.matchedCount === 0) {
            return res.status(404).json({
                message: 'Habit nicht gefunden'
            });
        }

        const habit = await habits.findOne({
            _id: new ObjectId(id),
            userId: req.user.userId,
        });

        res.json(habit);
    });

    app.delete('/api/habits/:id', authenticateToken, async (req, res) => {
        const id = req.params.id;

        if (!ObjectId.isValid(id)) {
            return res.status(400).json({
                message: 'Ungültige Habit-ID'
            });
        }

        const result = await habits.deleteOne({
            _id: new ObjectId(id),
            userId: req.user.userId
        });

        if (result.deletedCount === 0) {
            return res.status(404).json({
                message: 'Habit nicht gefunden'
            });
        }

        await habitEntries.deleteMany({
            habitId: id,
            userId: req.user.userId
        });

        res.status(204).send();
    });

    app.post('/api/habits', authenticateToken, async (req, res) => {
        const { name, type, category } = req.body;

        if (
            !name ||
            !category ||
            !['positive', 'negative'].includes(type)
        ) {
            return res.status(400).json({
                message: 'Ungültige Habit-Daten'
            });
        }

        const habit = {
            name: name.trim(),
            type,
            category,
            userId: req.user.userId,
        };

        const result = await habits.insertOne(habit);

        res.status(201).json({
            _id: result.insertedId,
            ...habit
        });
    });

    app.post('/api/habit-entries', authenticateToken, async (req, res) => {
        const { habitId, date, status } = req.body;

        const habitEntry = {
            habitId,
            date,
            status,
            userId: req.user.userId,
        };

        const allowedStatuses = [
            'planned',
            'completed',
            'missed',
            'occurred'
        ];

        if (
            !habitEntry.habitId ||
            !habitEntry.date ||
            !allowedStatuses.includes(habitEntry.status)
        ) {
            return res.status(400).json({
                message: 'Ungültige HabitEntry-Daten'
            });
        }

        if (!ObjectId.isValid(habitEntry.habitId)) {
            return res.status(400).json({
                message: 'Ungültige Habit-ID'
            });
        }

        const habit = await habits.findOne({
            _id: new ObjectId(habitEntry.habitId),
            userId: req.user.userId
        });

        if (!habit) {
            return res.status(404).json({
                message: 'Habit nicht gefunden'
            });
        }

        const result = await habitEntries.insertOne(habitEntry);

        res.status(201).json({
            _id: result.insertedId,
            ...habitEntry
        });
    });

    app.get('/api/habit-entries', authenticateToken, async (req, res) => {
        const result = await habitEntries
            .find({ userId: req.user.userId })
            .toArray();
        res.json(result);
    });

    app.put('/api/habit-entries/:id', authenticateToken, async (req, res) => {
        const id = req.params.id;
        const { status } = req.body;

        if (!ObjectId.isValid(id)) {
            return res.status(400).json({
                message: 'Ungültige HabitEntry-ID'
            });
        }

        const allowedStatuses = [
            'planned',
            'completed',
            'missed',
            'occurred'
        ];

        if (!allowedStatuses.includes(status)) {
            return res.status(400).json({
                message: 'Ungültiger Status'
            });
        }

        const result = await habitEntries.updateOne({
            _id: new ObjectId(id),
            userId: req.user.userId
        }, {
            $set: { status }
        });

        if (result.matchedCount === 0) {
            return res.status(404).json({
            message: 'HabitEntry nicht gefunden'
            });
        }

        const habitEntry = await habitEntries.findOne({
            _id: new ObjectId(id),
            userId: req.user.userId
        });

        res.json(habitEntry);
    });

    app.delete('/api/habit-entries/:id', authenticateToken, async (req, res) => {
        const id = req.params.id;

        if (!ObjectId.isValid(id)) {
            return res.status(400).json({
                message: 'Ungültige HabitEntry-ID'
            });
        }

        const result = await habitEntries.deleteOne({
            _id: new ObjectId(id),
            userId: req.user.userId
        });

        if (result.deletedCount === 0) {
            return res.status(404).json({
            message: 'HabitEntry nicht gefunden'
            });
        }

        res.status(204).send();
    });

    app.listen(port, () => {
      console.log(`Server läuft auf http://localhost:${port}`);
    });
  } catch (error) {
    console.error('Fehler beim Starten des Servers:', error);
  }
}

function authenticateToken(req, res, next) {
  const authHeader = req.headers.authorization;
  const token = authHeader?.split(' ')[1];

  if (!token) {
    return res.status(401).json({
      message: 'Nicht angemeldet',
    });
  }

  try {
    const user = jwt.verify(token, JWT_SECRET);
    req.user = user;
    next();
  } catch {
    return res.status(403).json({
      message: 'Ungültiger oder abgelaufener Token',
    });
  }
}

startServer();