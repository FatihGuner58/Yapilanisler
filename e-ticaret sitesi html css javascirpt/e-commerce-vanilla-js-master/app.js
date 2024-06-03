  document.addEventListener('DOMContentLoaded', function() {
  const thumbnails = document.querySelectorAll('.thumbnails img');
  const carousel = new bootstrap.Carousel(document.querySelector('#carouselBookSlider')); // Carousel nesnesi oluşturuldu

  thumbnails.forEach((thumbnail, index) => {
    thumbnail.addEventListener('click', () => {
      thumbnails.forEach(img => img.classList.remove('active'));
      thumbnail.classList.add('active');
      carousel.to(index); // Carousel'ı belirli bir slayta geçirme
    });
  });

  carousel._element.addEventListener('slid.bs.carousel', function () { // Carousel olay dinleyicisi eklendi
    const activeIndex = Array.from(this.querySelectorAll('.carousel-inner .active')).indexOf(this.querySelector('.carousel-item.active')); // Aktif slaytın indeksini bulma
    thumbnails.forEach(img => img.classList.remove('active'));
    thumbnails[activeIndex].classList.add('active');
  });
});

//Bu fonksiyon modali açıp kapatacak olan işlevi gerçekleştirecek
function toggleModal() {
  var modal = document.getElementById("myModal");
  var display = modal.style.display;
  modal.style.display = (display === "block") ? "none" : "block";
};

// Close the modal when the user clicks on <span> (x)
var span = document.getElementsByClassName("close")[0];
span.onclick = function() {
  var modal = document.getElementById("myModal");
  modal.style.display = "none";
};

// Close the modal when the user clicks anywhere outside of the modal
window.onclick = function(event) {
  var modal = document.getElementById("myModal");
  if (event.target == modal) {
    modal.style.display = "none";
  }
};

let bookList = [];

const generateStarRating = (starRate) => {
  let starRateHtml = "";
  for (let i = 1; i <= 5; i++) {
    if (Math.round(starRate) >= i) {
      starRateHtml += '<i class="bi bi-star-fill active"></i>';
    } else {
      starRateHtml += '<i class="bi bi-star-fill"></i>';
    }
  }
  return starRateHtml;
};

const getBooks = () => {
  fetch("./products.json")
    .then((res) => res.json())
    .then((books) => {
      bookList = books;
      createBookItemsHtml();
    });
};

const createBookItemsHtml = () => {
  const bookListEl = document.querySelector(".book__list");
  let bookListHtml = "";

  bookList.forEach((book) => {
    bookListHtml += `
      <div class="col-5 mb-5">
        <div class="row book__card">
          <div class="col-6">
            <img class="img-fluid shadow" width="258px" height="400" src="${book.imgSource}" alt="${book.name}">
          </div>
          <div class="col-6 d-flex flex-column justify-content-between">
            <div class="book__detail">
              <span class="fas gray fs-5">${book.author}</span><br>
              <span class="fs-4 fw-bold">${book.name}</span><br>
              <span class="book__star-rate">
                ${generateStarRating(book.rating)}
                <br>
                <span class="gray">${book.reviewCount} review${book.reviewCount > 1 ? 's' : ''}</span><br>
              </span>
            </div>
            <p class="book__description fos gray">${book.description}</p>
            <div>
              <span class="black fw-bold fs-5">${book.price}₺</span>
              ${book.oldPrice ? `<span class="gray fs-5 text-decoration-line-through">${book.oldPrice}₺</span>` : ""}
              </div>
            <button class="btn__purple">Sepete Ekle</button>
          </div>
        </div>
      </div>`;
  });

  bookListEl.innerHTML = bookListHtml;
};

// Başlangıçta kitapları getirmek için getBooks fonksiyonunu çağır
getBooks();
createBookItemsHtml();
