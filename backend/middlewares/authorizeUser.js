import Event from '../models/event.js';

const authorize = (roles = []) => {
  if (typeof roles === 'string') {
    roles = [roles];
  }

  return async (req, res, next) => {
    const eventId = req.params.id;
    if (roles.includes('admin') && req.user.role === 'admin') {
      return next();
    }

    if (eventId) {
      const event = await Event.findById(eventId);
      if (!event) return res.status(404).json({ msg: 'Event not found' });
      if (event.ownerId.toString() === req.user.id) {
        return next();
      }
    }

    return res.status(403).json({ msg: 'Access denied' });
  };
};

export default authorize;
