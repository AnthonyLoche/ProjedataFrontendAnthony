import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import 'vuetify/styles'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import 'vue3-toastify/dist/index.css'


import App from './App.vue'
import router from './router'

import { aliases, mdi } from 'vuetify/iconsets/mdi'
import '@mdi/font/css/materialdesignicons.css'

const customLightTheme = {
  dark: false,
  colors: {
    primary: '#304EF2',
    secondary: '#0080FF',
    background: '#FFFFFF',
    surface: '#FFFFFF',
    success: '#4CAF50',
    warning: '#FFC107',
    error: '#FF5252',
    info: '#2196F3',
  }
}

const vuetify = createVuetify({
  components,
  directives,

  theme: {
    defaultTheme: 'customLightTheme',
    themes: {
      customLightTheme,
    },
  },

  icons: {
    defaultSet: 'mdi',
    aliases,
    sets: { mdi },
  },
})

const app = createApp(App)

app.use(createPinia())
app.use(router)
app.use(vuetify)

app.mount('#app')
