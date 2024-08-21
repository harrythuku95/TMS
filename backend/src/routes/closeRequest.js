// src/routes/closeRequest.js
const express = require('express');
const CloseRequestService = require('../services/closeRequest');
const wrapAsync = require('../helpers').wrapAsync;
const { checkPermissions } = require('../middlewares/check-permissions');

const router = express.Router();

router.post(
  '/create',
  wrapAsync(async (req, res) => {
    const closeRequest = await CloseRequestService.createCloseRequest(req.body.ticketId, req.currentUser);
    res.status(200).send(closeRequest);
  }),
);

router.post(
  '/approve',
  wrapAsync(async (req, res) => {
    const closeRequest = await CloseRequestService.approveCloseRequest(req.body.closeRequestId, req.currentUser.id);
    res.status(200).send(closeRequest);
  }),
);

module.exports = router;
