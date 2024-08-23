const express = require('express');
const multer = require('multer');
const path = require('path');
const TicketsService = require('../services/tickets');
const TicketLabelsService = require('../services/ticket_labels');
const TicketCountsService = require('../services/ticket_counts');
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

/**
 * @swagger
 * components:
 *   schemas:
 *     Ticket:
 *       type: object
 *       properties:
 *         ticket_id:
 *           type: string
 *         subject:
 *           type: string
 *         priority:
 *           type: string
 *         description:
 *           type: string
 *         status:
 *           type: string
 *         assignee:
 *           type: string
 *         customer:
 *           type: string
 *         labels:
 *           type: string
 *         counts:
 *           type: string
 *         files:
 *           type: array
 *           items:
 *             type: string
 * 
 * tags:
 *   name: Tickets
 *   description: Ticket management
 */

/**
 * @swagger
 * /api/tickets:
 *   post:
 *     security:
 *       - bearerAuth: []
 *     tags: [Tickets]
 *     summary: Create a new ticket
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             $ref: '#/components/schemas/Ticket'
 *     responses:
 *       200:
 *         description: Ticket created successfully
 *       500:
 *         description: Server error
 */
router.post(
  '/',
  upload.array('files'),
  wrapAsync(async (req, res) => {
    const { ticket_id, subject, priority, assignee, description, status, customer, labels, counts } = req.body;
    const ticketData = { ticket_id, subject, priority, assignee, description, status, customer };
    const files = req.files.map(file => ({
      name: file.filename,
      sizeInBytes: file.size,
      privateUrl: file.path,
      publicUrl: `/uploads/${file.filename}`,
      new: true,
    }));

    const ticket = await TicketsService.create(
      { ...ticketData, files },
      req.currentUser,
    );

    if (labels) {
      const labelsArray = labels.split(',').map(label_id => ({ label_id, ticketId: ticket.id }));
      await TicketLabelsService.bulkImport(labelsArray, req.currentUser);
    }

    if (counts) {
      const countsArray = counts.split(',').map(count_id => ({ count_id, ticketId: ticket.id }));
      await TicketCountsService.bulkImport(countsArray, req.currentUser);
    }

    res.status(200).send(true);
  }),
);

/**
 * @swagger
 * /api/tickets:
 *   get:
 *     security:
 *       - bearerAuth: []
 *     tags: [Tickets]
 *     summary: Get all tickets
 *     responses:
 *       200:
 *         description: List of tickets
 *       500:
 *         description: Server error
 */
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

/**
 * @swagger
 * /api/tickets/{id}:
 *   get:
 *     security:
 *       - bearerAuth: []
 *     tags: [Tickets]
 *     summary: Get ticket by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The ticket ID
 *     responses:
 *       200:
 *         description: Ticket data
 *       404:
 *         description: Ticket not found
 *       500:
 *         description: Server error
 */
router.get(
  '/:id',
  wrapAsync(async (req, res) => {
    const payload = await TicketsService.findBy({ id: req.params.id });
    res.status(200).send(payload);
  }),
);

/**
 * @swagger
 * /api/tickets/{id}:
 *   put:
 *     security:
 *       - bearerAuth: []
 *     tags: [Tickets]
 *     summary: Update a ticket
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The ticket ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Ticket'
 *     responses:
 *       200:
 *         description: Ticket updated successfully
 *       404:
 *         description: Ticket not found
 *       500:
 *         description: Server error
 */
router.put(
  '/:id',
  wrapAsync(async (req, res) => {
    await TicketsService.update(req.params.id, req.body, req.currentUser);
    res.status(200).send(true);
  }),
);

/**
 * @swagger
 * /api/tickets/{id}:
 *   delete:
 *     security:
 *       - bearerAuth: []
 *     tags: [Tickets]
 *     summary: Delete a ticket
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The ticket ID
 *     responses:
 *       200:
 *         description: Ticket deleted successfully
 *       404:
 *         description: Ticket not found
 *       500:
 *         description: Server error
 */
router.delete(
  '/:id',
  wrapAsync(async (req, res) => {
    await TicketsService.remove(req.params.id, req.currentUser);
    res.status(200).send(true);
  }),
);

router.use('/', require('../helpers').commonErrorHandler);

module.exports = router;
