const express = require("express");
const app = express();
const port = process.env.PORT || 3000;
const cors = require("cors");
app.use(cors());
app.use(express.json());
// urlencoded
app.use(express.urlencoded({ extended: true }));

require("dotenv").config();

//

const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const { default: axios } = require("axios");
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
    const orderDB = client.db("Enrozzz").collection("order");
    const reviewDB = client.db("Enrozzz").collection("review");

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

    // update userdata

    app.patch("/userDataUpdate/:email", async (req, res) => {
      const email = req.params.email;
      console.log(email);
      const doc = req.body;
      console.log(doc);
      const query = { email: email };
      const updateData = {
        $set: {
          name: doc.name,
          image: doc.image,
        },
      };

      const result = await userDB.updateOne(query, updateData);
      res.send(result);
    });
    // update userdata

    // user Data save to db
    app.post("/userData", async (req, res) => {
      const doc = req.body;
      console.log(doc.email);
      const query = { email: doc.email };
      const isHere = await userDB.findOne(query);
      if (isHere) {
        return res.send("email is already exist");
      }
      const result = await userDB.insertOne(doc);
      res.send(result);
    });

    app.get("/userDataAdmin", async(req,res)=>{
      const result = await userDB.find().toArray();
      res.send(result);

    })

    // products
    app.get("/products", async (req, res) => {
      console.log(req.query);
      const filter = req.query;
      const query = {
        title: { $regex: filter.search, $options: "i" },
      };

      // Handle sorting
      const options = {
        sort: {
          price: filter.sort === "asc" ? 1 : -1,
        },
      };

      const result = await postsDB.find(query, options).toArray();
      res.send(result);
    });
    app.get("/productsDetails/:id", async (req, res) => {
      const id = req.params.id;

      const query = { _id: new ObjectId(id) };
      const result = await postsDB.findOne(query);
      res.send(result);
    });

    // carts
    app.post("/carts", async (req, res) => {
      const doc = req.body;
      const result = await cartDB.insertOne(doc);
      res.send(result);
    });

    app.get("/cartTable/:email", async (req, res) => {
      const doc = req.params.email;
      const query = { email: doc };
      const result = await cartDB.find(query).toArray();
      res.send(result);
    });
    app.delete("/cartTable/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await cartDB.deleteOne(query);
      res.send(result);
    });

    app.get("/length/:email", async (req, res) => {
      const email = req.params.email;

      const query = { email: email };
      const cartLength = await cartDB.countDocuments(query);
      res.send({ cartLength });
    });

    // single user dATA

    app.get("/usersingleData/:email", async (req, res) => {
      const email = req.params.email;
      console.log(email);
      const query = { email: email };
      const result = await userDB.findOne(query);
      res.send(result);
    });
    // review
    app.post("/reviews", async (req, res) => {
      const body = req.body
      const result = await reviewDB.insertOne(body);
      res.send(result);
    })































    // ssl commerce

    app.post("/create-payment", async (req, res) => {
      const body = req.body;
      console.log(body, "from now");

      const tranId = Math.random().toString(36).substring(2, 15)

      const orderData = {
        tranId: tranId,
        price: body.price,
        product: body.product_name,
        userName: body.name,
        phone: body.phone,
        address: body.address,
        deleveryPlace: body.deleveryPlace,
        payment: "pending",
      };


      const paymentData = {
        store_id: process.env.SSL_ID,
        store_passwd: process.env.SSL_PASS,
        total_amount: body.price,
        currency: "USD",
        tran_id: tranId,
        success_url: "http://localhost:3000/success-payment",
        fail_url: "http://localhost:3000/fail",
        cancel_url: "http://localhost:3000/cancel",
        product_name: "Namedvbf",
        product_category: "nbbiihi",
        product_profile: "ujgugiugh",
        cus_name: body.name,
        cus_email: body.email,
        cus_add1: body.address,
        cus_add2: "",
        cus_city: " ",
        cus_state: " ",
        cus_postcode: " ",
        cus_country: "Bangladesh",
        cus_phone: body.phone,
        cus_fax: "01711111111",
        shipping_method: "YES",
        ship_city: " ",
        ship_name: body.name,
        ship_add1: body.deleveryPlace,
        ship_add2: " ",
        ship_state: " ",
        ship_postcode: "1000",
        ship_country: "Bangladesh",
        multi_card_name: "mastercard,visacard,amexcard",
        value_a: "ref001_A",
        value_b: "ref002_B",
        value_c: "ref003_C",
        value_d: "ref004_D",
      };

      const response = await axios(
        " https://sandbox.sslcommerz.com/gwprocess/v4/api.php",
        {
          method: "POST",
          data: paymentData,
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
        }
      );

      const result = await orderDB.insertOne(orderData);
      if (result) {
        res.send({
          paymentUrl: response.data.GatewayPageURL,
        });
      }
    });



    app.post("/success-payment", async (req, res) => {
      const successData = req.body;
      if(successData.status !== "VALID"){
        throw new Error("Unauthorized access", {status : 401})
      }

      const query = { tranId: successData.tran_id };
      const updateData = {
        $set: {
          payment: "success",
        },
      }

      const result = await orderDB.updateOne(query, updateData);
      if(result){
        res.redirect("http://localhost:5173/succes");

      }

    });
    app.post("/fail", async (req, res) => {
      const successData = req.body;
      console.log("success Data", successData);

      res.redirect("http://localhost:5173/fail");
    });
    app.post("/cancel", async (req, res) => {
      const successData = req.body;
      console.log("success Data", successData);

      res.redirect("http://localhost:5173/cancel");
    });

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
