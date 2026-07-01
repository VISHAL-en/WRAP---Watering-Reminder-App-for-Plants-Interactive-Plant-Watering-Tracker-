self.addEventListener('push', e => {
    const data = e.data.json();
    console.log('Push Recieved...');
    self.registration.showNotification(data.title, {
        body: data.body,
        icon: 'https://images.unsplash.com/photo-1520412099551-62b6bafeb5bb?w=64&h=64&fit=crop', // Generic leaf icon
    });
});
