const track = document.querySelector('.slider__track')
const viewport = document.querySelector('.slider__viewport')
const items = document.querySelectorAll('.slider__item')
const indicatorsContainer = document.querySelector('.slider__indicators')

console.log('viewport.offsetWidth:', viewport.offsetWidth)
console.log('track.scrollWidth:', track.scrollWidth)
console.log('item width:', items[0].getBoundingClientRect().width)
console.log('gap from style:', getComputedStyle(track).gap)
console.log('count of items:', items.length)
console.log(
  'total calculated width:',
  items.length * items[0].getBoundingClientRect().width +
    (items.length - 1) * parseInt(getComputedStyle(track).gap)
)

let currentIndex = 0
let slideWidth = 0
let gap = 0
let cardsPerPage = 1
let maxIndex = 0
let maxOffset = 0

function calculateDimensions() {
  const trackStyle = getComputedStyle(track)
  gap = parseInt(trackStyle.gap) || 0

  slideWidth = items[0].getBoundingClientRect().width + gap

  cardsPerPage = Math.floor(viewport.offsetWidth / slideWidth) || 1
  maxIndex = Math.max(0, items.length - cardsPerPage)

  const totalWidth = track.scrollWidth
  const visibleWidth = viewport.offsetWidth

  maxOffset = totalWidth - visibleWidth
}

function goToSlide(index) {
  const extraPadding = 20
  currentIndex = Math.max(0, Math.min(index, maxIndex))

  const offset = Math.min(
    currentIndex * slideWidth,
    maxOffset + gap + extraPadding
  )
  track.style.transform = `translateX(-${offset}px)`

  updateIndicators()
}

function createIndicators() {
  indicatorsContainer.innerHTML = ''
  for (let i = 0; i <= maxIndex; i++) {
    const span = document.createElement('span')
    span.classList.add('slider__indicator')
    if (i === currentIndex) span.classList.add('slider__indicator--active')
    span.addEventListener('click', () => goToSlide(i))
    indicatorsContainer.appendChild(span)
  }
}

function updateIndicators() {
  document.querySelectorAll('.slider__indicator').forEach((el, i) => {
    el.classList.toggle('slider__indicator--active', i === currentIndex)
  })
}

function recalculate() {
  calculateDimensions()
  createIndicators()
  goToSlide(currentIndex)
}

// Навигация по стрелкам
document
  .querySelector('.slider__arrow--right')
  ?.addEventListener('click', () => {
    goToSlide(currentIndex + 1)
  })
document
  .querySelector('.slider__arrow--left')
  ?.addEventListener('click', () => {
    goToSlide(currentIndex - 1)
  })

// Прокрутка колесом
viewport.addEventListener('wheel', (e) => {
  e.preventDefault()
  goToSlide(currentIndex + (e.deltaY > 0 ? 1 : -1))
})

// Свайп
let touchStartX = 0
viewport.addEventListener('touchstart', (e) => {
  touchStartX = e.touches[0].clientX
})
viewport.addEventListener('touchend', (e) => {
  const delta = e.changedTouches[0].clientX - touchStartX
  if (Math.abs(delta) > 50) {
    goToSlide(currentIndex + (delta < 0 ? 1 : -1))
  }
})

// Обновление при ресайзе
window.addEventListener('resize', recalculate)

// Инициализация
recalculate()
