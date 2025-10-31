// service-worker.js
self.addEventListener('push', function(event) {
  if (!event.data) return;

  const data = event.data.json();
  const options = {
    body: data.body || 'Ada update baru nih',
    icon: 'https://www.dropbox.com/scl/fi/yz8831kakxyc5f3t5f0dl/f8968f32c554ba5cd6bcab519fc0fae8.jpg?rlkey=398wt14ned3ugz41gjz3yx9en&st=6cfbpj8t&dl=1',
    badge: 'https://www.dropbox.com/scl/fi/yz8831kakxyc5f3t5f0dl/f8968f32c554ba5cd6bcab519fc0fae8.jpg?rlkey=398wt14ned3ugz41gjz3yx9en&st=6cfbpj8t&dl=1',
    image: data.image || null,
    tag: 'luminox-notification',
    renotify: true,
    requireInteraction: true,
    actions: data.actions || [
      {
        action: 'open',
        title: 'Buka Aplikasi'
      },
      {
        action: 'close',
        title: 'Tutup'
      }
    ],
    data: {
      url: data.url || '/'
    }
  };

  event.waitUntil(
    self.registration.showNotification(data.title || 'Luminox', options)
  );
});

self.addEventListener('notificationclick', function(event) {
  event.notification.close();

  if (event.action === 'open') {
    event.waitUntil(
      clients.matchAll({ type: 'window' }).then(function(clientList) {
        for (let client of clientList) {
          if (client.url === '/' && 'focus' in client) {
            return client.focus();
          }
        }
        if (clients.openWindow) {
          return clients.openWindow(event.notification.data.url || '/');
        }
      })
    );
  } else if (event.action === 'close') {
    // Tidak melakukan apa-apa, notifikasi sudah ditutup
  } else {
    // Klik pada body notifikasi
    event.waitUntil(
      clients.matchAll({ type: 'window' }).then(function(clientList) {
        for (let client of clientList) {
          if (client.url === '/' && 'focus' in client) {
            return client.focus();
          }
        }
        if (clients.openWindow) {
          return clients.openWindow(event.notification.data.url || '/');
        }
      })
    );
  }
});

self.addEventListener('pushsubscriptionchange', function(event) {
  event.waitUntil(
    self.registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: urlBase64ToUint8Array('BJPmbgeeLhcQIeo2CSt5vjqVy0WQ1qNjclpwcUD2Qrq2Duz_7zCyxFz9-zzC-tR8qn188pRo4pSoxnb4F0qotgo')
    }).then(function(subscription) {
      // Kirim subscription baru ke server
      return fetch('/api/update-subscription', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          old_subscription: event.oldSubscription,
          new_subscription: subscription
        })
      });
    })
  );
});

// Helper function untuk konversi base64 to Uint8Array
function urlBase64ToUint8Array(base64String) {
  const padding = '='.repeat((4 - base64String.length % 4) % 4);
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);
  
  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}