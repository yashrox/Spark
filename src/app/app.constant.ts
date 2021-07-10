const DOCUMENT_MODEL = {
    USER: 'user',
    SESSION: 'session',
}

enum STATUS {
  ACTIVE = 1,
  INACTIVE = 2,
  DELETE = 3,
}

export const CONSTANT = Object.freeze({
  DOCUMENT_MODEL, 
  STATUS,
});

