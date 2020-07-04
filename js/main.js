import { timeLeft, utcToMs } from './date.js'

const form = document.getElementById('form'),
  button = document.getElementById('button'),
  bottom = document.getElementById('bottom')

form.addEventListener('submit', (e) => {
  e.preventDefault()
})

const validate = {
  text: false,
  color: false,
  date: false,
}

//Evitando que se muestren fechas anteriores a hoy
form.fecha.setAttribute('min', new Date().toLocaleDateString('fr-CA'))

form.addEventListener('change', () => {
  //Avisar si el tiempo es pasado
  if (form.fecha.value === form.fecha.min) {
    form.tiempo.setAttribute(
      'min',
      new Date().toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
        hour12: false,
      })
    )
  } else form.tiempo.removeAttribute('min')

  //Validando que la fecha sea mayor a la actual
  const esFechaValida =
    form.fecha.valueAsNumber + form.tiempo.valueAsNumber > utcToMs()

  if (
    form.texto.value !== '' &&
    form.texto.value.length <= 30 &&
    form.color.value !== '' &&
    esFechaValida
  ) {
    validate.text = true
    validate.date = true
    validate.color = true
  } else {
    validate.text = false
    validate.date = false
    validate.color = false
  }
})

//Pasando los datos al localStorage
button.addEventListener('click', () => {
  if (validate.text && validate.color && validate.date) {
    const jsonTask = {
      text: form.texto.value,
      color: form.color.value,
      date: form.fecha.value,
      time: form.tiempo.value,
    }
    localStorage.setItem(Date.now().toString(), JSON.stringify(jsonTask))
    desplegar()
    form.reset()
  }
})

//Imprimiendo los datos del localStorage
const desplegar = () => {
  const fragment = document.createDocumentFragment()

  while (bottom.firstChild) {
    bottom.removeChild(bottom.firstChild)
  }

  for (let i = 0; i < localStorage.length; i++) {
    const json = localStorage.getItem(localStorage.key(i)),
      data = JSON.parse(json),
      { text, color, date, time } = data,
      task = document.createElement('div'),
      deleteTask = document.createElement('div'),
      dateContainer = document.createElement('div'),
      texto = document.createElement('p'),
      fecha = document.createElement('p'),
      hora = document.createElement('p'),
      countDown = document.createElement('p')

    task.classList = `task ${color}`
    deleteTask.classList = 'delete-task'
    texto.classList = 'task__text'
    dateContainer.classList = 'task__datetime'
    hora.classList = 'task__time'
    fecha.classList = 'task__date'

    deleteTask.id = localStorage.key(i)
    texto.textContent = text

    const fullDate = new Date(`${date}T${time}`)
    fecha.textContent = fullDate.toLocaleDateString([], {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    })

    hora.textContent = fullDate.toLocaleTimeString([], {
      hour: 'numeric',
      minute: 'numeric',
    })

    dateContainer.append(countDown, hora, fecha)
    task.append(texto, dateContainer, deleteTask)
    fragment.appendChild(task)
  }
  bottom.appendChild(fragment)
}

//Borrado
bottom.addEventListener('click', (e) => {
  if (e.target.classList.value === 'delete-task') {
    localStorage.removeItem(e.target.id)
    desplegar()
  }
})

desplegar()

//Actualizar tiempo restante
const timeUpdater = () => {
  const tasks = document.querySelectorAll('.task__datetime')
  for (let i = 0; i < localStorage.length; i++) {
    const json = localStorage.getItem(localStorage.key(i))
    const data = JSON.parse(json)
    const { date, time } = data
    const fullDate = new Date(`${date}T${time}`)
    tasks[i].firstChild.textContent = timeLeft(fullDate, new Date())
  }
  setTimeout(timeUpdater, 1000)
}

timeUpdater()