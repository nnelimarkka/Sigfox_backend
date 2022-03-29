var express = require('express');
var router = express.Router();


const { MongoClient } = require("mongodb");
const uri = process.env.MONGODB_URI

/* GET home page. */
router.get('/', async function(req, res, next) {
  let data = [];
  const client = new MongoClient(uri, { useUnifiedTopology: true });
  
    try {
      await client.connect();
  
      const database = client.db('data_sigfox');
      const collection = database.collection('sigfox_messages');

      data = await collection.find({}).toArray();
    } catch(err) {
      console.log(err);
    }
    finally {
      await client.close();
    }
  res.render('index', { title: 'Sigfox', data: data });
});

module.exports = router;
