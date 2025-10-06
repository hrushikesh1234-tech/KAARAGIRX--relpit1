// Simple Express server to serve the static files
import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Serve static files from the current directory
app.use(express.static(__dirname));

// Handle all routes by sending the index.html
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'preview.html'));
});

// Start the server on port 7000
const PORT = 7000;
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
  console.log(`Open this URL in your browser to see the preview`);
}); 