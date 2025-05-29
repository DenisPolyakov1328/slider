const track = document.querySelector('.slider__track')
const viewport = document.querySelector('.slider__viewport')
const items = document.querySelectorAll('.slider__item')
const indicatorsContainer = document.querySelector('.slider__indicators')

let currentIndex = 0
let slideWidth = 0
let cardsPerPage = 1
let maxIndex = 0

function calculateDimensions() {
  const itemStyle = getComputedStyle(items[0])
  const gap = parseInt(itemStyle.marginRight) || 16
  slideWidth = items[0].offsetWidth + gap

  cardsPerPage = Math.floor(viewport.offsetWidth / slideWidth) || 1

  const totalWidth = track.scrollWidth
  const visibleWidth = viewport.offsetWidth
  maxIndex = Math.ceil(
    (totalWidth - visibleWidth) / (slideWidth * cardsPerPage)
  )
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

function goToSlide(index) {
  currentIndex = Math.max(0, Math.min(index, maxIndex))

  const totalWidth = track.scrollWidth
  const visibleWidth = viewport.offsetWidth
  const maxOffset = totalWidth - visibleWidth

  const offset = Math.min(currentIndex * slideWidth * cardsPerPage, maxOffset)
  track.style.transform = `translateX(-${offset}px)`

  // Обновление индикаторов
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
  .addEventListener('click', () => {
    goToSlide(currentIndex + 1)
  })

document.querySelector('.slider__arrow--left').addEventListener('click', () => {
  goToSlide(currentIndex - 1)
})

// Поддержка прокрутки колесиком мыши
viewport.addEventListener('wheel', (e) => {
  e.preventDefault()
  const direction = e.deltaY > 0 ? 1 : -1
  goToSlide(currentIndex + direction)
})

// Поддержка свайпа
let touchStartX = 0

viewport.addEventListener('touchstart', (e) => {
  touchStartX = e.touches[0].clientX
})

viewport.addEventListener('touchend', (e) => {
  const touchEndX = e.changedTouches[0].clientX
  const delta = touchEndX - touchStartX

  if (Math.abs(delta) > 50) {
    goToSlide(currentIndex + (delta < 0 ? 1 : -1))
  }
})

// При изменении размеров
window.addEventListener('resize', recalculate)

// Инициализация
recalculate()
