const rtf2 = new Intl.RelativeTimeFormat([], { numeric: 'auto' })

export const timeLeft = (IncomingDate, actualDate) => {
  if (IncomingDate.getFullYear() > actualDate.getFullYear()) {
    return rtf2.format(
      IncomingDate.getFullYear() - actualDate.getFullYear(),
      'year'
    )
  } else if (IncomingDate.getFullYear() === actualDate.getFullYear()) {
    if (IncomingDate.getMonth() > actualDate.getMonth()) {
      return rtf2.format(
        IncomingDate.getMonth() - actualDate.getMonth(),
        'month'
      )
    } else if (IncomingDate.getMonth() === actualDate.getMonth()) {
      if (IncomingDate.getDate() > actualDate.getDate()) {
        return rtf2.format(IncomingDate.getDate() - actualDate.getDate(), 'day')
      } else if (IncomingDate.getDate() === actualDate.getDate()) {
        if (IncomingDate.getHours() > actualDate.getHours()) {
          return rtf2.format(
            IncomingDate.getHours() - actualDate.getHours(),
            'hour'
          )
        } else if (IncomingDate.getHours() === actualDate.getHours()) {
          if (IncomingDate.getMinutes() > actualDate.getMinutes()) {
            return rtf2.format(
              IncomingDate.getMinutes() - actualDate.getMinutes(),
              'minute'
            )
          } else if (IncomingDate.getMinutes() === actualDate.getMinutes()) {
            return rtf2.format(
              60 - actualDate.getSeconds(),
              'second'
            )
          } else return 'expired'
        } else return 'expired'
      } else return 'expired'
    } else return 'expired'
  } else return 'expired'
}


export const utcToMs = () => {
  const offset = new Date().getTimezoneOffset()
  let offsetToMs, timeFixed
  if (offset > 0) {
    offsetToMs = offset * 60 * 1000
    timeFixed = Date.now() - offsetToMs
  } else if (offset < 0) {
    offsetToMs = Math.abs(offset) * 60 * 1000
    timeFixed = Date.now() + offsetToMs
  } else timeFixed = Date.now()
  return timeFixed
}
