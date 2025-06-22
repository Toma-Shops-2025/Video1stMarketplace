const webpush = require('web-push');

webpush.setVapidDetails(
  'mailto:admin@tomashops.com',
  process.env.VAPID_PUBLIC_KEY,
  process.env.VAPID_PRIVATE_KEY
);

exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }
  try {
    const { token, title, body, data } = JSON.parse(event.body);
    await webpush.sendNotification(
      JSON.parse(token),
      JSON.stringify({ title, body, data })
    );
    return { statusCode: 200, body: 'Notification sent' };
  } catch (err) {
    return { statusCode: 500, body: err.toString() };
  }
}; 