self.addEventListener('push', function(event) {
  let data = {};
  try {
    data = event.data.json();
  } catch (e) {
    data = { title: 'New Message', body: 'You have a new message.' };
  }
  const title = data.notification?.title || data.title || 'New Message';
  const options = {
    body: data.notification?.body || data.body || 'You have a new message.',
    icon: '/icon-192x192.png', // Optional: update with your app icon path
    data: data.data || {},
  };
  event.waitUntil(self.registration.showNotification(title, options));
});

self.addEventListener('notificationclick', function(event) {
  event.notification.close();
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then(function(clientList) {
      if (clientList.length > 0) {
        return clientList[0].focus();
      }
      if (clients.openWindow) {
        return clients.openWindow('/');
      }
    })
  );
}); 