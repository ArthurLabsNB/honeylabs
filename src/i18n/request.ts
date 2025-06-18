import { getRequestConfig } from 'next-intl/server';

export default getRequestConfig(async ({ locale }) => {
  const available = ['es', 'en'];
  const selected = locale && available.includes(locale) ? locale : 'es';
  return {
    messages: (await import(`../messages/${selected}.json`)).default,
  };
});
