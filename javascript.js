document.addEventListener('DOMContentLoaded', () => {
  const menuButton = document.getElementById('menuButton')
  const mobileNav = document.getElementById('mobileNav')
  const showAllBtn = document.getElementById('showAllBtn')
  const yearEl = document.getElementById('year')

  yearEl.textContent = new Date().getFullYear()

  const navLinks = document.querySelectorAll('.nav-pill-item[href^="#"]')
  const sections = [...navLinks]
    .map((link) => document.querySelector(link.getAttribute('href')))
    .filter(Boolean)

  function setActiveLink(id) {
    navLinks.forEach((link) => {
      link.classList.toggle('active', link.getAttribute('href') === `#${id}`)
    })
  }

  if ('IntersectionObserver' in window && sections.length) {
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0]
        if (visible) setActiveLink(visible.target.id)
      },
      { rootMargin: '-40% 0px -50% 0px', threshold: [0, 0.25, 0.5, 0.75, 1] }
    )
    sections.forEach((section) => observer.observe(section))
  }

  function closeMenu() {
    menuButton.classList.remove('open')
    menuButton.setAttribute('aria-expanded', 'false')
    mobileNav.hidden = true
  }

  function toggleMenu() {
    const isOpen = menuButton.classList.toggle('open')
    menuButton.setAttribute('aria-expanded', String(isOpen))
    mobileNav.hidden = !isOpen
  }

  menuButton.addEventListener('click', toggleMenu)
  mobileNav.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', closeMenu)
  })

  showAllBtn.addEventListener('click', () => {
    document.querySelectorAll('.project-card.extra').forEach((card) => {
      card.hidden = false
    })
    showAllBtn.parentElement.hidden = true
  })
})
