import { createProduct, getProducts } from './api.js'
import { SELECTORS } from './selectors.js'
import { generateBasket, generateTemplate } from './generateTemplate'

init()

function init() {
  // подгрузка данных при загрузке страницы
  window.addEventListener('DOMContentLoaded', () => {
    // Показываем товары в корзине
    showPriceBasket()
    showTotalBasketProduct()
    getProducts().then((data) => {
      // Формируем нужный html для карточек
      generateTemplate(data)
      // Добавляем товар в корзину
      addCartBasket()
    })
    submitForm()
    // Получаем данные из хранилища и передаем в корзину
    const loadLocalStoreg = dataLocal()
    // Формируем корзину
    generateBasket(loadLocalStoreg)
  })
}

// Функция добавления товара в корзину
function addCartBasket() {
  // Получаем кнопки карточек
  const btn = document?.querySelectorAll('.btn')

  Array.from(btn).forEach((button) => {
    button.addEventListener('click', (event) => {
      const idCart = event?.target?.parentNode?.dataset?.id

      addBasket(idCart)
    })
  })
}
// Обработчик формы
function submitForm() {
  SELECTORS?.form?.addEventListener('submit', (event) => {
    event.preventDefault()
    // Новый товар
    const productData = {}
    // Получаем форму
    const form = SELECTORS?.form

    for (const element of form?.elements) {
      if (!element.name) {
        continue
      }
      productData[element.name] = element.value
    }
    // Функция создания нового товара
    createProduct(productData)
      .then((response) => response.json())
      .then((data) => {
        console.log(data)
        // Показ актуальных данных
        getProducts().then((data) => {
          // Формируем нужный html для карточек
          generateTemplate(data)
          // Добавление товара в корзину
          addCartBasket()
          init()
        })
      })
  })
}

// Добавление товара в localStorage
/**
 *
 * @param {object} cart - отдельна взятая карточка для создания объекта для передачи в localstorage
 */
function addBasket(elemId) {
  const LS = localStorage
  // Создаем объект
  const productObj = {}
  // Отбираем нужный товар
  getProducts().then((data) => {
    const filterData = data.filter(({ id }) => id === elemId)
    filterData.forEach((obj) => {
      for (const key in obj) {
        productObj[key] = obj[key]
      }
    })
    addLocal(LS, productObj)
    // Получаем данные из хранилища и передаем в корзину
    const loadLocalStoreg = dataLocal()
    // Формируем корзину
    generateBasket(loadLocalStoreg)
  })
}

// Функция для добавления в localStorage
/**
 *
 * @param {localStorage} local - локальное хранилище
 * @param {object} data - объект для сохранения данных
 */
function addLocal(local, data) {
  if (local.length !== 0) {
    const localArray = dataLocal()
    const checkProduct = localArray.some((product) => {
      return product.id === data.id
    })
    if (checkProduct) {
      localArray.forEach((el) => {
        if (el.id === data.id) {
          el.count += 1
        }
      })
      local.setItem('product', JSON.stringify(localArray))
    } else {
      localArray.push({ ...data, count: 1 })
      local.setItem('product', JSON.stringify(localArray))
    }
  } else {
    local.setItem('product', JSON.stringify([{ ...data, count: 1 }]))
  }
  showPriceBasket()
  showTotalBasketProduct()
}

// Достаем данные из localstorage
export function dataLocal() {
  return JSON.parse(localStorage.getItem('product'))
}

/**
 * Функция Выводит общую стоимость товара
 */
export function showPriceBasket() {
  // данные из хранилища
  const data = dataLocal()
  if (data) {
    const totalPrice = data.reduce((previous, current) => {
      return previous + +current.price * current.count
    }, 0)
    SELECTORS.total.innerHTML = `Total: ${totalPrice}$`
  }
}

/**
 * Функция выводит  общее количество товаров в корзине
 */
function showTotalBasketProduct() {
  // данные из хранилища
  const data = dataLocal()
  if (data) {
    const totalInfo = data.reduce((previous, current) => {
      return previous + +current.count
    }, 0)
    SELECTORS.basketInfo.innerHTML = `${totalInfo}`
  }
}

// Открываем модальное окно
const btnBasket = document?.querySelector('#open-basket')
btnBasket.addEventListener('click', () => {
  window['modal-basket'].showModal()
})

// Закрываем модалное окно
const closeBasket = document?.querySelector('.close-button')
closeBasket.addEventListener('click', () => {
  window['modal-basket'].close()
})
