require('dotenv').config();

const { MongoClient } = require('mongodb');
const { createApp } = require('./app');

const port = 3000;

const mongoUrl = 'mongodb://localhost:27017';
const client = new MongoClient(mongoUrl);

async function startServer() {
    try {
    await client.connect();

    const db = client.db('habit-planner');

    const habits = db.collection('habits');
    const habitEntries = db.collection('habitEntries');
    const users = db.collection('users');

    console.log('Mit MongoDB verbunden');

    const app = createApp({
      habits,
      habitEntries,
      users,
    });

    app.listen(port, () => {
      console.log(`Server läuft auf http://localhost:${port}`);
    });
    } catch (error) {
    console.error('Fehler beim Starten des Servers:', error);
    }
}

startServer();