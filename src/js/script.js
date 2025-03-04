import { createProduct, getProducts } from './api.js'
import { SELECTORS } from './selectors.js'
import { generateBasket, generateTemplate } from './generateTemplate'

init()

function init() {
  // подгрузка данных при загрузке страницы
  window.addEventListener('DOMContentLoaded', () => {
    getProducts().then((data) => {
      // Формируем нужный html для карточек
      generateTemplate(data)

      // Получаем кнопки карточек
      const btn = document?.querySelectorAll('.btn')

      Array.from(btn).forEach((button) => {
        button.addEventListener('click', (event) => {
          const idCart = event?.target?.parentNode?.dataset?.id

          addBasket(idCart)
        })
      })
    })
    submitForm()
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
        })
      })
  })
}

// Добавление товара в localStorage
/**
 *
 * @param {object} cart - отдельна взятая карточка
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
  })
}

// Добавляем данные в хранилище
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
        el.count += 1
      })
      local.setItem('product', JSON.stringify(localArray))
    } else {
      localArray.push({ ...data, count: 0 })
      local.setItem('product', JSON.stringify(localArray))
    }
  } else {
    local.setItem('product', JSON.stringify([{ ...data, count: 0 }]))
  }
}

// Достаем данные из localstorage
function dataLocal() {
  return JSON.parse(localStorage.getItem('product'))
}

// Получаем данные из хранилища и передаем в корзину
const loadLocalStoreg = dataLocal()
generateBasket(loadLocalStoreg)

// Выводим общую стоимость товара
const totalPrice = loadLocalStoreg.reduce((previous, current) => {
  return previous + +current.price
}, 0)
SELECTORS.total.innerHTML = `Total: ${totalPrice}$`

// Выводим количество товаров в корзине
const totalInfo = loadLocalStoreg.reduce((previous, current) => {
  return previous + +current.count
}, 0)
SELECTORS.basketInfo.innerHTML = `${totalInfo}`
