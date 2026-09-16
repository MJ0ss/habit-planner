const express = require('express');
const { MongoClient, ObjectId } = require('mongodb');

const app = express();
const port = 3000;

const mongoUrl = 'mongodb://localhost:27017';
const client = new MongoClient(mongoUrl);

app.use(express.json());

async function startServer() {
  try {
    await client.connect();

    const db = client.db('habit-planner');
    const habits = db.collection('habits');

    console.log('Mit MongoDB verbunden');

    app.get('/api/habits', async (req, res) => {
      const result = await habits.find().toArray();
      res.json(result);
    });

    app.get('/api/habits/:id', async (req, res) => {
        const id = req.params.id;

        const habit = await habits.findOne({
            _id: new ObjectId(id)
        });

        if (!habit) {
            return res.status(404).json({
            message: 'Habit nicht gefunden'
            });
        }

        res.json(habit);
    });

    app.put('/api/habits/:id', async (req, res) => {
        const id = req.params.id;
        const updatedHabit = req.body;

        const result = await habits.updateOne(
            { _id: new ObjectId(id) },
            { $set: updatedHabit }
        );

        if (result.matchedCount === 0) {
            return res.status(404).json({
            message: 'Habit nicht gefunden'
            });
        }

        const habit = await habits.findOne({
            _id: new ObjectId(id)
        });

        res.json(habit);
    });

    app.delete('/api/habits/:id', async (req, res) => {
        const id = req.params.id;

        const result = await habits.deleteOne({
            _id: new ObjectId(id)
        });

        if (result.deletedCount === 0) {
            return res.status(404).json({
            message: 'Habit nicht gefunden'
            });
        }

        res.status(204).send();
    });

    app.post('/api/habits', async (req, res) => {
        const habit = req.body;

        const result = await habits.insertOne(habit);

        res.status(201).json({
            _id: result.insertedId,
            ...habit
        });
    });

    app.listen(port, () => {
      console.log(`Server läuft auf http://localhost:${port}`);
    });
  } catch (error) {
    console.error('Fehler beim Starten des Servers:', error);
  }
}

startServer();