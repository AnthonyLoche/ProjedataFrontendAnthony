import { toast } from 'vue3-toastify'

function showMessage (message, type, time, position, theme, bar) {
  toast(message, {
    theme: theme || 'auto',
    type: type || 'default',
    position: position || 'top-right',
    pauseOnFocusLoss: false,
    autoClose: time,
    hideProgressBar: bar || false,
    dangerouslyHTMLString: true,
  })
}

export { showMessage }
