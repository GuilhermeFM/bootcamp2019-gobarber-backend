import { startOfHour, parseISO, isBefore } from 'date-fns';

import User from '../models/User';
import File from '../models/File';
import Appointment from '../models/Appointment';

import { appointmentStoreSchema } from '../schemas';

class AppointmentController {
  async index(req, res) {
    const { page = 1 } = req.query;

    const appointments = await Appointment.findAll({
      attributes: ['id', 'date'],
      where: { user_id: req.user.id, canceled_at: null },
      order: ['date'],
      limit: 20,
      offset: (page - 1) * 20,
      include: [
        {
          attributes: ['id', 'name'],
          model: User,
          as: 'provider',
          include: [
            {
              attributes: ['id', 'path', 'url'],
              model: File,
              as: 'avatar',
            },
          ],
        },
      ],
    });

    return res.json({ status: 'ok', appointments });
  }

  async store(req, res) {
    try {
      await appointmentStoreSchema.validate(req.body);
    } catch (err) {
      return res.status(400).json({ status: 'not ok', message: err.message });
    }

    const { provider_id, date } = req.body;
    const isProvider = await User.findOne({
      where: { id: provider_id, provider: true },
    });

    if (!isProvider) {
      return res.status(401).json({
        status: 'not ok',
        error: 'You can only create appointments with providers.',
      });
    }

    const hourStart = startOfHour(parseISO(date));
    if (isBefore(hourStart, new Date())) {
      return res.status(400).json({
        status: 'not ok',
        message: 'Past dates are not permitted.',
      });
    }

    const checkAvailability = await Appointment.findOne({
      where: {
        provider_id,
        canceled_at: null,
        date: hourStart,
      },
    });

    if (checkAvailability) {
      return res.status(400).json({
        status: 'not ok',
        message: 'Appointments date is not available.',
      });
    }

    const appointment = await Appointment.create({
      user_id: req.user.id,
      provider_id,
      date,
    });

    return res.json({ status: 'ok', appointment });
  }
}

export default new AppointmentController();
