import express from 'express';
import auth from '../middlewares/authenticateUser.js';
import authorize from '../middlewares/authorizeUser.js';
import Event from '../models/event.js';

const router = express.Router();

router.post('/', auth, async (req, res) => {
    const { name, date } = req.body;
  
    try {
      const newEvent = new Event({
        name,
        date,
        ownerId: req.user.id
      });
  
      const event = await newEvent.save();
      res.json(event);
    } catch (err) {
      console.error(err.message);
      res.status(500).json({ msg: 'Server error', error: err.message });
    }
  });


router.get('/', auth, async (req, res) => {
  try {
    const events = await Event.find().populate('ownerId', 'username _id');
    res.json(events);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ msg: 'Server error', error: err.message });
  }
});

router.put('/:id', auth, async (req, res) => {
    const { name, date } = req.body;
  
    try {
      let event = await Event.findById(req.params.id);
  
      if (!event) return res.status(404).json({ msg: 'Event not found' });
  
      if (event.ownerId.toString() !== req.user.id && req.user.role !== 'admin') {
        return res.status(403).json({ msg: 'User not authorized' });
      }
  
      event = await Event.findByIdAndUpdate(
        req.params.id,
        { $set: { name, date } },
        { new: true }
      );
  
      res.json(event);
    } catch (err) {
      console.error(err.message);
      res.status(500).json({ msg: 'Server error', error: err.message });
    }
  });


router.delete('/:id', auth, async (req, res) => {
    try {
      const event = await Event.findById(req.params.id);
  
      if (!event) return res.status(404).json({ msg: 'Event not found' });
  
      
      if (event.ownerId.toString() !== req.user.id && req.user.role !== 'admin') {
        return res.status(403).json({ msg: 'User not authorized' });
      }
  
      await Event.findByIdAndRemove(req.params.id);
  
      res.json({ msg: 'Event removed' });
    } catch (err) {
      console.error(err.message);
      res.status(500).json({ msg: 'Server error', error: err.message });
    }
  });

export default router;
