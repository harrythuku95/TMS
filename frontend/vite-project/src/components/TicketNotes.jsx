import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  TextField,
  Button,
  Card,
  CardContent,
  IconButton,
  Alert,
  CircularProgress,
  Grid,
} from '@mui/material';
import { Edit as EditIcon, Delete as DeleteIcon, Save as SaveIcon, Cancel as CancelIcon } from '@mui/icons-material';
import axios from 'axios';
import { useAuth } from '../context/auth';

const API_URL = import.meta.env.VITE_API_URL;

const TicketNotes = ({ ticketId }) => {
  const [notes, setNotes] = useState([]);
  const [newNote, setNewNote] = useState('');
  const [editingNoteId, setEditingNoteId] = useState(null);
  const [editingNoteText, setEditingNoteText] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const { user } = useAuth();

  useEffect(() => {
    fetchNotes();
  }, [ticketId]);

  const fetchNotes = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_URL}/tickets/${ticketId}/notes`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('authToken')}` },
      });
      setNotes(response.data);
      setError(null);
    } catch (err) {
      console.error('Error fetching notes:', err);
      setError('Failed to load notes. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleAddNote = async () => {
    if (!newNote.trim()) {
      setError('Note content cannot be empty');
      return;
    }

    try {
      await axios.post(
        `${API_URL}/tickets/${ticketId}/notes`,
        { note: newNote },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem('authToken')}` },
        }
      );
      setNewNote('');
      setSuccess('Note added successfully');
      setError(null);
      fetchNotes();
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      console.error('Error adding note:', err);
      setError(err.response?.data?.error || 'Failed to add note. Please try again.');
    }
  };

  const handleEditNote = (note) => {
    setEditingNoteId(note.id);
    setEditingNoteText(note.note);
  };

  const handleSaveEdit = async (noteId) => {
    if (!editingNoteText.trim()) {
      setError('Note content cannot be empty');
      return;
    }

    try {
      await axios.put(
        `${API_URL}/ticket-notes/${noteId}`,
        { note: editingNoteText },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem('authToken')}` },
        }
      );
      setEditingNoteId(null);
      setEditingNoteText('');
      setSuccess('Note updated successfully');
      setError(null);
      fetchNotes();
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      console.error('Error updating note:', err);
      setError(err.response?.data?.error || 'Failed to update note. Please try again.');
    }
  };

  const handleCancelEdit = () => {
    setEditingNoteId(null);
    setEditingNoteText('');
  };

  const handleDeleteNote = async (noteId) => {
    if (!window.confirm('Are you sure you want to delete this note?')) {
      return;
    }

    try {
      await axios.delete(`${API_URL}/ticket-notes/${noteId}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('authToken')}` },
      });
      setSuccess('Note deleted successfully');
      setError(null);
      fetchNotes();
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      console.error('Error deleting note:', err);
      setError(err.response?.data?.error || 'Failed to delete note. Please try again.');
    }
  };

  const canEditDelete = (note) => {
    return user.role === 'Admin' || note.createdBy.id === user.id;
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ mt: 3 }}>
      <Typography variant="h6" gutterBottom>
        Notes & Comments
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      {success && (
        <Alert severity="success" sx={{ mb: 2 }} onClose={() => setSuccess(null)}>
          {success}
        </Alert>
      )}

      {/* Add new note */}
      <Box sx={{ mb: 3 }}>
        <TextField
          label="Add a note or comment"
          multiline
          rows={3}
          value={newNote}
          onChange={(e) => setNewNote(e.target.value)}
          placeholder="Write your note here..."
          fullWidth
          sx={{ mb: 1 }}
        />
        <Button variant="contained" onClick={handleAddNote} disabled={!newNote.trim()}>
          Add Note
        </Button>
      </Box>

      {/* Display notes */}
      {notes.length === 0 ? (
        <Typography variant="body2" color="textSecondary" sx={{ fontStyle: 'italic' }}>
          No notes yet. Be the first to add one!
        </Typography>
      ) : (
        <Grid container spacing={2}>
          {notes.map((note) => (
            <Grid item xs={12} key={note.id}>
              <Card variant="outlined">
                <CardContent>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                    <Box>
                      <Typography variant="subtitle2" color="primary">
                        {note.createdBy.firstName} {note.createdBy.lastName}
                      </Typography>
                      <Typography variant="caption" color="textSecondary">
                        {new Date(note.createdAt).toLocaleString()}
                      </Typography>
                    </Box>
                    {canEditDelete(note) && (
                      <Box>
                        {editingNoteId === note.id ? (
                          <>
                            <IconButton
                              size="small"
                              color="primary"
                              onClick={() => handleSaveEdit(note.id)}
                              title="Save"
                            >
                              <SaveIcon fontSize="small" />
                            </IconButton>
                            <IconButton
                              size="small"
                              color="default"
                              onClick={handleCancelEdit}
                              title="Cancel"
                            >
                              <CancelIcon fontSize="small" />
                            </IconButton>
                          </>
                        ) : (
                          <>
                            <IconButton
                              size="small"
                              color="primary"
                              onClick={() => handleEditNote(note)}
                              title="Edit"
                            >
                              <EditIcon fontSize="small" />
                            </IconButton>
                            <IconButton
                              size="small"
                              color="error"
                              onClick={() => handleDeleteNote(note.id)}
                              title="Delete"
                            >
                              <DeleteIcon fontSize="small" />
                            </IconButton>
                          </>
                        )}
                      </Box>
                    )}
                  </Box>
                  {editingNoteId === note.id ? (
                    <TextField
                      multiline
                      rows={3}
                      value={editingNoteText}
                      onChange={(e) => setEditingNoteText(e.target.value)}
                      fullWidth
                      autoFocus
                    />
                  ) : (
                    <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap' }}>
                      {note.note}
                    </Typography>
                  )}
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </Box>
  );
};

export default TicketNotes;
