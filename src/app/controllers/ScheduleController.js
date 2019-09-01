import { startOfDay, endOfDay, parseISO } from 'date-fns';
import { Op } from 'sequelize';

import Appointment from '../models/Appointment';

class SchedulerController {
  async index(req, res) {
    if (!req.user.provider) {
      return res
        .status(401)
        .json({ status: 'not ok', message: 'User is not a provider.' });
    }

    const { date } = req.query;
    const parsedDate = parseISO(date);

    const appointments = await Appointment.findAll({
      where: {
        provider_id: req.user.id,
        canceled_at: null,
        date: {
          [Op.between]: [startOfDay(parsedDate), endOfDay(parsedDate)],
        },
      },
      order: ['date'],
    });

    return res.json({ status: 'ok', appointments });
  }
}

export default new SchedulerController();
