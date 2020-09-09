const payStringCode = {
  'default': 'Ошибка оплаты',
  '444': 'Истек срок действия карты',
  '507': 'Истек срок действия карты',
  '521': 'На карте недостаточно средств',
  '572': 'Истек срок действия карты',
  '574': 'Карта заблокирована',
  '579': 'Карта заблокирована',
  '584': 'Истек период обслуживания карты',
  '585': 'Истек период обслуживания карты',
  '705': 'Карта заблокирована',
  '706': 'Карта заблокирована',
  '707': 'Карта заблокирована',
  '2004': 'Карта заблокирована',
  '2005': 'Карта заблокирована',
  '2006': 'Карта заблокирована',
  '2007': 'Карта заблокирована',
  '2405': 'Карта заблокирована',
  '2406': 'Карта заблокирована',
  '2407': 'Карта заблокирована',
  '5109': 'Срок действия карты истек',
  '5110': 'Срок действия карты еще не начался',
  '5133': 'Операция отклонена картой',
  '2000': 'Оплата отменена клиентом',
  '4117': '',
  '5116': '',
  '5120': '',
  'ST-107': 'Не удалось подтвердить покупку в билетной системе',
  'ST-105': 'Невозможно оплатить покупку. Покупка с данным ID не найдена',
  'ST-114': 'Ошибка при проверке покупки в билетной системе',
  'ST-117': 'ККТ не готов к работе. Обратитесь к администратору или в кассу.',
  'ST-118': 'В терминале закончилась бумага. Обратитесь к администратору или в кассу.',
  'ST-119': 'К сожалению, одно или несколько выбранных Вами мест уже заняты. Выберите, пожалуйста, другие места.',
  'ST-120': 'Нет связи с билетной системой кинотеатра.',
  'ST-135': 'ККМ не готов к работе: проблема с получение статуса',
  'ST-136': 'ККМ не готов к работе: не удалось продолжить печать',
  'ST-139': 'Банковский терминал не готов к работе',
  'ST-203': 'Ошибка при получении статуса терминала',
}

const printStringCode = {
  'default': 'Ошибка печати чека.',
  'ST-103': 'Покупка не найдена.',
  'ST-108': 'Ошибка при печати кассового чека.',
  'ST-109': 'Ошибка при печати банковского чека.',
  'ST-110': 'Не найден банковский чек.',
  'ST-117': 'ККТ не готов к работе. Обратитесь к администратору или в кассу.',
  'ST-118': 'В терминале закончилась бумага. Обратитесь к администратору или в кассу.',
  'ST-119': 'К сожалению, одно или несколько выбранных Вами мест уже заняты. Выберите, пожалуйста, другие места.',
  'ST-120': 'Нет связи с билетной системой кинотеатра.',
  'ST-135': 'ККМ не готов к работе: проблема с получение статуса',
  'ST-136': 'ККМ не готов к работе: не удалось продолжить печать',
  'ST-139': 'Банковский терминал не готов к работе',
  'ST-203': 'Ошибка при получении статуса терминала',
}

const passStringCode = {
  'default': 'Ошибка. Обратитесь к администратору.',
  'ST-103': 'Покупка не найдена.',
  'ST-115': 'Непредвиденная ошибка при печати кассового чека.',
  'ST-122': 'Возврат невозможен. Сеанс начался.',
  'ST-123': 'Возврат невозможен. Покупка была на другом терминале.',
  'ST-124': 'Возврат невозможен. Покупка не найдена.',
  'ST-125': 'Возврат невозможен. Возврат уже совершён.',
  'ST-126': 'Ошибка при печати заявления.',
  'ST-127': 'Воспользуйтесь услугами терминала <strong>№{code}</strong>, ' +
  'на котором совершалась покупка. Возврат на этом терминале невозможен.',
  'ST-128': 'Печать чека возврата невозможна. Код возврата неверен.',
  'ST-129': 'Печать чека возврата невозможна. Покупка не найдена.',
  'ST-130': 'Печать чека возврата невозможна. Чек возврата прихода уже напечатан.',
  'ST-131': 'Ошибка при печати чека возврата',
  'ST-132': 'Возврат невозможен. Билеты были распечатаны.',
  'ST-133': 'Произошла непредвиденная ошибка при обработке запроса.',
  'ST-134': 'Произошла непредвиденная ошибка при обработке запроса.',
  'printed': 'Заявление уже было распечатано.',
}

export function getPassErrorText (code) {
  return passStringCode[code] || passStringCode.default
}

export function getPrintErrorText (code) {
  return printStringCode[code] || printStringCode.default
}

export function getPayErrorText (code) {
  return payStringCode[code] || payStringCode.default
}