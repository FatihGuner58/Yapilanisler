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

let bookList = [], 
basketList = [];
let filteredBookList = [];

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
  return fetch("./products.json")
    .then((res) => res.json())
    .then((books) => {
      bookList = books;
      filteredBookList = books; // Filtrelenmiş listeyi de güncelle
      createBookItemsHtml();
      createBookTypeHtml();
    });
};

const createBookItemsHtml = () => {
  const bookListEl = document.querySelector(".book__list");
  let bookListHtml = "";

  filteredBookList.forEach((book) => {
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
            <button class="btn__purple" onclick="addBookToBasket(${book.id})">Sepete Ekle</button>
          </div>
        </div>
      </div>`;
  });

  bookListEl.innerHTML = bookListHtml;
};

const BOOK_TYPES = {
  ALL: "Tümü",
  NOVEL: "Roman",
  CHILDREN: "Çocuk",
  SELFIMPROVEMENT: "Kişisel Gelişim",
  HISTORY: "Tarih",
  FINANCE: "Finans",
  SCIENCE: "Bilim",
};

const createBookTypeHtml = () => {
  const filterEl = document.querySelector(".filter");
  let filterHtml = "";
  let filterTypes = ["ALL"];
  bookList.forEach(book => {
    if (filterTypes.findIndex((filter) => filter == book.type) == -1)
      filterTypes.push(book.type);
  });

  filterTypes.forEach((type, index) => {
    filterHtml += `<li class="${index == 0 ? "active" : ""}" onclick="filterBooks(this)" data-type="${type}">${BOOK_TYPES[type] || type}</li>`;
  });

  filterEl.innerHTML = filterHtml;
};

const filterBooks = (filterEl) => {
  document.querySelector(".filter .active").classList.remove("active");
  filterEl.classList.add("active");
  let bookType = filterEl.dataset.type;
  
  if (bookType === "ALL") {
    filteredBookList = bookList; // Tüm kitapları göster
  } else {
    filteredBookList = bookList.filter((book) => book.type == bookType);
  }
  createBookItemsHtml();
};

const listBasketItems = () => {
  const basketListEl = document.querySelector(".basket__list");
  const basketCountEl = document.querySelector(".basket__count");
  basketCountEl.innerHTML = basketList.length > 0 ? basketList.length : null;
  
  const totalPriceEl = document.querySelector(".total__price"); // Düzeltme burada

  let basketListHtml = "";
  let totalPrice = 0;
  basketList.forEach(item => {
    totalPrice += item.product.price * item.quantity;
    basketListHtml += `
      <li class="basket__item">
        <img src="${item.product.imgSource}" width="100" height="100">
        <div class="basket__item_info">
          <h3 class="book_name">${item.product.name}</h3>
          <span class="book_price">${item.product.price}₺</span><br>
          <span class="book__remove" onclick="removeItemToBasket(${item.product.id})">remove</span>
        </div>
        <div class="book__count">
          <span class="decrease" onclick="decreaseQuantity(${item.product.id})">-</span>
          <span class="my-5">${item.quantity}</span>
          <span class="increase" onclick="increaseQuantity(${item.product.id})">+</span>
        </div>
      </li>`;
  });
  basketListEl.innerHTML = basketListHtml;
  totalPriceEl.innerHTML = totalPrice > 0 ? "Total: " + totalPrice.toFixed(2) + "₺" : null;
};

const addBookToBasket = (bookId) => {
  let findedBook = bookList.find(book => book.id == bookId);
  if (findedBook) {
    const basketAlreadyIndex = basketList.findIndex(basket => basket.product.id == bookId);
    if (basketAlreadyIndex == -1) {
      let addedItem = { quantity: 1, product: findedBook };
      basketList.push(addedItem);
    } else {
      basketList[basketAlreadyIndex].quantity += 1;
    }
    listBasketItems();
  }
};

const removeItemToBasket = (bookId) => {
  basketList = basketList.filter(item => item.product.id != bookId);
  listBasketItems();
};

const decreaseQuantity = (bookId) => {
  const basketItem = basketList.find(item => item.product.id == bookId);
  if (basketItem && basketItem.quantity > 1) {
    basketItem.quantity -= 1;
  } else {
    basketList = basketList.filter(item => item.product.id != bookId);
  }
  listBasketItems();
};

const increaseQuantity = (bookId) => {
  const basketItem = basketList.find(item => item.product.id == bookId);
  if (basketItem) {
    basketItem.quantity += 1;
  }
  listBasketItems();
};

getBooks();