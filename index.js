const express = require("express");
const cors = require("cors");

require("dotenv").config();
const port = process.env.PORT || 3000;

const app = express();
app.use(cors());
app.use(express.json());

const { MongoClient, ServerApiVersion } = require("mongodb");
const uri =
  "mongodb+srv://missionscic11:1RYLxo1Ci4iYaSmM@taftech.rxdwt12.mongodb.net/?appName=Taftech";

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    // Send a ping to confirm a successful connection

    // database creation and user info insertion in DB
    const database = client.db("missionscic11DB");
    const userCollection = database.collection("users");

    app.post("/users", async (req, res) => {
      const userInfo = req.body;
      userInfo.role = "user";
      userInfo.createdAt = new Date();
      const result = await userCollection.insertOne(userInfo);

      res.send(result);
    });

    //get user role by email
    app.get("/users/role/:email", async(req, res) => {
      const email = req.params.email;
      console.log(email);
      

      const query = { email: email };
      const result = await userCollection.findOne(query)
      console.log(result);
      
      res.send(result);
    });

    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Hello from Assignment 11 Server");
});

app.listen(port, () => {
  console.log(`Server is running on ${port}`);
});
