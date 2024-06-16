const express = require("express");
const app = express();
const port = process.env.PORT || 3000;
const cors = require("cors");
app.use(cors());
app.use(express.json())
require("dotenv").config();

//

const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const uri = `mongodb+srv://${process.env.DB_NAME}:${process.env.DB_PASS}@cluster0.b5jufhp.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

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

    const sliderDB = client.db("Enrozzz").collection("sliderData");
    const userDB = client.db("Enrozzz").collection("userData");
    const postsDB = client.db("Enrozzz").collection("posts");
    const cartDB = client.db("Enrozzz").collection("carts");

    // slider all data get
    app.get("/slider", async (req, res) => {
      const sliderData = await sliderDB.find().toArray();
      res.send(sliderData);
    });
    // slider all data get end
    // slider single data get
    app.get("/slider/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const sliderData = await sliderDB.findOne(query);
      res.send(sliderData);
    });
    // slider single data get end

    // user Data save to db
    app.post("/userData", async (req, res) => {
      const doc = req.body;
      console.log(doc.email)
      const query = {email : doc.email}
      const isHere = await userDB.findOne(query);
      if(isHere) {
        return res.send("email is already exist")
      }
      const result = await userDB.insertOne(doc);
      res.send(result);
    });; 

    // products
    app.get("/products", async (req, res) => {
      const result = await postsDB.find().toArray()
      res.send(result);
    })
    app.get("/productsDetails/:id", async (req, res) => {
      const id = req.params.id;

      const query = { _id : new ObjectId(id) };
      const result = await postsDB.findOne(query)
      res.send(result);
    })


    // carts
    app.post("/carts", async(req,res)=>{
      const doc = req.body;
      const result = await cartDB.insertOne(doc);
      res.send(result);
    })

    app.get("/cartTable/:email", async(req,res)=>{
      const doc = req.params.email;
      const query = {email : doc};
      const result = await cartDB.find(query).toArray();
      res.send(result);
    })












    // await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

//

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
