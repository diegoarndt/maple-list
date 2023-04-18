const express = require('express');
const app = express();
const path = require('path');
const mysql = require('mysql2');
const bodyParser = require('body-parser');

app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded

// Establish connection to MySQL database
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'root1234',
  database: 'mapple_list',
});

// Set up view engine and views directory
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Define route for home page
app.get('/', (_, res) => {
  // Query the database for shopping list items
  const query = 'SELECT * FROM items';
  connection.query(query, (err, results) => {
    if (err) throw err;
    const content = results;
    res.render('index', { content });
  });
});

app.get('/about', (_, res) => {
  const content = `<h3>About this project</h3>
    <p><em>This project is a simple website that uses <mark>NodeJS, Express, EJS, Bootstrap and MySQL</mark> to create a simple website.</em></p>`;
  res.render('index', { content });
});

app.get('/contact', (_, res) => {
  const content = `<h3>Contact me</h3>
    <kbd><kbd>Diego Arndt</kbd></kbd>
    <p>LinkedIn: <a href="https://www.linkedin.com/in/diego-arndt/" class="special-link">https://www.linkedin.com/in/diego-arndt/</a> &#11013; hover over me (;</p>
    <hr>
    <p><strong>Leave a message:</strong></p>
    <form>
        <div class="form-group">
            <label for="exampleFormControlInput1">Your e-mail address</label>
            <input type="email" class="form-control" placeholder="name@example.com">
        </div>
        <div class="form-group">
            <label for="exampleFormControlTextarea1">Message</label>
            <textarea class="form-control" rows="3"></textarea>
        </div>
        <button type="button" class="btn btn-dark">Send</button>
        <p class="mt-4"><small>P.S.: This is just a sample form.</small></p>
    </form>

    `;
  res.render('index', { content });
});

// Route to get list of items
app.get('/items', (_, res) => {
  const query = 'SELECT * FROM items';
  connection.query(query, (err, results) => {
    if (err) throw err;
    res.json(results);
  });
});

// Route to get a single item
app.get('/items/:id', (req, res) => {
  const query = `SELECT * FROM items WHERE id = ${req.params.id}`;
  connection.query(query, (err, results) => {
    if (err) throw err;
    if (results.length === 0) {
      res.status(404).json({ message: 'Item not found' });
    } else {
      res.json(results[0]);
    }
  });
});

// Route to add a new item
app.post('/item', (req, res) => {
  const query = `INSERT INTO items (name, quantity) VALUES ('${req.body.name}', ${req.body.quantity})`;
  connection.query(query, (err, results) => {
    if (err) throw err;
    res.status(204).send();
  });
});

// Route to update an existing item
app.put('/item/:id', (req, res) => {
  const query = `UPDATE items SET name = '${req.body.name}' WHERE id = ${req.params.id}`;
  connection.query(query, (err, results) => {
    if (err) throw err;
    if (results.affectedRows === 0) {
      res.status(404).json({ message: 'Item not found' });
    } else {
      res.status(204).send();
    }
  });
});

// Route to delete an item
app.delete('/item/:id', (req, res) => {
  const query = `DELETE FROM items WHERE id = ${req.params.id}`;
  connection.query(query, (err, results) => {
    if (err) {
      console.error(err);
      res.status(500).json({ message: 'Internal server error' });
    } else if (results.affectedRows === 0) {
      res.status(404).json({ message: 'Item not found' });
    } else {
      res.status(204).send();
    }
  });
});

const port = process.env.PORT || 3007;
app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});
