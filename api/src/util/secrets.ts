export enum SECRET {
  AFDIAN_TOKEN = 'AFDIAN_TOKEN',
  PATREON_SECRET = 'PATREON_SECRET',
  SERVER_APIKEY = 'SERVER_APIKEY',
  SERVER_APIKEY_TEST = 'SERVER_APIKEY_TEST',
  GA4_API_SECRET = 'GA4_API_SECRET',
}

export const GetSecretValue = (key: SECRET): string => {
  const value = process.env[key];
  if (!value) {
    throw new Error(`Secret value for ${key} is not defined`);
  }
  return value;
};
