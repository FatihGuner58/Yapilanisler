document.addEventListener('DOMContentLoaded', () => {
    const stationNameElement = document.getElementById('stationName');
    const waitTimeElement = document.getElementById('waitTime');

    // İstanbul'daki bazı metro duraklarının örnek verileri
    const stations = [
        { id: 1, name: 'Taksim Durağı', coords: [41.0369, 28.9861], waitTime: '3 dakika' },
        { id: 2, name: 'Şişli Durağı', coords: [41.0605, 28.9874], waitTime: '5 dakika' },
        { id: 3, name: 'Kadıköy Durağı', coords: [40.9929, 29.0236], waitTime: '1 dakika' },
        { id: 4, name: 'Üsküdar Durağı', coords: [41.0226, 29.0136], waitTime: '4 dakika' },
        { id: 5, name: 'Levent Durağı', coords: [41.0826, 29.0110], waitTime: '2 dakika' },
        { id: 6, name: 'Gayrettepe Durağı', coords: [41.0667, 29.0005], waitTime: '6 dakika' },
        { id: 7, name: 'Atatürk Havalimanı Durağı', coords: [40.9769, 28.8144], waitTime: '8 dakika' },
        { id: 8, name: 'Mecidiyeköy Durağı', coords: [41.0653, 28.9857], waitTime: '7 dakika' },
        { id: 9, name: 'Aksaray Durağı', coords: [41.0125, 28.9514], waitTime: '3 dakika' }
    ];

    // Leaflet haritası oluştur
    const map = L.map('map').setView([41.015137, 28.979530], 11);

    // Harita katmanı ekle
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors'
    }).addTo(map);

    // Durağa tıklandığında bilgi göster
    function onStationClick(station) {
        stationNameElement.textContent = station.name;
        waitTimeElement.textContent = `Bekleme Süresi: ${station.waitTime}`;
    }

    // Durakları haritaya ekler.
    stations.forEach(station => {
        const marker = L.marker(station.coords).addTo(map);
        marker.bindPopup(`<b>${station.name}</b>`).on('click', () => onStationClick(station));
    });

    // Haritayı durakları kapsayacak şekilde yeniden merkezler ve ölçeklendirir.
    const bounds = L.latLngBounds(stations.map(station => station.coords));
    map.fitBounds(bounds);
});