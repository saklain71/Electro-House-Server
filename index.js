const express = require('express')
const cors = require("cors");
const app = express()
require('dotenv').config()
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const port = process.env.PORT || 4000
// middlewareWrapper
app.use(cors());
app.use(express.json())



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.1isr8.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverApi: ServerApiVersion.v1
});

async function run() {
    try {

        await client.connect();
        const dataCollection = client.db("Electro-House").collection("electro-items");
        // get Api 
        // http://localhost:4000/items
        app.get('/items', async (req, res) => {
            const query = req.query;
            const cursor = dataCollection.find(query)
            const result = await cursor.toArray();
            res.send(result);

            //post Api
            // http://localhost:4000/item
            app.post('/item', async (req, res) => {
                const data = req.body;
                const result = await dataCollection.insertOne(data);
                res.send(result);
            });

            //update API
            // http://localhost:4000/item/id
            app.put('/item/:id', async(req, res) => {
                const id = req.params.id;
                const data = req.body;
                const filter = { _id: ObjectId(id) };
                const options = { upsert: true };
                const updateDoc = {
                    $set: {
                        ...data
                    },
                };
                const result = await dataCollection.updateOne(
                    filter,
                    updateDoc,
                    options);
               res.send(result);     
            });

            //delete API
            // http://localhost:4000/item/id

            app.delete('/item/:id', async(req, res)=>{
                const id = req.params.id;
                const query = { _id: ObjectId(id)};
                const result = await dataCollection.deleteOne(query);
                res.send(result);
            })

        })
    }
    finally { }
}

run().catch(console.dir);

app.get('/', (req, res) => {
    res.send('Hello World!')
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})