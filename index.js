const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const { MongoClient } = require("mongodb");
dotenv.config();

const uri = process.env.MONGODB_URI;
const client = new MongoClient(uri);
const app = express();

const PORT = process.env.PORT;
app.use(cors());
app.use(express.json());

async function connectToMongoDB() {
  try {
    await client.connect();

    const db = client.db("wanderlands");
    const destinationCollection = db.collection("destinations");

    app.get("/destinations", async (req, res) => {
      const result = await destinationCollection.find().toArray();
      res.json(result);
    });

    app.post("/destination", async (req, res) => {
      const destinationData = req.body;
      console.log(destinationData);
      const result = await destinationCollection.insertOne(destinationData);
      res.json(result);
    });

    console.log("You successfully connected to MongoDB!");
    return client;
  } catch (err) {
    console.dir(err);
  }
}
// Call this only when your application terminates
async function disconnectFromMongoDB() {
  //   await client.close();
}

app.get("/", (req, res) => {
  res.send("Server running just fine!");
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

connectToMongoDB();
