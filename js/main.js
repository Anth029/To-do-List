const form = document.getElementById('form'),
button = document.getElementById('button'),
bottom = document.getElementById('bottom')//Parte inferior de la app, donde estarán las tareas

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
  //Avisa si el tiempo es pasado
  if (form.fecha.value === form.fecha.min) {
    form.tiempo.setAttribute('min', new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false }))
  }else form.tiempo.removeAttribute('min')

  //Obteniendo la fecha actual en ms
  const offset = new Date().getTimezoneOffset()
  let offsetToMs, timeFixed  
  if (offset > 0) {
    offsetToMs = offset * 60 * 1000
    timeFixed = Date.now() - offsetToMs
  } else if (offset < 0) {
    offsetToMs = Math.abs(offset) * 60 * 1000
    timeFixed = Date.now() + offsetToMs
  } else timeFixed = Date.now()
  
  //Validando que la fecha sea mayor a la actual
  const esFechaValida =
    form.fecha.valueAsNumber + form.tiempo.valueAsNumber > timeFixed

  if (form.texto.value !== '' && form.color.value !== '' && esFechaValida) {
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
    localStorage.setItem(
      Date.now().toString(),
      JSON.stringify(jsonTask)
    )
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
    {text, color, date, time} = data,
    task = document.createElement('div'),
    deleteTask = document.createElement('div'),
    texto = document.createElement('p'),
    fecha = document.createElement('p'),
    hora = document.createElement('p')
    
    task.classList = `task ${color}`
    deleteTask.classList = 'delete-task'
    texto.classList = 'task__text'
    hora.classList = 'task__time'
    fecha.classList = 'task__date'
    
    deleteTask.id = localStorage.key(i)
    texto.textContent = text

    const fullDate = new Date(`${date}T${time}`)
    fecha.textContent = fullDate.toLocaleDateString([], {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })

    hora.textContent = fullDate.toLocaleTimeString([], {
      hour: 'numeric',
      minute: 'numeric'
    })

    task.append(texto, hora, fecha, deleteTask)
    fragment.appendChild(task)
  }
  bottom.appendChild(fragment)
}

desplegar()

bottom.addEventListener('click', e => {
  if (e.target.classList.value === "delete-task"){
    localStorage.removeItem(e.target.id)
    desplegar()
  }
})