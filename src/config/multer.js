import multer from 'multer';
import crypto from 'crypto';
import { extname, resolve } from 'path';

const buildFilename = (req, file, callback) => {
  crypto.randomBytes(16, (err, bytes) => {
    if (err) return callback(err);
    const filename = bytes.toString('hex') + extname(file.originalname);
    return callback(null, filename);
  });
};

export default {
  storage: multer.diskStorage({
    destination: resolve(__dirname, '..', '..', 'temp', 'uploads'),
    filename: buildFilename,
  }),
};
