const express = require("express");
const bodyParser = require("body-parser");
const MongoClient = require("mongodb").MongoClient;

const app = express();
const port = 3000;

// Middleware
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));

// MongoDB Connection URL
const url = "mongodb://0.0.0.0:27017/calculatorDB";
const dbName = "calculatorDB";

// Serve the html file
app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});

// Route to save expression and result to MongoDB
app.post("/save", async (req, res) => {
  try {
    const { expression, result } = req.body;
    console.log("Request Body", req.body);

    const client = await MongoClient.connect(url);

    const db = client.db(dbName);
    console.log("db", db);
    const collection = db.collection("calculations");

    collection.insertOne({ expression, result }, (err, res) => {
      if (err) {
        console.error("Failed to save to MongoDB", err);
        res.sendStatus(500);
        return;
      }

      console.log("Expression and result saved to MongoDB");
      res.sendStatus(200);
    });
  } catch (err) {
    console.log("catch err", err);
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
