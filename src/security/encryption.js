/**
 * Encryption Helpers
 * For sensitive offline data
 * File: encryption.js
 */
const ENCRYPTION_NOT_IMPLEMENTED = 'ENCRYPTION_NOT_IMPLEMENTED';

const encrypt = async (data) => {
  const error = new Error(ENCRYPTION_NOT_IMPLEMENTED);
  error.code = ENCRYPTION_NOT_IMPLEMENTED;
  error.context = {
    op: 'encrypt',
    hasData: data !== undefined && data !== null,
  };
  throw error;
};

const decrypt = async (encryptedData) => {
  const error = new Error(ENCRYPTION_NOT_IMPLEMENTED);
  error.code = ENCRYPTION_NOT_IMPLEMENTED;
  error.context = {
    op: 'decrypt',
    hasData: encryptedData !== undefined && encryptedData !== null,
  };
  throw error;
};

export { ENCRYPTION_NOT_IMPLEMENTED, encrypt, decrypt };
