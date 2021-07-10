const DOCUMENT_MODEL = {
  USER: 'user',
  SESSION: 'session',
}

enum STATUS {
  ACTIVE = 1,
  INACTIVE = 2,
  DELETE = 3,
}

enum DEVICE_TYPE {
  IOS = 1,
  ANDROID = 2,
  WEB = 3,
}

const AUTHORIZATION = {
  VALID: 'Authorization is verified.',
  EXPIRED: 'Authorization is expired.',
  INVALID: 'Authorization is not valid',
  REQUIRED: 'Authorization is required',
  NO_ACCESS: 'You are not authorized to access',
  INVALID_MEHTOD: 'Invalid authorization method',
  NOT_FOUND: 'User is not registered with us or moved permanently.',
  INACTIVE_ACCOUNT: 'Not authorized to access , your account is blocked.',
};

export const CONSTANT = Object.freeze({
  DOCUMENT_MODEL,
  STATUS,
  AUTHORIZATION,
  DEVICE_TYPE,
});


