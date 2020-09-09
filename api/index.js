import axios from 'axios'

let apiUrl = ''
let globalConfig = {}

export function setApiUrl(value) {
  apiUrl = value
}

export function setGlobalConfig(value) {
  globalConfig = value
}

// Получить список сеансов (обновляется раз в минуту)
export function getScheduleList() {
  return new Promise((resolve, reject) => {
    axios({
        method: 'POST',
        url: `${apiUrl}schedule/list`,
        validateStatus() {
          return true
        }
      })
      .then((response) => {
        resolve(response)
      })
      .catch((error) => {
        reject(error)
      })
  })
}

// Получить список планов залов для сеансов из первого запроса (обновляется раз в секунду)
export function hallPlanList() {
  return new Promise((resolve, reject) => {
    axios({
        method: 'GET',
        url: `${apiUrl}hallplan/list`,
        validateStatus() {
          return true
        },
      })
      .then((response) => {
        resolve(response)
      })
      .catch((error) => {
        reject(error)
      })
  })
}

// Инициировать процесс оплаты
export function salePay() {
  return new Promise((resolve, reject) => {
    const data = {
      summa: window.globalSum,
      saleid: window.globalSaleid
    }

    const urlParams = new URLSearchParams(data).toString()

    axios({
        method: 'GET',
        url: `${apiUrl}sale/pay?${urlParams}`,
        validateStatus() {
          return true
        }
      })
      .then((response) => {
        resolve(response)
      })
      .catch((error) => {
        reject(error)
      })
  })
}

// Отменить покупку
export function saleCancel() {
  return new Promise((resolve, reject) => {
    const data = {
      session: window.globalSession,
      saleid: window.globalSaleid
    }

    const urlParams = new URLSearchParams(data).toString()

    axios({
        method: 'GET',
        url: `${apiUrl}sale/cancel?${urlParams}`,
        validateStatus() {
          return true
        },
      })
      .then((response) => {
        window.globalSaleid = null
        resolve(response)
      })
      .catch((error) => {
        window.globalSaleid = null
        reject(error)
      })
  })
}

// Печать
export function salePrint() {
  return new Promise((resolve, reject) => {
    const data = {
      session: window.globalSession,
      saleid: window.globalSaleid
    }

    const urlParams = new URLSearchParams(data).toString()

    axios({
        method: 'GET',
        url: `${apiUrl}sale/print?${urlParams}`,
        validateStatus() {
          return true
        },
      })
      .then((response) => {
        window.globalSaleid = null
        resolve(response)
      })
      .catch((error) => {
        window.globalSaleid = null
        reject(error)
      })
  })
}

// Создать покупку с массивом мест
export function saleCreateArray(placeArray) {
  return new Promise((resolve, reject) => {
    let placeString = ''
    placeArray.forEach((item) => {
      const place = item.value
      placeString += `[l=${place.level};f=${place.fragment};r=${place.row};p=${place.place}]`
    })

    const data = {
      session: window.globalSession,
      place: placeString
    }

    const urlParams = new URLSearchParams(data).toString()

    axios({
        method: 'GET',
        url: `${apiUrl}sale/create?${urlParams}`,
        validateStatus() {
          return true
        },
      })
      .then((response) => {
        if (response.data.result === 'OK') {
          window.globalSaleid = response.data.content.saleId
        }

        resolve(response)
      })
      .catch((error) => {
        reject(error)
      })
  })
}

// Подгруздка конфигурации зала
export function hallPlan(hallId) {
  let cinema = process.env.cinema
  if (typeof globalConfig.cinemaConfig === 'string') {
    cinema = globalConfig.cinemaConfig
  }

  return new Promise((resolve, reject) => {
    axios({
        method: 'GET',
        url: `/${cinema}/halls/hall_${hallId}.json`,
        validateStatus() {
          return true
        },
      })
      .then((response) => {
        resolve(response)
      })
      .catch((error) => {
        reject(error)
      })
  })
}

// Глобальная конфигурация
export function getGlobalConfig() {
  return new Promise((resolve, reject) => {
    axios({
        method: 'GET',
        url: `/config.json`,
        validateStatus() {
          return true
        },
      })
      .then((response) => {
        resolve(response)
      })
      .catch((error) => {
        reject(error)
      })
  })
}

// Конфигурация кинотеатра
export function getCinemaConfig() {
  let cinema = process.env.cinema
  if (typeof globalConfig.cinemaConfig === 'string') {
    cinema = globalConfig.cinemaConfig
  }

  return new Promise((resolve, reject) => {
    axios({
        method: 'GET',
        url: `${cinema}/config.json`,
        validateStatus() {
          return true
        },
      })
      .then((response) => {
        resolve(response)
      })
      .catch((error) => {
        reject(error)
      })
  })
}
