var express = require('express');
var router = express.Router();

const { MongoClient } = require("mongodb");
const uri = process.env.MONGODB_URI

//api link for testing MongoDB atlas
router.post("/test/:message", async (req, res) => {
    const client = new MongoClient(uri, { useUnifiedTopology: true });
  
    try {
      await client.connect();
  
      const database = client.db('data_sigfox');
      const collection = database.collection('test');
      let message = req.params.message;

      const doc = {message: message, date: Date()};
      const result = await collection.insertOne(doc);
      const resultText = `A document was inserted with message ${result.message}`;
      res.json({message: resultText});
    } catch(err) {
      console.log(err);
    }
    finally {
      await client.close();
    }
})

router.post("/sigfox", async (req, res) => {
  let rTime = new Date().getTime();
  const client = new MongoClient(uri, { useUnifiedTopology: true });
  
  //data to ascii
  let hexData = req.body.data;
  let data = Buffer.from(hexData, "hex");
  let asciiData = data.toString();
  
    try {
      await client.connect();
  
      const database = client.db('data_sigfox');
      const collection = database.collection('sigfox_messages');

      const doc = {
        device: req.body.device,
        cTime: req.body.cTime,
        rTime: rTime,
        data: asciiData,
        hex: req.body.data
      };
      const result = await collection.insertOne(doc);
      res.json({message: "ok"});
    } catch(err) {
      console.log(err);
    }
    finally {
      await client.close();
    }
})

module.exports = router;