import User from '../models/User';
import File from '../models/File';

class ProviderController {
  async store(req, res) {
    const providers = await User.findAll({
      where: { provider: true },
      attributes: ['id', 'name', 'email'],
      include: [
        {
          model: File,
          as: 'avatar',
          attributes: ['id', 'name', 'path', 'url'],
        },
      ],
    });

    return res.json({ status: 'ok', providers });
  }
}

export default new ProviderController();
