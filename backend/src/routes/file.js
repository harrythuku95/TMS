const express = require('express');
const FileService = require('../services/file');
const FileDBApi = require('../db/api/file');
const wrapAsync = require('../helpers').wrapAsync;

const router = express.Router();

router.post('/', wrapAsync(async (req, res) => {
  const payload = await FileService.create(req.body.data, req.currentUser);
  res.status(200).send(payload);
}));

router.put('/:id', wrapAsync(async (req, res) => {
  const payload = await FileService.update(req.params.id, req.body.data, req.currentUser);
  res.status(200).send(payload);
}));

router.delete('/:id', wrapAsync(async (req, res) => {
  await FileService.remove(req.params.id, req.currentUser);
  res.status(200).send({ id: req.params.id });
}));

router.get('/:id', wrapAsync(async (req, res) => {
  const payload = await FileDBApi.findBy({ id: req.params.id });
  res.status(200).send(payload);
}));

router.get('/', wrapAsync(async (req, res) => {
  const payload = await FileDBApi.findAll(req.query);
  res.status(200).send(payload);
}));

module.exports = router;