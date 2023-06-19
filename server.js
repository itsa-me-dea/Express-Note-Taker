// Imported apps
const express = require('express');
const path = require('path');
const fs = require('fs');

// Initialize an instance of Express.js
const app = express();

// Specify on which port the Express.js server will run
const PORT = 3001;

// Static middleware pointing to the public folder
app.use(express.static('public'));

// Create Express.js routes for default '/', '/send' and '/routes' endpoints
app.get("/", (req, res) => 
    res.sendFile(path.join(__dirname, "./public/index.html"))
);

app.get("/notes", (req, res) => 
   res.sendFile(path.join(__dirname, "./public/notes.html"))
);

// grab notes stored in db.json
app.get("/api/notes", (req, res) => 
    fs.readFile(path.join(__dirname, "./db/db.json"), "utf8", (error,notes) => {
        if (error) {
            return console.log(error)
        }
        res.json(JSON.parse(notes))
    })
  );

// listen() method is responsible for listening for incoming connections on the specified port 
app.listen(PORT, () =>
  console.log(`App listening on http://localhost:${PORT}`)
);