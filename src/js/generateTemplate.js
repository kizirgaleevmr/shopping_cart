import { SELECTORS } from './selectors.js'
import { dataLocal, showPriceBasket } from './script.js'
// Функция создает html на основе данных
export function generateTemplate(data) {
  let html = ''

  if (data && Array.isArray(data)) {
    data.forEach((product) => {
      html += `
            <div class="main-card" data-id="${product?.id}">
                <div class="card-image">
                  <img src="${product?.imgSrc}" alt="image">
  
                  <div class="card-wishlist">
                    <div class="wishlist-rating">
  
                      <div class="rating-img">
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path
                            d="M16 6.12414H9.89333L8 0L6.10667 6.12414H0L4.93333 9.90345L3.06667 16L8 12.2207L12.9333 16L11.04 9.87586L16 6.12414Z"
                            fill="#FFCE31" />
                        </svg>
                      </div>
  
                      <span class="rating-amount">${product?.rating}</span>
                    </div>
  
                    <svg class="whishlist-heart" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
                      <path
                        d="m16 28c7-4.733 14-10 14-17 0-1.792-.683-3.583-2.05-4.95-1.367-1.366-3.158-2.05-4.95-2.05-1.791 0-3.583.684-4.949 2.05l-2.051 2.051-2.05-2.051c-1.367-1.366-3.158-2.05-4.95-2.05-1.791 0-3.583.684-4.949 2.05-1.367 1.367-2.051 3.158-2.051 4.95 0 7 7 12.267 14 17z">
                      </path>
                    </svg>
                  </div>
                </div>
  
                <h3 class="card-name">${product?.name}</h3>
  
                <p class="card-category">${product?.category}</p>
  
                <p class="card-price">${product?.price}</p>
  
                <button class="btn btn-primary">Add to cart</button>
              </div>
          `
    })
  }
  // Очистка исходного содержимого
  SELECTORS.productList.innerHTML = ''

  SELECTORS?.productList?.insertAdjacentHTML('beforeend', html)
}

export function generateBasket(data) {
  let html = ''

  if (data && Array.isArray(data)) {
    data.forEach((product) => {
      html += `
              <div class="main-card" data-id="${product?.id}">
                <div class="card-image">
                    <img src="${product?.imgSrc}" alt="image">
                </div>
                <div class="card-info">
                <h3 class="card-name">${product?.name}</h3>
    
                <p class="card-category">${product?.category}</p>
    
                <p class="card-price">${product?.price}</p>
                <p class="card-count">Count ${product?.count}</p></div>
                <div>
                <button type="button" class="delet-product red">X</button></div>
              </div>
            `
    })
  }
  // Очистка исходного содержимого
  SELECTORS.basket.innerHTML = ''

  SELECTORS?.basket?.insertAdjacentHTML('beforeend', html)

  // Удаление товара из корзины
  Array.from(document?.querySelectorAll('.delet-product')).forEach((elem) => {
    elem.addEventListener('click', (event) => {
      // получем все товары из localStorage
      const productLocal = JSON.parse(localStorage.getItem('product'))
      // фильтруем товар для удаления
      const newProduct = productLocal.filter((obj) => {
        if (obj.id !== event.target.parentNode.parentNode.dataset.id) {
          return true
        }
      })
      // Записываем отфильтрованный товар после удаления в localstorage
      localStorage.setItem('product', JSON.stringify(newProduct))

      // обновляем корзину
      // достаем данные из localstorage
      const data = dataLocal()
      generateBasket(data)
      // Обновляем цену
      showPriceBasket(data)
    })
  })
}
