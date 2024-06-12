const express = require('express')
const app = express()
const port = process.env.PORT || 5000;
const cors = require('cors')
require('dotenv').config()

//middleware
app.use(cors())
app.use(express.json())


const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.bhkveen.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

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
        await client.connect();


        const packageCollection = client.db('tourDb').collection('package')
        const wishCollection = client.db('tourDb').collection('wishList')
        const guideCollection = client.db('tourDb').collection('guide')



        // guide
        app.get('/guides', async (req, res) => {
            const result = await guideCollection.find().toArray()
            res.send(result)
        })

        app.get('/guideDetails/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) }
            const result = await guideCollection.findOne(query)
            res.send(result)
        })

        // packages

        app.get('/package', async (req, res) => {
            const result = await packageCollection.find().toArray()
            res.send(result)
        })


        app.get('/packageDetails/:id', async (req, res) => {
            const id = req.params.id
            const query = { _id: new ObjectId(id) }
            const result = await packageCollection.findOne(query)
            res.send(result)
        })

        // wishList 


        app.get('/wishList', async (req, res) => {
            const result = await wishCollection.find().toArray()
            res.send(result)

        })

        app.post('/wishList', async (req, res) => {
            const item = req.body;
            const result = await wishCollection.insertOne(item)
            res.send(result)
        })


        // tour type


        app.get('/tourTypes', async (req, res) => {
            try {
                const result = await packageCollection.aggregate([
                    {
                        $group: {
                            _id: "$tourType",
                            spotPhoto: { $first: "$spotPhoto" }
                        }
                    },
                    {
                        $project: {
                            _id: 0,
                            tourType: "$_id",
                            spotPhoto: 1
                        }
                    }
                ]).toArray();
                res.send(result);
            } catch (error) {
                res.status(500).send({ message: "An error occurred", error });
            }
        });


        app.get('/tour/:type', async (req, res) => {
            const type = req.params.type;
            const query = { tourType: type };
            const result = await packageCollection.find(query).toArray();
            res.send(result);
        });








        // Send a ping to confirm a successful connection
        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // Ensures that the client will close when you finish/error
        // await client.close();
    }
}
run().catch(console.dir);


app.get('/', (req, res) => {
    res.send('tour is running')
})

app.listen(port, () => {
    console.log(`tour planner is listening on port: ${port}`)
})