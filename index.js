const express = require('express')
const cors = require("cors")
const app = express()

const port = process.env.PORT || 3000;
require('dotenv').config();
const { MongoClient, ServerApiVersion } = require('mongodb');
const { ObjectId } = require("mongodb");
app.use(cors())
app.use(express.json())







const uri = `mongodb://${process.env.DB_USER}:${process.env.DB_PASS}@ac-re8a3ak-shard-00-00.q1ppz51.mongodb.net:27017,ac-re8a3ak-shard-00-01.q1ppz51.mongodb.net:27017,ac-re8a3ak-shard-00-02.q1ppz51.mongodb.net:27017/?ssl=true&replicaSet=atlas-p2ax84-shard-0&authSource=admin&retryWrites=true&w=majority`

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    // Send a ping to confirm a successful connection
   
    const db = client.db("toy_zone_bd");
    const toysCollection = db.collection("toy_zone_bd");


    app.get("/allToys", async (req, res) => {
      const jobs = await toysCollection
        .find({})
        .toArray();
      res.send(jobs);
    });

    app.get("/singleToy/:id", async (req, res) => {
      const singleToy = await toysCollection.findOne({
        _id: new ObjectId(req.params.id),
      });
      res.send(singleToy);
    });

    app.get("/toysByName/:name", async (req, res) => {
      try {
        const { name } = req.params;
        const toysName = await toysCollection.find({ name }).toArray();
        res.send(toysName);
      } catch (error) {
        console.error(error);
        res.status(500).send("An error occurred");
      }
    });

    app.get("/toysByCategory/:category", async (req, res) => {
      try {
        const { category } = req.params;
        const toys = await toysCollection.find({ category }).toArray();
        res.send(toys);
      } catch (error) {
        console.error(error);
        res.status(500).send("An error occurred");
      }
    });

    app.get('/myToys/:email', async (req, res) => {
      const result = await toysCollection
        .find({ sellerEmail: req.params.email })
        .toArray()
      res.send(result)
    })


    app.post('/postToys', async (req, res) => {
      const body = req.body;
      const result = await toysCollection.insertOne(body);
      res.send(result)
    })

    app.put("/updateToys/:id", async (req, res) => {
      const id = req.params.id;
      const body = req.body;
      const filter = { _id: new ObjectId(id) };
      const updateDoc = {
        $set: {
          title: body.title,
          status: body.status,
        },
      };
      const result = await toysCollection.updateOne(filter, updateDoc);
      res.send(result)
      
    })


    app.delete("/users/:id", async(req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await toysCollection.deleteOne(query);
      res.send(result);
    })





  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);


app.get('/', (req, res) => {
  res.send('Hello World')
})

app.listen(port, () => {
    console.log("App Running On Port");
})