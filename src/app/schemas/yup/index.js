import * as yup from 'yup';

yup.setLocale({
  mixed: {
    required: 'Field ${path} is required',
  },

  string: {
    min: 'Field ${path} must be at least ${min} characters long.',
    max: 'Field ${path} must be less then ${max} character long',
    email: '${value} is not a valid email.',
  },
});

export const sessionStoreSchema = yup.object().shape({
  email: yup
    .string()
    .required()
    .email(),
  password: yup
    .string()
    .required()
    .min(6),
});

export const userStoreSchema = yup.object().shape({
  name: yup.string().required(),
  email: yup
    .string()
    .required()
    .email(),
  password: yup
    .string()
    .required()
    .min(6),
  confirmPassword: yup
    .string()
    .required()
    .min(6),
});

export const userUpdateSchema = yup.object().shape({
  name: yup.string(),
  email: yup.string().email(),
  oldPassword: yup.string().min(6),
  password: yup.string().min(6),
  confirmPassword: yup.string().min(6),
});

export const appointmentStoreSchema = yup.object().shape({
  provider_id: yup.number().required(),
  date: yup.date().required(),
});
