const express = require("express");
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config()
const cors=require('cors');
// const { query } = require("express");
const port=process.env.PORT || 5000;

const app = express();

// middle ware
app.use(cors())
app.use(express.json())
// MONGO


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.fdz6q.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run(){
    try{
        await client.connect();
        const productCollections=client.db('emaJhone').collection('product')

        // getproduct
        app.get('/product',async(req,res) => {
            const page=parseInt(req.query.page)
            const size=parseInt(req.query.size)
            const query={};                                                                                                                                                                                                                                                                                                                                          

           console.log('query',req.query);
            const cursor=productCollections.find(query)
             let products;
            if (page || size ){
               products=await cursor.skip(page*size).limit(size).toArray()
            }
            else{
                products=await cursor.toArray()
            }
            res.send(products)
        })

        // count 
        app.get('/productCount', async(req, res) =>{
            const count = await productCollections.estimatedDocumentCount();
            res.send({count});
        });
        // post 
        app.post('/productPost', async(req, res) =>{
            const keys=req.body;
            const ids=keys.map(id =>ObjectId(id))
            const query={_id: {$in:ids}}
            const cursor = productCollections.find(query)
            const products = await cursor.toArray()

          console.log(keys);
          res.send(products)
        })
    }
    finally{}
}
run().catch(console.dir)
// get
app.get('/',(req,res)=> {
    res.send('emajhon wet for mongo db')
})
// set  port
app.listen(port,()=>{
    console.log('running on port !!',port);
})