export const SECRET = {
  AFDIAN_TOKEN: 'AFDIAN_TOKEN',
  PATREON_SECRET: 'PATREON_SECRET',
  SERVER_APIKEY: 'SERVER_APIKEY',
  SERVER_APIKEY_TEST: 'SERVER_APIKEY_TEST',
};

export const GetSecretValue = (key: string): string => {
  return process.env[key];
};
