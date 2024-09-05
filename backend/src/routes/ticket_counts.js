const express = require('express');
const TicketCountsService = require('../services/ticket_counts');
const TicketCountsDBApi = require('../db/api/ticket_counts');
const wrapAsync = require('../helpers').wrapAsync;

const router = express.Router();

router.post('/', wrapAsync(async (req, res) => {
  const payload = await TicketCountsService.create(req.body.data, req.currentUser);
  res.status(200).send(payload);
}));

router.put('/:id', wrapAsync(async (req, res) => {
  const payload = await TicketCountsService.update(req.params.id, req.body.data, req.currentUser);
  res.status(200).send(payload);
}));

router.delete('/:id', wrapAsync(async (req, res) => {
  await TicketCountsService.remove(req.params.id, req.currentUser);
  res.status(200).send({ id: req.params.id });
}));

router.get('/:id', wrapAsync(async (req, res) => {
  const payload = await TicketCountsDBApi.findBy({ id: req.params.id });
  res.status(200).send(payload);
}));

router.get('/', wrapAsync(async (req, res) => {
  const payload = await TicketCountsDBApi.findAll(req.query);
  res.status(200).send(payload);
}));

router.put('/ticket/:ticketId', wrapAsync(async (req, res) => {
  const payload = await TicketCountsService.updateTicketCounts(req.params.ticketId, req.body.counts, req.currentUser);
  res.status(200).send(payload);
}));

module.exports = router;