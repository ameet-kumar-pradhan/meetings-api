const express = require('express');
const Participant = require('../models/participant');

const router = express.Router();

router.get('/', async (req, res, next) => {
  try {
    const doc = await Participant.find();
    res.json(doc);
  } catch (error) {
    next(error);
  }
});

router.post('/', async (req, res, next) => {
  try {
    const doc = new Participant(req.body);
    const newParticipant = await doc.save();
    res.json(newParticipant);
  } catch (error) {
    next(error);
  }
});

router.put('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    const doc = await Participant.findOne({ _id: id });
    if (!doc) return next();
    const updated = await Participant.findOneAndUpdate({ _id: id }, req.body, { new: true });
    res.json(updated);
  } catch (error) {
    next(error);
  }
});

router.delete('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    const doc = await Participant.findOne({ _id: id });
    if (!doc) return next();
    await Participant.deleteOne({ _id: id });
    res.json({ message: 'Success' });
  } catch (error) {
    next(error);
  }
});

router.get('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    const doc = await Participant.findOne({ _id: id });
    if (!doc) return next();
    return res.json(doc);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
