const express = require('express');
const CloseRequestService = require('../services/closeRequest');
const wrapAsync = require('../helpers').wrapAsync;

const router = express.Router();

router.post(
  '/',
  wrapAsync(async (req, res) => {
    const payload = await CloseRequestService.create(req.body, req.currentUser);
    res.status(200).send(payload);
  }),
);

router.put(
  '/:id',
  wrapAsync(async (req, res) => {
    const payload = await CloseRequestService.update(req.params.id, req.body, req.currentUser);
    res.status(200).send(payload);
  }),
);

router.delete(
  '/:id',
  wrapAsync(async (req, res) => {
    await CloseRequestService.remove(req.params.id, req.currentUser);
    res.status(200).send({ id: req.params.id });
  }),
);

router.get(
  '/:id',
  wrapAsync(async (req, res) => {
    const payload = await CloseRequestService.findBy({ id: req.params.id });
    res.status(200).send(payload);
  }),
);

router.get(
  '/',
  wrapAsync(async (req, res) => {
    const payload = await CloseRequestService.findAll(req.query);
    res.status(200).send(payload);
  }),
);

router.post(
  '/:id/approve',
  wrapAsync(async (req, res) => {
    const payload = await CloseRequestService.approve(req.params.id, req.currentUser.id);
    res.status(200).send(payload);
  }),
);

module.exports = router;