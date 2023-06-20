// Imported apps
const express = require('express');
const path = require('path');
const fs = require('fs');

// Helper method for generating unique ids
const uuid = require('./helpers/uuid');

// Initialize an instance of Express.js
const app = express();

// Specify on which port the Express.js server will run
const PORT = 3001;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Static middleware pointing to the public folder
app.use(express.static('public'));

// Direct route to index html
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

// POST request to add a note
app.post('/api/notes', (req, res) => {
    // Log that a POST request was received
    console.info(`${req.method} request received to add a note`);
  
    // Destructuring assignment for the items in req.body
    const { title, text } = req.body;
  
    // If all the required properties are present
    if (title && text) {
      // Variable for the object to be saved
      const newNote = {
        title,
        text,
        id: uuid(),
      };
  
      // Obtain existing notes
      fs.readFile('./db/db.json', 'utf8', (err, data) => {
        if (err) {
          console.error(err);
        } else {
          // Convert string into JSON object
          const parsedNotes = JSON.parse(data);
  
          // Add a new note
          parsedNotes.push(newNote);
  
          // Write updated notes back to the file
          fs.writeFile(
            './db/db.json',
            JSON.stringify(parsedNotes, null, 4),
            (writeErr) =>
              writeErr
                ? console.error(writeErr)
                : console.info('Successfully updated notes!')
          );
        }
      });
  
      const response = {
        status: 'success',
        body: newNote,
      };
  
      console.log(response);
      res.status(201).json(response);
    } else {
      res.status(500).json('Error in posting note');
    }
  });

//  request to delete note
app.delete('/api/notes/:id', (req, res) => {
    const noteId = req.params.id;
    // Log that note was deleted
    console.info(`Sucessfully deleted note id: ${noteId}`);
  
      // Obtain existing notes
      fs.readFile('./db/db.json', 'utf8', (err, data) => {
        if (err) {
          console.error(err);
        } else {
          // Convert string into JSON object
          const jsonData = JSON.parse(data);
  
          // Find the index of the item with the given ID
          const itemIndex = jsonData.findIndex(item => item.id === noteId);
          
          if (itemIndex === -1) {
            return res.status(404).json({ error: 'Note id not found' });
          }
          
          // Remove the item from the array
          jsonData.splice(itemIndex, 1);
          
          // Write the updated JSON data back to the file
          fs.writeFile('./db/db.json', JSON.stringify(jsonData, null, 2), 'utf8', err => {
            if (err) {
                console.error('Error writing to file:', err);
                return res.status(500).json({ error: 'Internal Server Error' });
            }
            
            res.json({ message: 'Note deleted successfully' });
          });
  
        };
    });
});

// listen() method is responsible for listening for incoming connections on the specified port 
app.listen(PORT, () =>
  console.log(`App listening on http://localhost:${PORT} 🚀`)
);