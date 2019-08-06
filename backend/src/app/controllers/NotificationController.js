import Notification from '../schemas/mongo/Notification';

class NotificationController {
  async index(req, res) {
    if (!req.user.provider) {
      return res.status(401).json({
        status: 'not ok',
        message: 'Only provider can load notifications.',
      });
    }

    const notifications = await Notification.find({ user: req.user.id })
      .sort({ createdAt: 'desc' })
      .limit(20);

    return res.json({ status: 'ok', notifications });
  }

  async update(req, res) {
    const notification = await Notification.findByIdAndUpdate(
      req.params.id,
      { read: true },
      { new: true }
    );

    return res.json({ status: 'ok', notification });
  }
}

export default new NotificationController();
