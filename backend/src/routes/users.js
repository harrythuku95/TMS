const express = require('express');
const UsersService = require('../services/users');
const { checkRole } = require('../middlewares/checkRole');

const router = express.Router();

router.get('/', checkRole(['Admin']), async (req, res) => {
  try {
    const users = await UsersService.findAll(req.query);
    res.json(users);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.get('/:id', checkRole(['Admin']), async (req, res) => {
  try {
    const user = await UsersService.findById(req.params.id);
    res.json(user);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.post('/', checkRole(['Admin']), async (req, res) => {
  try {
    const user = await UsersService.create(req.body, req.currentUser);
    res.json(user);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.put('/:id', checkRole(['Admin']), async (req, res) => {
  try {
    const user = await UsersService.update(req.params.id, req.body, req.currentUser);
    res.json(user);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.put('/:id/role', checkRole(['Admin']), async (req, res) => {
  try {
    const user = await UsersService.updateRole(req.params.id, req.body.role, req.currentUser);
    res.json(user);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.delete('/:id', checkRole(['Admin']), async (req, res) => {
  try {
    await UsersService.remove(req.params.id, req.currentUser);
    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;