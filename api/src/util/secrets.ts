export const SECRET = {
  TEST_SECRET: 'TEST_SECRET',
  AFDIAN_TOKEN: 'AFDIAN_TOKEN',
  SERVER_APIKEY: 'SERVER_APIKEY',
  SERVER_APIKEY_TEST: 'SERVER_APIKEY_TEST',
};

export const GetSecretValue = (key: string): string => {
  return process.env[key];
};
