const express = require('express');
const CustomersService = require('../services/customers');
const CustomersDBApi = require('../db/api/customers');
const wrapAsync = require('../helpers').wrapAsync;
const { setCurrentUser, checkRole } = require('../middlewares/checkRole');

const router = express.Router();

router.use(setCurrentUser);
router.use(checkRole(['Admin', 'Agent']));

router.post('/', wrapAsync(async (req, res) => {
  console.log('Received request body:', req.body);
  console.log('Received headers:', req.headers);
  const result = await CustomersService.create(req.body, req.currentUser);
  res.status(200).send(result);
}));

router.put('/:id', wrapAsync(async (req, res) => {
  const payload = await CustomersService.update(req.body.data, req.params.id, req.currentUser);
  res.status(200).send(payload);
}));

router.delete('/:id', wrapAsync(async (req, res) => {
  await CustomersService.remove(req.params.id, req.currentUser);
  res.status(200).send({ id: req.params.id });
}));

router.get('/:id', wrapAsync(async (req, res) => {
  const payload = await CustomersDBApi.findBy({ id: req.params.id });
  res.status(200).send(payload);
}));

router.get('/', wrapAsync(async (req, res) => {
  console.log('Fetching customers');
  try {
    const payload = await CustomersDBApi.findAll(req.query);
    console.log('Customers fetched successfully:', payload);
    res.status(200).send(payload);
  } catch (error) {
    console.error('Error fetching customers:', error);
    res.status(500).send({ error: 'An error occurred while fetching customers' });
  }
}));

router.get('/autocomplete', wrapAsync(async (req, res) => {
  const payload = await CustomersDBApi.findAllAutocomplete(req.query.query, req.query.limit);
  res.status(200).send(payload);
}));

module.exports = router;