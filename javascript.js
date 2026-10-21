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

  const contactForm = document.getElementById('contactForm')
  const formStatus = document.getElementById('formStatus')
  const submitBtn = contactForm.querySelector('.form-submit')
  const submitLabel = contactForm.querySelector('.form-submit-label')
  const phoneInput = document.getElementById('cf-telefone')

  phoneInput.addEventListener('input', () => {
    const digits = phoneInput.value.replace(/\D/g, '').slice(0, 11)
    let masked = digits
    if (digits.length > 2) masked = `(${digits.slice(0, 2)}) ${digits.slice(2)}`
    if (digits.length > 6) {
      const split = digits.length === 11 ? 7 : 6
      masked = `(${digits.slice(0, 2)}) ${digits.slice(2, split)}-${digits.slice(split)}`
    }
    phoneInput.value = masked
  })

  const validators = {
    'cf-nome': (value) => (value.trim().length >= 2 ? '' : 'Informe seu nome.'),
    'cf-telefone': (value) => {
      const digits = value.replace(/\D/g, '')
      return digits.length >= 10 ? '' : 'Informe um telefone com DDD.'
    },
    'cf-email': (value) => (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim()) ? '' : 'Informe um e-mail válido.'),
    'cf-mensagem': (value) => (value.trim().length >= 10 ? '' : 'Escreva sua pergunta (mínimo 10 caracteres).'),
  }

  function validateField(id) {
    const input = document.getElementById(id)
    const message = validators[id](input.value)
    input.classList.toggle('invalid', Boolean(message))
    input.setAttribute('aria-invalid', String(Boolean(message)))
    contactForm.querySelector(`[data-error-for="${id}"]`).textContent = message
    return !message
  }

  Object.keys(validators).forEach((id) => {
    const input = document.getElementById(id)
    input.addEventListener('blur', () => {
      if (input.value) validateField(id)
    })
    input.addEventListener('input', () => {
      if (input.classList.contains('invalid')) validateField(id)
    })
  })

  function setStatus(type, text, link) {
    formStatus.className = `form-status ${type}`
    formStatus.textContent = text
    if (link) {
      const a = document.createElement('a')
      a.href = link.href
      a.target = '_blank'
      a.rel = 'noreferrer'
      a.textContent = link.label
      formStatus.append(a, '.')
    }
  }

  contactForm.addEventListener('submit', async (event) => {
    event.preventDefault()

    const results = Object.keys(validators).map(validateField)
    if (results.includes(false)) {
      const firstInvalid = contactForm.querySelector('.form-input.invalid')
      if (firstInvalid) firstInvalid.focus()
      return
    }

    const data = Object.fromEntries(new FormData(contactForm))
    if (data._honey) return

    submitBtn.disabled = true
    submitLabel.textContent = 'Enviando...'
    setStatus('', '')

    try {
      const response = await fetch(contactForm.action.replace('formsubmit.co/', 'formsubmit.co/ajax/'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({
          ...data,
          _subject: `Nova pergunta pelo site (${data.assunto}) — ${data.nome.trim()}`,
          _replyto: data.email.trim(),
          _template: 'table',
          _captcha: 'false',
        }),
      })
      const result = await response.json().catch(() => ({}))
      if (!response.ok || String(result.success) === 'false') throw new Error(result.message || 'Falha no envio')

      contactForm.reset()
      setStatus('success', `Pergunta enviada! Obrigado, ${data.nome.trim().split(' ')[0]} — vou responder em breve.`)
    } catch (error) {
      setStatus('error', 'Não foi possível enviar agora. Tente novamente ou fale comigo pelo ', {
        href: 'https://wa.me/5511946005739',
        label: 'WhatsApp',
      })
    } finally {
      submitBtn.disabled = false
      submitLabel.textContent = 'Enviar pergunta'
    }
  })
})
