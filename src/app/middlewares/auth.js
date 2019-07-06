import jwt from 'jsonwebtoken';
import { promisify } from 'util';

import authConfig from '../../config/auth';

export default async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ error: 'Token not provided.' });
  }

  try {
    const [, token] = authHeader.split(' ');
    req.tokenDecoded = await promisify(jwt.verify)(token, authConfig.secret);

    return next();
  } catch (error) {
    return res.status(401).json({ error: 'Token is not valid.' });
  }
};
