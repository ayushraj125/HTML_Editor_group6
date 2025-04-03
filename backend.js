const express = require('express');
const fs = require('fs');
const path = require('path');
const bodyParser = require('body-parser');
const cors = require('cors');  // Import CORS

const app = express();
const port = 3000;

app.use(bodyParser.json());

// Enable CORS for all routes
app.use(cors());

// Serve static files (HTML, CSS, JS) from the root directory
app.use(express.static(path.join(__dirname)));

// Function to process and format the text
function processText(content, lineLength, indentSpaces) {
    const lines = content.split('\n');
    let formattedContent = '';
    let indent = ' '.repeat(indentSpaces);

    lines.forEach(line => {
        let words = line.split(/\s+/);
        let currentLine = '';
        let lineLengthAvailable = lineLength - indentSpaces;

        words.forEach(word => {
            if (currentLine.length + word.length + 1 <= lineLengthAvailable) {
                if (currentLine.length === 0) {
                    currentLine = word;
                } else {
                    currentLine += ' ' + word;
                }
            } else {
                formattedContent += indent + currentLine + '\n';
                currentLine = word;
            }
        });
        if (currentLine) {
            formattedContent += indent + currentLine + '\n';
        }
    });

    return formattedContent;
}

// Endpoint to process the text
app.post('/process', (req, res) => {
    const { content, lineLength, indentSpaces } = req.body;
    const formattedContent = processText(content, lineLength, indentSpaces);
    res.json({ formattedContent });
});

// Endpoint to save the document
app.post('/save', (req, res) => {
    const { content, fileName } = req.body;
    const filePath = path.join(__dirname, fileName + '.html');
    fs.writeFile(filePath, content, (err) => {
        if (err) {
            return res.status(500).send('Error saving file');
        }
        res.json({ message: 'File saved successfully' });
    });
});

// Start the server
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
