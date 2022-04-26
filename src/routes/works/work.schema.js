const Joi = require('joi');

const id = Joi.string().hex().min(12).max(24);
const shortId = Joi.number().integer().min(1).max(999);

const state = Joi.object({
  isClosed: Joi.boolean().default(false),
  task: Joi.number().integer().min(1).max(999),
  complete: Joi.number().integer().min(0).max(999),
  isCharged: Joi.boolean().default(false),
});
const petitioner = Joi.object({
  _idCompany: id,
  _idUser: id,
});
const service = Joi.object({
  _idService: id,
  name: Joi.string().min(3).max(25),
  tasks: Joi.array().items(
    Joi.object({
      _idToDo: id,
      _idTask: shortId,
      isCharged: Joi.boolean().default(false),
    })
  ),
  requirements: Joi.array().items(
    Joi.object({
      description: Joi.string().min(3).max(50),
      field: Joi.string().min(3).max(250),
    })
  ),
  additional_tasks: Joi.array().items(
    Joi.object({
      _idToDo: id,
      description: Joi.string().min(3).max(25),
      stress: Joi.number().integer().min(1).max(1000),
    })
  ),
  prices: Joi.object({
    base: Joi.number().integer().min(0).max(9999999),
    discount: Joi.number().integer().min(0).max(100),
    additional: Joi.number().integer().min(0).max(9999999),
  }),
});

const schema = {
  create: Joi.object({
    _idCompany: id,
    _idUser: id,
    _idService: id,
    shIdService: shortId,
  }),
  update: Joi.object({
    state: state,
    petitioner: petitioner,
    service: service,
  }),
  getById: Joi.object({
    id: id,
  }),
  getByShortId: Joi.object({
    id: shortId,
  }),
};

module.exports = {
  schema,
};
