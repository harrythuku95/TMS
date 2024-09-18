const express = require('express');
const multer = require('multer');
const path = require('path');
const TicketsService = require('../services/tickets');
const wrapAsync = require('../helpers').wrapAsync;

const router = express.Router();

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage: storage });

router.post(
  '/',
  upload.array('files'),
  wrapAsync(async (req, res) => {
    try {
      const { subject, priority, description, status, customer } = req.body;
      const ticketData = { subject, priority, description, status, customer };
      
      const files = req.files ? req.files.map(file => ({
        name: file.filename,
        sizeInBytes: file.size,
        privateUrl: file.path,
        publicUrl: `/uploads/${file.filename}`,
        new: true,
      })) : [];

      const ticket = await TicketsService.create(
        { ...ticketData, files },
        req.currentUser,
      );

      res.status(200).send(ticket);
    } catch (error) {
      console.error('Error creating ticket:', error);
      res.status(500).send({ error: 'An error occurred while creating the ticket' });
    }
  }),
);

router.get(
  '/',
  wrapAsync(async (req, res) => {
    const payload = await TicketsService.findAll(req.query);
    res.status(200).send(payload);
  }),
);

router.get('/stats', wrapAsync(async (req, res) => {
  try {
    const stats = await TicketsService.getStats();
    res.json(stats);
  } catch (error) {
    console.error('Error fetching ticket stats:', error);
    res.status(500).json({ error: 'An error occurred while fetching ticket stats' });
  }
}));

router.get(
  '/:id',
  wrapAsync(async (req, res) => {
    const payload = await TicketsService.findBy({ id: req.params.id });
    res.status(200).send(payload);
  }),
);

router.put('/:id', wrapAsync(async (req, res) => {
  console.log("Received update request for ticket:", req.params.id, "with data:", req.body);
  const updatedTicket = await TicketsService.update(req.params.id, req.body, req.currentUser);
  res.status(200).send(updatedTicket);
}));

router.delete(
  '/:id',
  wrapAsync(async (req, res) => {
    await TicketsService.remove(req.params.id, req.currentUser);
    res.status(200).send(true);
  }),
);

module.exports = router;