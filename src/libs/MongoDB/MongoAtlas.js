/* eslint-disable no-console */
//includes
const { config } = require('../../server/config.js');
const { MongoClient } = require('mongodb');
// const centerManage = require('../../utils/center.manage');

const serviceAssistant = {
  data: {
    connected: false,
    client: undefined,
  },

  connect() {
    return MongoClient.connect(config.uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
  },

  getConnection() {
    if (!this.data.connected) {
      this.data.client = this.connect();
      this.data.connected = true;
      // centerManage.log.info('Connected to MongoDB Atlas');
      console.log('Connected to MongoDB Atlas');
    }
    return this.data.client;
  },

  async closeConnection() {
    if (this.data.connected) {
      await this.data.client.close();
      this.data.connected = false;
      // centerManage.log.info('Disconnected from MongoDB Atlas');
      console.log('Disconnected from MongoDB Atlas');
    }
  },

  // async getCollections(dbName, collectionName) {
  //   let connection = await this.getConnection();
  //   let collections = {};
  //   for (let x in collectionName) {
  //     console.log('x:' + collectionName);
  //     collections[collectionName[x]] = connection
  //       .db(dbName)
  //       .collection(collectionName[x]);
  //   }

  //   return collections;
  // },

  async getCollection(dbName, collectionName) {
    let connection = await this.getConnection();
    return connection.db(dbName).collection(collectionName);
  },

  async findDocuments(dbName, collectionName, filter) {
    let collection = await this.getCollection(dbName, collectionName);
    let cursor = collection.find(filter).limit(50);
    let listaResultado = [];
    let item = await cursor.next();
    do {
      listaResultado.push(item);
      item = await cursor.next();
    } while (item);
    return listaResultado;
  },

  async findDocument(dbName, collectionName, filter) {
    // console.log("findDocument-AtlasLib");
    let collection = await this.getCollection(dbName, collectionName);
    let result = await collection.findOne(filter);
    return result;
  },

  async addDocument(dbName, collectionName, document) {
    let collection = await this.getCollection(dbName, collectionName);
    let result = await collection.insertOne(document);
    return result;
  },

  async addDocuments(dbName, collectionName, documents) {
    let collection = await this.getCollection(dbName, collectionName);
    let result = await collection.insertMany(documents);
    return result;
  },

  async deleteDocument(dbName, collectionName, filter) {
    let collection = await this.getCollection(dbName, collectionName);
    let result = await collection.deleteOne(filter);
    return result;
  },

  async deleteDocuments(dbName, collectionName, filter) {
    let collection = await this.getCollection(dbName, collectionName);
    let result = await collection.deleteMany(filter);
    return result;
  },

  async updateDocument(dbName, collectionName, filter, updateObject) {
    let collection = await this.getCollection(dbName, collectionName);
    let result = await collection.updateOne(filter, updateObject);
    return result;
  },

  async updateDocuments(dbName, collectionName, filter, updateObject) {
    let collection = await this.getCollection(dbName, collectionName);
    let result = await collection.updateMany(filter, updateObject);
    return result;
  },
};

exports.db = serviceAssistant;

// exports.module = {
//   db: serviceAssistant,
// };
