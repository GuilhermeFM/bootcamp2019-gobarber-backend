import { promisify } from 'util';
import jwt from 'jsonwebtoken';

import User from '../models/User';
import authConfig from '../../config/auth';

export default async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res
      .status(401)
      .json({ status: 'not ok', message: 'Token not provided.' });
  }

  try {
    const [, token] = authHeader.split(' ');
    const tokenDecoded = await promisify(jwt.verify)(token, authConfig.secret);

    const user = await User.findByPk(tokenDecoded.id);
    if (!user) {
      return res
        .status(400)
        .json({ status: 'not ok', message: 'Invalid token.' });
    }

    req.user = user;
    return next();
  } catch (error) {
    return res
      .status(401)
      .json({ status: 'not ok', message: 'Invalid token.' });
  }
};
