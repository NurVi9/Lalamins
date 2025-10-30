/* === service-worker.js === */

self.addEventListener('push', function(event) {
  const data = event.data.json(); // Kita asumsikan notifikasi dikirim sebagai JSON

  const title = data.title || "Luminox";
  const options = {
    body: data.body || 'Ada update baru!',
    icon: data.icon || 'https://www.dropbox.com/scl/fi/yz8831kakxyc5f3t5f0dl/f8968f32c554ba5cd6bcab519fc0fae8.jpg?rlkey=398wt14ned3ugz41gjz3yx9en&st=6cfbpj8t&dl=1', // Icon default
    badge: 'https://www.dropbox.com/scl/fi/yz8831kakxyc5f3t5f0dl/f8968f32c554ba5cd6bcab519fc0fae8.jpg?rlkey=398wt14ned3ugz41gjz3yx9en&st=6cfbpj8t&dl=1', // Icon kecil di status bar
    data: {
      url: data.url || self.location.origin, // URL untuk dibuka saat diklik
    },
  };

  event.waitUntil(self.registration.showNotification(title, options));
});

self.addEventListener('notificationclick', function(event) {
  event.notification.close(); // Tutup notifikasi

  const urlToOpen = event.notification.data.url;

  event.waitUntil(
    clients.matchAll({
      type: 'window',
      includeUncontrolled: true,
    }).then((clientList) => {
      // Jika website sudah terbuka, fokus ke tab itu
      for (let i = 0; i < clientList.length; i++) {
        let client = clientList[i];
        if (client.url === urlToOpen && 'focus' in client) {
          return client.focus();
        }
      }
      // Jika tidak, buka tab baru
      if (clients.openWindow) {
        return clients.openWindow(urlToOpen);
      }
    })
  );
});
