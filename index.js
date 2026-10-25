const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const { MongoClient, ObjectId } = require("mongodb");
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
    const bookingCollection = db.collection("bookings");

    app.get("/destinations", async (req, res) => {
      const result = await destinationCollection.find().toArray();
      res.json(result);
    });

    app.get("/destinations/:id", async (req, res) => {
      const { id } = req.params;
      const result = await destinationCollection.findOne({
        _id: new ObjectId(id),
      });
      res.json(result);
    });

    app.patch("/destinations/:id", async (req, res) => {
      const { id } = req.params;
      const updatedData = req.body;

      const result = await destinationCollection.updateOne(
        { _id: new ObjectId(id) },
        { $set: updatedData },
      );
      res.json(result);
    });

    app.delete("/destinations/:id", async (req, res) => {
      const { id } = req.params;
      const result = await destinationCollection.deleteOne({
        _id: new ObjectId(id),
      });
      res.json(result);
    });

    app.post("/destination", async (req, res) => {
      const destinationData = req.body;
      console.log(destinationData);
      const result = await destinationCollection.insertOne(destinationData);
      res.json(result);
    });

    app.post("/bookings", async (req, res) => {
      const bookingData = req.body;
      const result = await bookingCollection.insertOne(bookingData);
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
