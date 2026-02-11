const express = require('express');
const passport = require('passport');
const TicketNotesService = require('../services/ticketNotes');
const wrapAsync = require('../helpers').wrapAsync;

const router = express.Router();

// Get all notes for a ticket
router.get(
  '/tickets/:ticketId/notes',
  passport.authenticate('jwt', { session: false }),
  wrapAsync(async (req, res) => {
    const { ticketId } = req.params;

    try {
      const notes = await TicketNotesService.findAllByTicket(ticketId);
      res.status(200).json(notes);
    } catch (error) {
      console.error('Error fetching ticket notes:', error);
      res.status(400).json({ error: error.message || 'Failed to fetch notes' });
    }
  })
);

// Create a note for a ticket
router.post(
  '/tickets/:ticketId/notes',
  passport.authenticate('jwt', { session: false }),
  wrapAsync(async (req, res) => {
    const { ticketId } = req.params;
    const { note } = req.body;

    if (!note || note.trim() === '') {
      return res.status(400).json({ error: 'Note content is required' });
    }

    try {
      const newNote = await TicketNotesService.create(ticketId, { note }, req.user);
      res.status(201).json(newNote);
    } catch (error) {
      console.error('Error creating ticket note:', error);
      res.status(400).json({ error: error.message || 'Failed to create note' });
    }
  })
);

// Update a note
router.put(
  '/ticket-notes/:id',
  passport.authenticate('jwt', { session: false }),
  wrapAsync(async (req, res) => {
    const { id } = req.params;
    const { note } = req.body;

    if (!note || note.trim() === '') {
      return res.status(400).json({ error: 'Note content is required' });
    }

    try {
      const updatedNote = await TicketNotesService.update(id, { note }, req.user);
      res.status(200).json(updatedNote);
    } catch (error) {
      console.error('Error updating ticket note:', error);
      res.status(400).json({ error: error.message || 'Failed to update note' });
    }
  })
);

// Delete a note
router.delete(
  '/ticket-notes/:id',
  passport.authenticate('jwt', { session: false }),
  wrapAsync(async (req, res) => {
    const { id } = req.params;

    try {
      await TicketNotesService.remove(id, req.user);
      res.status(200).json({ message: 'Note deleted successfully' });
    } catch (error) {
      console.error('Error deleting ticket note:', error);
      res.status(400).json({ error: error.message || 'Failed to delete note' });
    }
  })
);

module.exports = router;
