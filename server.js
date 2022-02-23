var express = require("express");
// var bodyParser = require("body-parser");
var mongodb = require("mongodb"),assert = require('assert');
// mongodb.ObjectIDだと警告が出てくるのでObjectIdに変更2021.10.30
var ObjectID = mongodb.ObjectId;
var CONTACTS_COLLECTION = "words";

var app = express();
// bodyParser.json　で警告が出ているので、下記を参考にexpress.jsonに変更2021.10.30
// https://qiita.com/atlansien/items/c587a0bf2f7f9022107c
// app.use(bodyParser.json());
app.use(express.json());

// Create link to Angular build directory
var distDir = __dirname + "/dist/";
app.use(express.static(distDir));

// Create a database variable outside of the database connection callback to reuse the connection pool in your app.
var db;

// .envを用いてprocess.env.MONGODB_URIを秘匿化する（.gitignoreに.envを追加するのを忘れずに）
// 　⇒https://www.wakuwakubank.com/posts/662-nodejs-env/
// .envの有無判定はfsを用いる
// 　⇒https://note.affi-sapo-sv.com/nodejs-file-exists.php
const fs = require('fs');
const path = ".env";
if( fs.existsSync( path ) ){
  require('dotenv').config();
}
// Connect to the database before starting the application server.
mongodb.MongoClient.connect(process.env.MONGODB_URI || "mongodb://localhost:27017/test", function (err, client) {
  if (err) {
    console.log(err);
    process.exit(1);
  }
  // Save database object from the callback for reuse.
  db = client.db();
  console.log("Database connection ready");
  // Initialize the app.
  var server = app.listen(process.env.PORT || 8080, function () {
    var port = server.address().port;
    console.log("App now running on port", port);
  });
});

// CONTACTS API ROUTES BELOW
// Generic error handler used by all endpoints.
function handleError(res, reason, message, code) {
  console.log("ERROR: " + reason);
  res.status(code || 500).json({"error": message});
}

/*  "/api/contacts"
 *    GET: finds all contacts
 *    POST: creates a new contact
 */

app.get("/api/contacts/:skip/:ok_ng/:pageSize", function(req, res) {
  if(req.params.ok_ng=="OK"){
    db.collection(CONTACTS_COLLECTION).find({NG:"OK"}).sort({createDate:-1}).skip(parseInt(req.params.skip)).limit(parseInt(req.params.pageSize)).toArray(function(err, docs) {
      if (err) {
        handleError(res, err.message, "Failed to get contacts.");
      } else {
        res.status(200).json(docs);
      }
    });
  }
  else{
    db.collection(CONTACTS_COLLECTION).find({NG:"NG"}).sort({createDate:-1}).skip(parseInt(req.params.skip)).limit(parseInt(req.params.pageSize)).toArray(function(err, docs) {
      if (err) {
        handleError(res, err.message, "Failed to get contacts.");
      } else {
        res.status(200).json(docs);
      }
    });
  }
});

app.get("/api/search/:id", function(req, res) {
  var query1 = ({word: new RegExp(".*" + req.params.id + ".*" , "i")});
  var query2 = ({meaning: new RegExp(".*" + req.params.id + ".*" , "i")});
  /*  db.collection(CONTACTS_COLLECTION).find({ $or:[{word: req.params.id},{meaning: req.params.id}] }).toArray(function(err, docs) { */
  db.collection(CONTACTS_COLLECTION).find({ $or:[query1,query2] }).toArray(function(err, docs) { 
  if (err) {
      handleError(res, err.message, "Failed to get contact");
    } else {
      res.status(200).json(docs);
    }
  });
});

app.get("/api/count/:ok_ng", function(req, res) {
  if(req.params.ok_ng=="OK"){
    db.collection(CONTACTS_COLLECTION).find({NG:"OK"}).count(function(err, docs) {
      if (err) {
          handleError(res, err.message, "Failed to get contact");
        } else {
         res.status(200).json(docs);
      }
    });
  }
  else{
    db.collection(CONTACTS_COLLECTION).find({NG:"NG"}).count(function(err, docs) {
      if (err) {
          handleError(res, err.message, "Failed to get contact");
        } else {
         res.status(200).json(docs);
      }
    });
  }
});

app.post("/api/contact", function(req, res) {
  var newDoc = req.body;
  newDoc.createDate = new Date();
  if (!req.body.word) {
    handleError(res, "Invalid user input", "Must provide a word.", 400);
  }
  else {
    db.collection(CONTACTS_COLLECTION).insertOne(newDoc, function(err, doc) {
      if (err) {
        handleError(res, err.message, "Failed to create new contact.");
      } else {
        res.status(201).json(doc.ops[0]);
      }
    });
  }
});

/*  "/api/contacts/:id"
 *    GET: find contact by id
 *    PUT: update contact by id
 *    DELETE: deletes contact by id
 */
app.get("/api/contact/:id", function(req, res) {
  db.collection(CONTACTS_COLLECTION).findOne({ _id: new ObjectID(req.params.id)}, function(err, doc) {
    if (err) {
      handleError(res, err.message, "Failed to get contact");
    } else {
      res.status(200).json(doc);
    }
  });
});

app.put("/api/contact/:id", function(req, res) {
  var updateDoc = req.body;
  delete updateDoc._id;
  //display only NG words
  if(updateDoc.NG=="NG"){
    updateDoc.createDate = new Date();
  }
  db.collection(CONTACTS_COLLECTION).updateOne({_id: new ObjectID(req.params.id)}, {$set:updateDoc}, function(err, doc) {
    if (err) {
      handleError(res, err.message, "Failed to update contact");
    } else {
      updateDoc._id = req.params.id;
      res.status(200).json(updateDoc);
    }
  });
});

app.delete("/api/contact/:id", function(req, res) {
  db.collection(CONTACTS_COLLECTION).deleteOne({_id: new ObjectID(req.params.id)}, function(err, result) {
    if (err) {
      handleError(res, err.message, "Failed to delete contact");
    } else {
      res.status(200).json(req.params.id);
    }
  });
});