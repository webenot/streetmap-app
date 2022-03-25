const express = require('express');
const Joi = require('joi');
const db = require('../db');

const schema = Joi.object({
  name: Joi.string()
    .min(1)
    .max(100)
    .trim()
    .required(),

  message: Joi.string()
    .min(1)
    .max(500)
    .trim()
    .required(),

  latitude: Joi.number().min(-90).max(90).required(),

  longitude: Joi.number().min(-180).max(180).required(),
});

const router = express.Router();

router.get('/', (req, res) => {
  res.json([]);
});

router.post('/', async (req, res, next) => {
  try {
    const userMessage = await schema.validateAsync(req.body);
    console.log({ userMessage });
    userMessage.date = new Date();
    const messages = db.get('messages');
    const newMessage = await messages.insert(userMessage);
    console.log({ newMessage });
    res.json(newMessage);
  } catch (e) {
    next(e);
  }
});

module.exports = router;
