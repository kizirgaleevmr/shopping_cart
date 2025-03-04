import { createProduct, getProducts } from './api.js'
import { SELECTORS } from './selectors.js'
import { generateTemplate } from './generateTemplate'

init()

function init() {
  // подгрузка данных при загрузке страницы
  window.addEventListener('DOMContentLoaded', () => {
    getProducts().then((data) => {
      // Формируем нужный html для карточек
      generateTemplate(data)
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
