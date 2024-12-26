const express = require('express');
const fs = require('fs');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 4000;

app.use(bodyParser.json());
app.use(cors());

const dbFilePath = './db.json';

// Helper function to read/write the database file
const readDatabase = () => JSON.parse(fs.readFileSync(dbFilePath, 'utf-8'));
const writeDatabase = (data) => fs.writeFileSync(dbFilePath, JSON.stringify(data, null, 2));

// Routes
app.get('/questions', (req, res) => {
  const db = readDatabase();
  res.json(db.questions);
});

app.post('/questions', (req, res) => {
  const db = readDatabase();
  const newQuestion = {
    id: Date.now(),
    ...req.body,
  };
  db.questions.push(newQuestion);
  writeDatabase(db);
  res.status(201).json(newQuestion);
});

app.patch('/questions/:id', (req, res) => {
  const { id } = req.params;
  const db = readDatabase();
  const question = db.questions.find((q) => q.id === parseInt(id));

  if (!question) {
    return res.status(404).json({ message: 'Question not found' });
  }

  Object.assign(question, req.body);
  writeDatabase(db);
  res.json(question);
});

app.delete('/questions/:id', (req, res) => {
  const { id } = req.params;
  const db = readDatabase();
  const updatedQuestions = db.questions.filter((q) => q.id !== parseInt(id));

  if (db.questions.length === updatedQuestions.length) {
    return res.status(404).json({ message: 'Question not found' });
  }

  db.questions = updatedQuestions;
  writeDatabase(db);
  res.status(204).end();
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
