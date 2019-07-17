import { startOfHour, parseISO, isBefore, format, subHours } from 'date-fns';
import pt from 'date-fns/locale/pt';

import User from '../models/User';
import File from '../models/File';
import Appointment from '../models/Appointment';

import Notification from '../schemas/mongo/Notification';
import { appointmentStoreSchema } from '../schemas/yup';

import Queue from '../../lib/Queue';
import CancelationMail from '../Jobs/CancellationMail';

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
    if (provider_id === req.user.id) {
      return res.status(400).json({
        status: 'not ok',
        message: "Providers can't create appointments do it self.",
      });
    }

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
      provider_id,
      user_id: req.user.id,
      date: hourStart,
    });

    const formattedDate = format(
      hourStart,
      "'dia' dd 'de' MMMM', às' H:mm'h'",
      { locale: pt }
    );

    await Notification.create({
      user: provider_id,
      content: `Novo agendamento de ${req.user.name} para ${formattedDate}`,
    });

    return res.json({ status: 'ok', appointment });
  }

  async delete(req, res) {
    const appointment = await Appointment.findByPk(req.params.id, {
      include: [
        { attributes: ['name', 'email'], model: User, as: 'provider' },
        { attributes: ['name'], model: User, as: 'user' },
      ],
    });

    if (appointment.user_id !== req.user.id) {
      return res.status(401).json({
        status: 'not ok',
        message: "You don't have permission to cancel this appointment.",
      });
    }

    const dateWithSub = subHours(appointment.date, 2);
    if (isBefore(dateWithSub, new Date())) {
      return res.status(401).json({
        status: 'not ok',
        message: 'You can only cancel appointments two hours in advance',
      });
    }

    appointment.canceled_at = new Date();
    await appointment.save();
    await Queue.add(CancelationMail.key, { appointment });

    return res.json({ status: 'ok', appointment });
  }
}

export default new AppointmentController();
