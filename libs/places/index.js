export function cleanBadSelected (originStr) {
  const places = []
  const str = originStr.replace(/\n/g, '').replace(/\s+/g, '').toLowerCase()

  if (!str.includes('выбранныеместазаняты')) {
    return places
  }

  const result = str.match(/ряд:\d+место:\d+/g)

  if (result == null) {
    return places
  }

  result.forEach((line) => {
    const info = line.match(/ряд:(\d+)место:(\d+)/)

    if (info == null) return true

    places.push(`p${info[1]}_${info[2]}`)
  })

  return places
}
