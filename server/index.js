import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { generateSiaResponse } from './siaEngine.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const RESPONSES_FILE = path.resolve(__dirname, 'responses.json');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Initialize responses store if not exists
if (!fs.existsSync(RESPONSES_FILE)) {
  fs.writeFileSync(RESPONSES_FILE, JSON.stringify([], null, 2));
}

app.get('/api/status', (req, res) => {
  res.json({
    status: 'online',
    bot: 'Sia',
    for: 'Upasana',
    hasApiKey: !!process.env.GEMINI_API_KEY
  });
});

// Endpoint to record responses (for Excel / Google Sheets sync)
app.post('/api/submit-response', async (req, res) => {
  try {
    const { deviceToken, stepIndex, questionId, questionText, selectedOption, category, timestamp } = req.body;
    
    const record = {
      deviceToken,
      stepIndex,
      questionId,
      questionText,
      selectedOption,
      category,
      timestamp: timestamp || new Date().toISOString(),
      ip: req.ip || req.headers['x-forwarded-for'] || 'unknown',
      userAgent: req.headers['user-agent'] || 'unknown'
    };

    let existing = [];
    try {
      existing = JSON.parse(fs.readFileSync(RESPONSES_FILE, 'utf-8'));
    } catch (e) {
      existing = [];
    }

    existing.push(record);
    fs.writeFileSync(RESPONSES_FILE, JSON.stringify(existing, null, 2));
    console.log(`[Response Logged] Step ${stepIndex}: ${selectedOption}`);

    // Optional: If user provides a public Excel / Google Sheet Webhook URL in env
    const webhookUrl = process.env.SHEET_WEBHOOK_URL;
    if (webhookUrl) {
      try {
        await fetch(webhookUrl, {
          method: 'POST',
          redirect: 'follow',
          headers: { 'Content-Type': 'text/plain;charset=utf-8' },
          body: JSON.stringify(record)
        });
        console.log(`[Google Sheet Synced] Step ${stepIndex} sent to spreadsheet`);
      } catch (err) {
        console.warn('Webhook dispatch notice:', err.message);
      }
    }

    res.json({ success: true, loggedAt: record.timestamp });
  } catch (error) {
    console.error('Error recording response:', error);
    res.status(500).json({ error: 'Failed to record response' });
  }
});

// Endpoint to export all responses as CSV/Excel compatible format
app.get('/api/export-responses', (req, res) => {
  try {
    const data = JSON.parse(fs.readFileSync(RESPONSES_FILE, 'utf-8'));
    res.json({ count: data.length, responses: data });
  } catch (e) {
    res.status(500).json({ error: 'Failed to read responses' });
  }
});

// Chat endpoint for Sia Assistant
app.post('/api/chat', async (req, res) => {
  try {
    const { message, history, apiKey } = req.body;
    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }

    const response = await generateSiaResponse(message, history || [], apiKey);
    res.json({ response });
  } catch (error) {
    console.error('Chat error:', error);
    res.status(500).json({ error: 'Failed to generate response' });
  }
});

// Serve static frontend files in production
const distPath = path.resolve(__dirname, '../dist');
if (fs.existsSync(distPath)) {
  app.use(express.static(distPath));
  app.use((req, res) => {
    res.sendFile(path.join(distPath, 'index.html'));
  });
}

app.listen(PORT, () => {
  console.log(`[Sia Server] Running on http://localhost:${PORT}`);
});
