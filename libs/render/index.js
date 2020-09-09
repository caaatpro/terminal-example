let variables = {}

export function setRenderVariables(value) {
  variables = value
}

function getVariablesColorPlace(type) {
  if (typeof variables[`type${type}`] !== 'undefined') {
    return variables[`type${type}`]
  }

  return variables.default
}

export function renderPlace (schemeObject, schemeDesigner, view) {
  const ctx = view.getContext()

  const colors = getVariablesColorPlace(schemeObject.params.type)

  ctx.beginPath()
  ctx.lineWidth = 1

  if (schemeObject.params.status === 1) {
    if (schemeObject.params.isSelected) {
      ctx.fillStyle = colors.selected.fill
      ctx.strokeStyle = colors.selected.stroke
    } else {
      ctx.fillStyle = colors.fill
      ctx.strokeStyle = colors.stroke
    }

    const relativeX = schemeObject.x
    const relativeY = schemeObject.y

    const width = (schemeObject.width - ctx.lineWidth)
    const height = (schemeObject.height - ctx.lineWidth)

    const radius = 1

    const x = relativeX
    const y = relativeY
    const r = {topLeft: 0, topRight: 0, bottomLeft: 0, bottomRight: 0}

    r.topLeft = radius
    r.topRight = radius
    r.bottomRight = radius
    r.bottomLeft = radius

    ctx.arc(x + r.topLeft, y + r.topLeft, r.topLeft, Math.PI, Math.PI + Math.PI / 2)
    ctx.lineTo(x + width - r.topRight, y)
    ctx.arc(x + width - r.topRight, y + r.topRight, r.topRight, Math.PI + Math.PI/2, Math.PI*2)
    ctx.lineTo(x + width, y + height - r.bottomRight)
    ctx.arc(x + width - r.bottomRight, y + height - r.bottomRight, r.bottomRight, Math.PI*2, Math.PI/2)
    ctx.lineTo(x + r.bottomLeft, y + height)
    ctx.arc(x + r.bottomLeft, y + height - r.bottomLeft, r.bottomLeft, Math.PI/2, Math.PI)
    ctx.closePath()
    ctx.save()
    ctx.fill()
    ctx.stroke()
  } else {
    ctx.fillStyle = variables.reserved.fill

    const width = (schemeObject.width - ctx.lineWidth)

    const x = schemeObject.x + (width/2)
    const y = schemeObject.y + (width/2)

    ctx.arc(x, y, width/10, 0, 2 * Math.PI, false)
    ctx.closePath()
    ctx.save()
    ctx.fill()
  }

  return true
}

export function renderRow (schemeObject, schemeDesigner, view) {
  const ctx = view.getContext()

  const color = variables.row

  const height = schemeObject.height

  const x = schemeObject.x+(schemeObject.width/2)
  const y = schemeObject.y+(height/2)
  ctx.font = height/2 + "px " + color.font
  ctx.fillStyle = color.color
  ctx.textBaseline = "middle"
  ctx.textAlign = "center"
  ctx.fillText(schemeObject.params.text, x, y)
  ctx.save()

  return true
}

export function renderScreen (schemeObject, schemeDesigner, view) {
  const ctx = view.getContext()

  const color = variables.screen

  ctx.beginPath()
  ctx.fillStyle = color.fill

  const relativeX = schemeObject.x
  const relativeY = schemeObject.y + 15

  const width = schemeObject.width
  const height = schemeObject.height

  ctx.moveTo(relativeX, relativeY)

  const cp1x = relativeX+(width/100)*30
  let cp1y = relativeY-15
  const cp2x = relativeX+(width/100)*70
  let cp2y = cp1y
  let x = relativeX + width
  let y = relativeY

  ctx.bezierCurveTo(cp1x, cp1y, cp2x, cp2y, x, y)
  ctx.lineTo(x, relativeY + height)

  cp1y = cp1y+height
  cp2y = cp2y+height
  x = relativeX
  y = relativeY+height

  ctx.bezierCurveTo(cp2x, cp2y, cp1x, cp1y, x, y)
  ctx.lineTo(relativeX, relativeY)
  ctx.closePath()
  ctx.fill()

  x = schemeObject.x+(schemeObject.width/2)
  y = schemeObject.y+(height/1.3)
  ctx.font = height/1.5 + "px " + color.font
  ctx.fillStyle = color.color
  ctx.textBaseline = "middle"
  ctx.textAlign = "center"
  ctx.fillText("Экран", x, y)

  ctx.save()

  return true
}
