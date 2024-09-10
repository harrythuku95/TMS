const express = require('express');
const CustomersService = require('../services/customers');
const wrapAsync = require('../helpers').wrapAsync;
const { setCurrentUser, checkRole } = require('../middlewares/checkRole');

const router = express.Router();

router.use(setCurrentUser);
router.use(checkRole(['Admin', 'Agent'])); // Adjust roles as needed

router.post('/', wrapAsync(async (req, res) => {
  const data = req.body;
  const result = await CustomersService.create(data, req.currentUser);
  res.status(200).send(result);
}));

router.put('/:id', wrapAsync(async (req, res) => {
  const { id } = req.params;
  const data = req.body;
  const result = await CustomersService.update(id, data, req.currentUser);
  res.status(200).send(result);
}));

router.delete('/:id', wrapAsync(async (req, res) => {
  const { id } = req.params;
  await CustomersService.remove(id, req.currentUser);
  res.status(200).send({ id });
}));

router.get('/:id', wrapAsync(async (req, res) => {
  const { id } = req.params;
  const result = await CustomersService.findBy({ id });
  res.status(200).send(result);
}));

router.get('/', wrapAsync(async (req, res) => {
  try {
    const payload = await CustomersService.findAll(req.query);
    res.status(200).send(payload);
  } catch (error) {
    console.error('Error fetching customers:', error);
    res.status(500).send({ error: 'An error occurred while fetching customers' });
  }
}));

router.get('/autocomplete', wrapAsync(async (req, res) => {
  const { query, limit } = req.query;
  const payload = await CustomersService.findAllAutocomplete(query, limit);
  res.status(200).send(payload);
}));

module.exports = router;