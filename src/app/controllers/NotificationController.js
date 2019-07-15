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
}

export default new NotificationController();
