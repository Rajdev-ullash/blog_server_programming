const express = require('express')
const app = express()
const cors = require('cors');
const MongoClient = require('mongodb').MongoClient;
const bodyParser = require('body-parser');
const ObjectID = require('mongodb').ObjectID;
require('dotenv').config();
const port = 5000;

app.use(cors());
app.use(bodyParser.json());





const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.q0wlb.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
console.log(uri)
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
  const blogCollection = client.db("blog").collection("blogInfo");
  const adminList = client.db("blog").collection("admin");
  // perform actions on the collection object
  app.post('/blogPost', (req,res)=>{
      const blog = req.body;
      blogCollection.insertOne(blog)
      .then(result => {
          res.send(result.insertedCount > 0)
          console.log(result.insertedCount > 0);
      })
  })

  app.get('/showBlog', (req, res)=>{
    blogCollection.find()
    .toArray((err, documents)=>{
      console.log(err)
      res.send(documents)
    })
  })

  app.delete('/delete/:id', (req, res) => {
    const id = ObjectID(req.params.id);
    console.log('deleted id', id)
    blogCollection.findOneAndDelete({_id: id})
    .then(result => 
        {result.deletedCount > 0})
        
})

app.post("/login",(req, res) => {
  const email = req.body.email
  const password = req.body.password
  console.log(req.body);

  adminList.find({ admin: email})
  .toArray((err, result) => {
      console.log(err,result);
      const user = result[0];
      if (user.admin=== email && user.password===password) {
          res.send(true)
      }else{
          res.send(false)
      }
  })
});
  
});

app.listen(process.env.PORT || port);