const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const bodyParser = require('body-parser');

const app = express();
const port = 5000;

// Connect to SQLite database
const dbPath = path.join(__dirname, 'database.db');
const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error('Error connecting to the database:', err);
    } else {
        console.log('Connected to the SQLite database.');
        initializeDatabase();
    }
});

// Function to initialize the database
function initializeDatabase() {
    db.serialize(() => {
        // Create tables if they do not exist
        db.run(`CREATE TABLE IF NOT EXISTS contacts (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            email TEXT NOT NULL,
            message TEXT NOT NULL,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )`);

        db.run(`CREATE TABLE IF NOT EXISTS faq (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            image TEXT NOT NULL
        )`);

        db.run(`CREATE TABLE IF NOT EXISTS lineup (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            time TEXT NOT NULL,
            image TEXT NOT NULL
        )`);

        db.run(`CREATE TABLE IF NOT EXISTS stages (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            description TEXT NOT NULL,
            image TEXT NOT NULL
        )`);

        // Insert initial data if not exists
        insertInitialData('faq', `INSERT INTO faq (image) VALUES ('/img/faqbg.jpeg')`);

        insertInitialData('lineup', `INSERT INTO lineup (name, time, image) VALUES
            ('Saleena Gomez', '2:00 PM - 3:00 PM', '/img/e6f1c03f8dd4a6163631341c4f7fa58c.jpg'),
            ('Alan Walker', '3:30 PM - 4:30 PM', '/img/alanwalker.jpg'),
            ('Taylor Swift', '5:00 PM - 6:00 PM', '/img/taylorSwift.jpeg'),
            ('Justin Bieber', '6:30 PM - 7:30 PM', '/img/justinBieber.jpg'),
            ('Shakira', '7:30 PM - 8:00 PM', '/img/shakira.jpg'),
            ('Ed Sheeran', '8:00 PM - 9:00 PM', '/img/Ed_Sheeran_4,_2013.jpg')
        `);

        insertInitialData('stages', `INSERT INTO stages (name, description, image) VALUES
            ('Main Stage', 'The heart of the festival featuring top headliners.', '/img/mainStage.jpg'),
            ('Acoustic Stage', 'Enjoy intimate performances and acoustic sets.', '/img/acoustics.jpg'),
            ('Dance Stage', 'Dance the night away with our top DJs and electronic acts.', '/img/dance.webp'),
            ('Jazz Stage', 'Relax with smooth jazz and soulful performances.', '/img/jazz.jpg'),
            ('Rock Stage', 'Experience high-energy rock and roll performances.', '/img/rock.jpg'),
            ('World Stage', 'Enjoy diverse music from around the globe.', '/img/world.jpg')
        `);
    });
}

function insertInitialData(tableName, insertQuery) {
    db.get(`SELECT COUNT(*) AS count FROM ${tableName}`, [], (err, row) => {
        if (err) {
            console.error(`Error querying ${tableName} data:`, err);
        } else if (row.count === 0) {
            db.run(insertQuery, (err) => {
                if (err) {
                    console.error(`Error inserting initial data into ${tableName}:`, err);
                }
            });
        }
    });
}

// Set up view engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Serve static files
app.use(express.static(path.join(__dirname, 'public')));

// Parse URL-encoded bodies (as sent by HTML forms)
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Define routes
app.get('/', (req, res) => {
    res.render('index');
});

app.get('/lineup', (req, res) => {
    db.all('SELECT * FROM lineup', [], (err, rows) => {
        if (err) {
            console.error(err.message);
        }
        res.render('lineup', { lineup: rows });
    });
});

app.get('/stages', (req, res) => {
    db.all('SELECT * FROM stages', [], (err, rows) => {
        if (err) {
            console.error(err.message);
        }
        res.render('stages', { stages: rows });
    });
});

app.get('/faq', (req, res) => {
    res.render('faq');
});

app.get('/contact', (req, res) => {
    res.render('contact');
});

app.get('/activity', (req, res) => {
    res.render('activity');
});

// Add this route to handle search requests
app.get('/search', (req, res) => {
    let query = req.query.q.toLowerCase();
    const searchQuery = `SELECT DISTINCT name, time, image FROM lineup WHERE LOWER(name) LIKE ?`;
    db.all(searchQuery, [`%${query}%`], (err, rows) => {
        if (err) {
            console.error(err.message);
            res.status(500).send('An error occurred while searching for artists.');
        } else {
            // Generate HTML for the results
            let results = rows.map(artist => `
                <div class="artist">
                    <img src="${artist.image}" alt="${artist.name}">
                    <h3>${artist.name}</h3>
                    <p>Time: ${artist.time}</p>
                </div>
            `).join('');
            res.send(results);
        }
    });
});

// Add this route to handle AJAX requests for stage information
app.get('/stage-search', (req, res) => {
    let query = req.query.q.toLowerCase();
    const searchQuery = `SELECT * FROM stages WHERE LOWER(name) LIKE ?`;
    db.all(searchQuery, [`%${query}%`], (err, rows) => {
        if (err) {
            console.error(err.message);
            res.status(500).send('An error occurred while retrieving stage information.');
        } else if (rows.length === 0) {
            res.status(404).send('No stages found.');
        } else {
            let uniqueStages = Array.from(new Set(rows.map(stage => stage.id)))
                .map(id => rows.find(stage => stage.id === id));
            
            let stageInfo = uniqueStages.map(stage => `
                <div class="stage">
                    <img src="${stage.image}" alt="${stage.name}">
                    <h3>${stage.name}</h3>
                    <p>${stage.description}</p>
                </div>
            `).join('');
            res.send(stageInfo);
        }
    });
});

// Update the contact POST route to handle AJAX requests
app.post('/contact', (req, res) => {
    const { name, email, message } = req.body;

    // Debug: Log received data to console
    console.log('Received data:', { name, email, message });

    const query = `INSERT INTO contacts (name, email, message) VALUES (?, ?, ?)`;
    db.run(query, [name, email, message], function(err) {
        if (err) {
            console.error(err.message);
            res.status(500).json({ success: false, message: 'An error occurred while saving your message.' });
        } else {
            console.log('Message saved successfully');
            res.json({ success: true, message: 'Your message has been sent successfully!' });
        }
    });
});

// Start the server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
