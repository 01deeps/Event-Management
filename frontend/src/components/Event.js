import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import './Event.css';

const Events = ({ authToken, onLogout, userRole, userId }) => {
  const [events, setEvents] = useState([]);
  const [newEventData, setNewEventData] = useState({ name: '', date: '' });
  const [editEventData, setEditEventData] = useState({ id: null, name: '', date: '' });
  const [refresh, setRefresh] = useState(false);  

  useEffect(() => {
    fetchEvents();
  }, [authToken, refresh]);       

  const fetchEvents = async () => {
    try {
      const res = await axios.get('/api/events', {
        headers: { Authorization: `Bearer ${authToken}` }
      });
      setEvents(res.data);
    } catch (err) {
      console.error(err.response?.data || err.message);
      toast.error('Failed to load events');
    }
  };

  const onNewEventChange = (e) => {
    setNewEventData({ ...newEventData, [e.target.name]: e.target.value });
  };

  const onEditEventChange = (e) => {
    setEditEventData({ ...editEventData, [e.target.name]: e.target.value });
  };

  const onCreateEvent = async (e) => {
    e.preventDefault();
    try {
      await axios.post(
        '/api/events',
        newEventData,
        {
          headers: { Authorization: `Bearer ${authToken}` }
        }
      );
      setNewEventData({ name: '', date: '' });
      toast.success('Event created successfully');
      setRefresh(!refresh);  
    } catch (err) {
      console.error(err.response?.data || err.message);
      toast.error('Failed to create event');
    }
  };

  const onEditEvent = async (e) => {
    e.preventDefault();
    try {
      await axios.put(
        `/api/events/${editEventData.id}`,
        { name: editEventData.name, date: editEventData.date },
        {
          headers: { Authorization: `Bearer ${authToken}` }
        }
      );
      setEditEventData({ id: null, name: '', date: '' });
      toast.success('Event updated successfully');
      setRefresh(!refresh);  
    } catch (err) {
      console.error(err.response?.data || err.message);
      toast.error('Access denied');
    }
  };

  const onDeleteEvent = async (eventId) => {
    try {
      await axios.delete(`/api/events/${eventId}`, {
        headers: { Authorization: `Bearer ${authToken}` }
      });
      toast.success('Event deleted successfully');
      setRefresh(!refresh);  
    } catch (err) {
      console.error(err.response?.data || err.message);
      toast.error('Access denied');
    }
  };

  const canEditDelete = (event) => {
    return event.ownerId._id;
  };

  return (
    <div className='event'>
      <button className="logout" onClick={onLogout}>Logout</button>
      <h2>Total Events - {events.length}</h2>

      
      <form onSubmit={onCreateEvent}>
        <h3>Create New Event</h3>
        <div className='eventname'>
          <input
            type='text'
            placeholder='Event Name'
            name='name'
            value={newEventData.name}
            className='event1'
            onChange={onNewEventChange}
            required
          />
        </div>
        <div className='datevent'>
          <input
            type='date'
            placeholder='Event Date'
            name='date'
            value={newEventData.date}
            className='date'
            onChange={onNewEventChange}
            required
          />
        </div>
        <input className="create" type='submit' value='Create Event' />
      </form>

    
      {editEventData.id && (
        <form onSubmit={onEditEvent}>
          <h3>Edit Event</h3>
          <div className='eventname'>
            <input
              type='text'
              placeholder='Event Name'
              name='name'
              value={editEventData.name}
              className='event1'
              onChange={onEditEventChange}
              required
            />
          </div>
          <div className='datevent'>
            <input
              type='date'
              placeholder='Event Date'
              name='date'
              value={editEventData.date}
              className='date'
              onChange={onEditEventChange}
              required
            />
          </div>
          <input className="update" type='submit' value='Update Event' />
          <button className="cancel" onClick={() => setEditEventData({ id: null, name: '', date: '' })}>Cancel</button>
        </form>
      )}

    
      <h3>Existing Events</h3>
      <ul className='event-list'>
        {events.map(event => (
          <li key={event._id}>
            {event.name} - {new Date(event.date).toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' })}
           
            <span className="event-owner"> - Username : <span style={{ fontWeight: 'bold' }}>{event.ownerId.username}</span> </span>
            {/* <br /> */}
            {canEditDelete(event) && (
              <>
                <button className='edit' onClick={() => setEditEventData({ 
                  id: event._id, 
                  name: event.name, 
                  date: new Date(event.date).toISOString().split('T')[0]
                })}>
                  Edit
                </button>
                <button className='delete' onClick={() => onDeleteEvent(event._id)}>Delete</button>
              </>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Events;
