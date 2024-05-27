const slideshowContainer = document.getElementById('slideshow-container');
const thumbnailsContainer = document.getElementById('thumbnails');
const prevButton = document.getElementById('prev');
const nextButton = document.getElementById('next');

let currentSlide = 0;
let images = [
  'backraund.jpg', // İlk resmin URL'si
  'resim7.jpg', // İkinci resmin URL'si
  'resim9.jpg', // Üçüncü resmin URL'si
  
  // Diğer resimlerin URL'lerini buraya ekleyin...
];

// Slaytları gösterir
function showSlides(index) {
  if (index < 0) {
    currentSlide = images.length - 1;
  } else if (index >= images.length) {
    currentSlide = 0;
  }

  slideshowContainer.innerHTML = '';
  
  const slide = document.createElement('div');
  slide.classList.add('slide');
  const img = document.createElement('img');
  img.src = images[currentSlide];
  slide.appendChild(img);
  slideshowContainer.appendChild(slide);
}

// Küçük resimleri gösterir
function showThumbnails() {
  thumbnailsContainer.innerHTML = '';

  images.forEach((image, index) => {
    const thumbnail = document.createElement('img');
    thumbnail.src = image;
    thumbnail.classList.add('thumbnail');
    thumbnail.addEventListener('click', () => {
      currentSlide = index;
      showSlides(currentSlide);
    });
    thumbnailsContainer.appendChild(thumbnail);
  });
}

// Slayt sayısını artırır veya azaltır
function plusSlides(n) {
  currentSlide += n;
  showSlides(currentSlide);
}

// Sayfa yüklendiğinde slaytları ve küçük resimleri göster
document.addEventListener('DOMContentLoaded', () => {
  showSlides(currentSlide);
  showThumbnails();
});