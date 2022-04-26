const { db } = require('../../libs/MongoDB/MongoAtlas');
const { config } = require('../../server/config');

const companyModel = {
  data: {
    dbName: config.database,
    collectionName: 'companies',
  },

  async create(data) {
    return await db.addDocument(
      this.data.dbName,
      this.data.collectionName,
      data
    );
  },

  async getAll(filter) {
    return await db.findDocuments(
      this.data.dbName,
      this.data.collectionName,
      filter
    );
  },

  async getOne(filter) {
    return await db.findDocument(
      this.data.dbName,
      this.data.collectionName,
      filter
    );
  },

  async update(filter, data) {
    return await db.updateDocument(
      this.data.dbName,
      this.data.collectionName,
      filter,
      data
    );
  },

  async delete(filter) {
    return await db.deleteDocument(
      this.data.dbName,
      this.data.collectionName,
      filter
    );
  },
};

exports.companyModel = companyModel;
