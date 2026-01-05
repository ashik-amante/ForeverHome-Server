const express = require('express');
const cors = require('cors');
const app = express();
require('dotenv').config();
const port = process.env.PORT || 5000;
const { MongoClient, ServerApiVersion } = require('mongodb');

app.use(cors());
app.use(express.json());




const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.pdx5h.mongodb.net/?appName=Cluster0`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

const petsCollection = client.db("ForeverHome").collection("pets");
const usersCollection = client.db("ForeverHome").collection("users");

async function run() {
    try {
        await client.connect();

        // save a  new user
        app.post('/users', async (req, res) => {
            try {
                const user = req.body;
                const result = await usersCollection.insertOne(user);
                res.send(result);
            } catch (error) {
                console.error('Error creating user:', error);
                res.status(500).send('Error creating user');
            }
        })

        // get all pets
        app.get('/pets', async (req, res) => {
            try {
                const result = await petsCollection.find().toArray();
                res.send(result);
            } catch (error) {
                console.error('Error fetching pets:', error);
                res.status(500).send('Error fetching pets');
            }
        })
        // get single pet by email
        app.get('/pets/:email', async (req, res) => {
            try {
                const email = req.params.email;
                const result = await petsCollection.find({ email: email }).toArray();
                res.send(result);
            } catch (error) {
                console.error('Error fetching pets:', error);
                res.status(500).send('Error fetching pets');
            }
        })
        // post a pet
        app.post('/pets', async (req, res) => {
            try {
                const pet = req.body;
                const result = await petsCollection.insertOne(pet);
                res.send(result);
            } catch (error) {
                console.error('Error creating pet:', error);
                res.status(500).send('Error creating pet');
            }
        })

        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // Ensures that the client will close when you finish/error
        // await client.close();
    }
}
run().catch(console.dir);

// sample route
app.get('/', (req, res) => {
    res.send('Hello World!')
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})