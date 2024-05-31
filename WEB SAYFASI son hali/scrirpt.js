document.addEventListener('DOMContentLoaded', () => {
    // Belge tamamen yüklendiğinde bu işlev çalışır.

    document.querySelectorAll('a[href^="#"]').forEach(link => {
        // Tüm # ile başlayan bağlantıları seç ve her biri için aşağıdaki işlemi yap.

        link.addEventListener('click', e => {
            // Bağlantıya tıklandığında bu işlev çalışır.
            e.preventDefault();
            // Bağlantının varsayılan davranışını iptal et.

            const targetID = link.getAttribute('href');
            // Bağlantının 'href' özelliğini al (örneğin "#section1").

            const targetElement = document.querySelector(targetID);
            // Hedef elemanı seç (bu ID'ye sahip eleman).

            if (targetElement) {
                // Eğer hedef eleman mevcutsa:
                window.scrollTo({
                    top: targetElement.offsetTop,
                    // Sayfayı hedef elemanın üstüne kaydır.
                    behavior: 'smooth'
                    // Kaydırma işlemini yumuşak bir şekilde yap.
                });
            }
        });
    });
});