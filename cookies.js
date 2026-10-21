// Aviso informativo de cookies. O site não usa cookies de rastreamento,
// então não há consentimento a coletar — só informar e lembrar que foi visto.
document.addEventListener('DOMContentLoaded', () => {
  const STORAGE_KEY = 'thelaflow-cookie-notice'

  function wasDismissed() {
    try {
      return localStorage.getItem(STORAGE_KEY) === 'ok'
    } catch {
      return false
    }
  }

  function rememberDismiss() {
    try {
      localStorage.setItem(STORAGE_KEY, 'ok')
    } catch {
      // Armazenamento bloqueado: o aviso volta a aparecer na próxima visita.
    }
  }

  if (wasDismissed()) return

  const notice = document.createElement('div')
  notice.className = 'cookie-notice'
  notice.setAttribute('role', 'region')
  notice.setAttribute('aria-label', 'Aviso de cookies')
  notice.innerHTML = `
    <p><strong>Sem cookies de rastreamento.</strong> Este site não usa cookies de publicidade nem de análise.
    Só guardo no seu navegador que você já viu este aviso.</p>
    <div class="cookie-notice-actions">
      <button type="button" class="btn btn-primary">Entendi</button>
      <a href="/politica-de-cookies.html">Saiba mais</a>
    </div>
  `

  notice.querySelector('button').addEventListener('click', () => {
    rememberDismiss()
    notice.remove()
  })

  document.body.append(notice)
})
