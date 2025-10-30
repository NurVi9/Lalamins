// Listener saat service worker di-install
self.addEventListener('install', (event) => {
  console.log('Service Worker berhasil di-install.');
  // Langsung aktifkan service worker baru tanpa menunggu
  event.waitUntil(self.skipWaiting());
});

// Listener saat service worker di-aktifkan
self.addEventListener('activate', (event) => {
  console.log('Service Worker berhasil di-aktifkan.');
  // Ambil alih kontrol halaman yang ada
  event.waitUntil(self.clients.claim());
});

self.addEventListener('push', (event) => {
  console.log('Menerima pesan push:', event);

  let payload;
  try {
    // Coba parse data JSON yang dikirim dari Edge Function Anda
    payload = event.data.json();
  } catch (e) {
    // Jika gagal, buat payload default
    payload = {
      title: 'Luminox Update',
      body: 'Ada sesuatu yang baru, cek sekarang!',
      icon: 'https.www.dropbox.com/scl/fi/yz8831kakxyc5f3t5f0dl/f8968f32c554ba5cd6bcab519fc0fae8.jpg?rlkey=398wt14ned3ugz41gjz3yx9en&st=6cfbpj8t&dl=1',
      data: {
        url: self.registration.scope // URL default ke halaman utama
      }
    };
  }

  const title = payload.title;
  const options = {
    body: payload.body,
    icon: payload.icon,
    badge: 'https://www.dropbox.com/scl/fi/yz8831kakxyc5f3t5f0dl/f8968f32c554ba5cd6bcab519fc0fae8.jpg?rlkey=398wt14ned3ugz41gjz3yx9en&st=6cfbpj8t&dl=1', // Ikon kecil di status bar
    data: {
      url: payload.data.url // URL yang akan dibuka saat notif diklik
    }
  };

  // Tampilkan notifikasi ke pengguna
  event.waitUntil(self.registration.showNotification(title, options));
});

/**
 * Listener saat pengguna MENGKLIK notifikasi
 */
self.addEventListener('notificationclick', (event) => {
  console.log('Notifikasi diklik:', event);
  
  // Tutup notifikasi yang diklik
  event.notification.close();

  // Ambil URL dari data notifikasi
  const urlToOpen = event.notification.data.url;

  // Buka tab browser baru ke URL tersebut
  event.waitUntil(
    clients.matchAll({
      type: 'window',
      includeUncontrolled: true
    }).then((clientList) => {
      // Jika tab website sudah terbuka, fokus ke tab itu
      for (let i = 0; i < clientList.length; i++) {
        let client = clientList[i];
        if (client.url === urlToOpen && 'focus' in client) {
          return client.focus();
        }
      }
      // Jika tidak ada tab yang terbuka, buka tab baru
      if (clients.openWindow) {
        return clients.openWindow(urlToOpen);
      }
    })
  );
});
