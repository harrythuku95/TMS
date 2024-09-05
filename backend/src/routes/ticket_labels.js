const express = require('express');
const TicketLabelsService = require('../services/ticket_labels');
const TicketLabelsDBApi = require('../db/api/ticket_labels');
const wrapAsync = require('../helpers').wrapAsync;

const router = express.Router();

router.post('/', wrapAsync(async (req, res) => {
  const payload = await TicketLabelsService.create(req.body.data, req.currentUser);
  res.status(200).send(payload);
}));

router.put('/:id', wrapAsync(async (req, res) => {
  const payload = await TicketLabelsService.update(req.params.id, req.body.data, req.currentUser);
  res.status(200).send(payload);
}));

router.delete('/:id', wrapAsync(async (req, res) => {
  await TicketLabelsService.remove(req.params.id, req.currentUser);
  res.status(200).send({ id: req.params.id });
}));

router.get('/:id', wrapAsync(async (req, res) => {
  const payload = await TicketLabelsDBApi.findBy({ id: req.params.id });
  res.status(200).send(payload);
}));

router.get('/', wrapAsync(async (req, res) => {
  const payload = await TicketLabelsDBApi.findAll(req.query);
  res.status(200).send(payload);
}));

router.put('/ticket/:ticketId', wrapAsync(async (req, res) => {
  const payload = await TicketLabelsService.updateTicketLabels(req.params.ticketId, req.body.labels, req.currentUser);
  res.status(200).send(payload);
}));

module.exports = router;