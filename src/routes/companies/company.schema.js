const Joi = require('joi');
//name, description, discount, location, default_contact
const id = Joi.string().hex().min(12).max(24);
const name = Joi.string().min(3).max(25);
const description = Joi.string().min(3).max(25);
const discount = Joi.number().integer().min(0).max(100);
const location = Joi.string().min(10).max(250);
const default_contacts = Joi.object({
  Payments: id,
  design: id,
});
const contacts = Joi.array().items(id);

const schema = {
  create: Joi.object({
    name: name.required(),
    description: description,
    discount: discount.required(),
    location: location.required(),
    default_contacts: default_contacts,
    contacts: contacts,
  }),
  update: Joi.object({
    name: name,
    description: description,
    discount: discount,
    location: location,
    default_contacts: default_contacts,
    contacts: contacts,
  }),
  get: Joi.object({
    id: id.required(),
  }),
  search: Joi.object({
    name: name,
    description: description,
    discount: discount,
    location: location,
    default_contacts: default_contacts,
    contacts: contacts,
  }),
};

module.exports = {
  schema,
};
