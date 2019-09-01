import User from '../models/User';
import File from '../models/File';

import { userStoreSchema, userUpdateSchema } from '../schemas/yup';

class UserController {
  async store(req, res) {
    try {
      await userStoreSchema.validate(req.body);
    } catch (err) {
      return res.status(401).json({ status: 'not ok', message: err.message });
    }

    const { password, confirmPassword } = req.body;
    if (password !== confirmPassword) {
      return res
        .status(400)
        .json({ status: 'not ok', message: 'password did not match.' });
    }

    const userExists = await User.findOne({ where: { email: req.body.email } });
    if (userExists) {
      return res
        .status(400)
        .json({ status: 'not ok', message: 'User already exists.' });
    }

    const { id, name, email, provider } = await User.create(req.body);
    return res.json({ status: 'ok', user: { id, name, email, provider } });
  }

  async update(req, res) {
    try {
      await userUpdateSchema.validate(req.body);
    } catch (err) {
      return res.status(401).json({ status: 'not ok', message: err.message });
    }

    const { user } = req;
    const { email: novoEmail } = req.body;
    const { oldPassword, password, confirmPassword } = req.body;

    if (novoEmail && novoEmail !== user.email) {
      const userExists = await User.findOne({ where: { novoEmail } });
      if (userExists) {
        return res.status(400).json({
          status: 'not ok',
          message: 'This email is associated with other user.',
        });
      }
    }

    if (password) {
      if (!oldPassword || !(await user.checkPassword(oldPassword))) {
        return res
          .status(401)
          .json({ status: 'not ok', message: 'Old Password did not match.' });
      }

      if (password !== confirmPassword) {
        return res
          .status(401)
          .json({ status: 'not ok', message: 'Password did not match.' });
      }
    }

    await user.update(req.body);

    const { id, name, email, avatar } = await User.findByPk(req.user.id, {
      include: [
        {
          model: File,
          as: 'avatar',
          attributes: ['id', 'path', 'url'],
        },
      ],
    });

    return res.json({ id, name, email, avatar });
  }
}

export default new UserController();
