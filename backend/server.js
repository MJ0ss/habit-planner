const express = require('express');
const cors = require('cors');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { MongoClient, ObjectId } = require('mongodb');

const JWT_SECRET = 'habit-planner-secret';

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
        const updatedHabit = req.body;

        const result = await habits.updateOne({ 
            _id: new ObjectId(id), 
            userId: req.user.userId
            },
            { $set: updatedHabit }
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
        const habit = {
            ...req.body,
            userId: req.user.userId,
        };

        const result = await habits.insertOne(habit);

        res.status(201).json({
            _id: result.insertedId,
            ...habit
        });
    });

    app.post('/api/habit-entries', authenticateToken, async (req, res) => {
        const habitEntry = {
            ...req.body,
            userId: req.user.userId,
        };

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
        const updatedEntry = req.body;

        const result = await habitEntries.updateOne({
            _id: new ObjectId(id),
            userId: req.user.userId
        }, {
            $set: updatedEntry
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