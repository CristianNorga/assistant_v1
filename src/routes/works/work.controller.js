const { workModel } = require('./work.model');
const { ObjectId } = require('mongodb');
const { schema } = require('./work.schema');
const centerManage = require('../../utils/center.manage');

const workControllers = {
  access: {
    create: ['1200A', '1200O', '1200', '1111', '1100', '1000', '0050', '0051'],
    read: ['1200A', '1200O', '1200', '1111', '1100', '0050', '0052'],
    update: ['1200A', '1200O', '1200', '1111', '1100', '0050', '0053'],
    delete: ['1200A', '1200O', '0050', '0054'],
  },
  data: {
    accountant: 3,
  },
  async create(req, nested = false) {
    try {
      if (!nested) {
        centerManage.check.roles(this.access.create, req.user.permissions);

        req.body = centerManage.schema.attempt(schema.create, req.body);

        let _idWork, shortIdWork;

        _idWork = new ObjectId();
        shortIdWork = this.data.accountant;

        let reqWork = {
          body: {
            _idWork: _idWork,
            shortIdWork: shortIdWork,
            numberOfTasks: 1,
            _idService: '620ee15c9d5a76433c9d277b',
            nameService: 'Tareas unitarias',
          },
          user: req.user,
        };

        if (req.body._idUser) {
          reqWork.body.idUser = req.body._idUser;
        }
        if (req.body._idCompany) {
          reqWork.body._idCompany = req.body._idUser;
        }

        this.getObjectWork(reqWork);

        // req.body.shortId = this.data.accountant;

        // req.body._id = new ObjectId(req.body._id);

        this.data.accountant += 1;
      }

      // let shortId = false;
      // if (req.body.shortId) {
      //   shortId = true;
      // } else {
      //   req.body.shortId = this.data.accountant;
      // }

      // if (req.body.list_responsible) {  //????
      //   req.body.list_responsible = req.body.list_responsible.split(',');
      // }

      // req.body = centerManage.schema.attempt(schema.create, req.body);

      // req.body._id = new ObjectId(req.body._id); //duplicado

      let today = new Date().toISOString();
      req.body.createdAt = today;
      req.body.updatedAt = today;

      // if (shortId) {
      //   req.body._id = new ObjectId(req.body._id); //duplicado
      // } else {
      //   this.data.accountant += 1;
      // }
      const result = await workModel.create(req.body);

      return result;
    } catch (error) {
      if (nested) {
        const { output } = error;
        return { error: output.payload, isError: true };
      } else {
        throw error;
      }
    }
  },
  async getAll(req) {
    centerManage.check.roles(this.access.read, req.user.permissions);
    const result = await workModel.getAll({});
    return result;
  },
  async getOne(req, nested = false) {
    try {

      if (!nested) {
        centerManage.check.roles(this.access.read, req.user.permissions);
      }
      const validateAnyId = centerManage.validateTypes.anyId(
        req.params,
        schema
      );

      const result = await workModel.getOne(validateAnyId.filter);

      return result;

    } catch (error) {
      if (nested) {
        const { output } = error;
        return { error: output.payload, isError: true };
      } else {
        throw error;
      }
    }

  },
  async update(req, nested = false) {
    try {
      if (!nested) {
        centerManage.check.roles(this.access.update, req.user.permissions);
        req.body = centerManage.schema.attempt(schema.update, req.body);
      }

      const validateAnyId = centerManage.validateTypes.anyId(
        req.params,
        schema
      );

      let today = new Date().toISOString();
      req.body.updatedAt = today;

      const update = { $set: req.body };

      const result = await workModel.update(validateAnyId.filter, update);
      return result;
    } catch (error) {
      if (nested) {
        const { output } = error;
        return { error: output.payload, isError: true };
      } else {
        throw error;
      }
    }
  },
  async delete(req) {
    centerManage.check.roles(this.access.delete, req.user.permissions);
    const validateAnyId = centerManage.validateTypes.anyId(req.params, schema);

    const result = await workModel.delete(validateAnyId.filter);
    return result;
  },
  getObjectWork(req) {
    let object = {
      _id: req.body._id,
      shortId: req.body.shortId,
      state: {
        isClosed: false,
        tasks: req.body.numberOfTasks1 || 1,
        complete: 0,
        isCharged: false,
      },
      petitioner: {},
      service: {
        _idService: req.body._idService || '620ee15c9d5a76433c9d277b',
        name: req.body.nameService || 'Tareas unitarias',
        tasks: req.body.tasks || [],
        prices: {
          base: 0,
          discount: 0,
          additional: 0,
        },
      },
    };
    if (req.body._idCompany || req.user.company) {
      object.petitioner._idCompany =
        req.body._idCompany || req.user.company;
    }
    object.petitioner._idUser = req.body.idUser || req.user.sub;

    return object;
  },
  getAccountant() {
    return this.data.accountant;
  },
  addAccountant() {
    this.data.accountant += 1;
  },
};

exports.workControllers = workControllers;
