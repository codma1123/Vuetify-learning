// Styles
import '@mdi/font/css/materialdesignicons.css'
import 'vuetify/styles'

// Vuetify
import { createVuetify } from 'vuetify'

const myCustomDarkTheme = {
  dark: true,
  colors: {
    primary: '#5383E8',
    secondary: '#28344E'
  }
}

const myCustomLightTheme = {
  dark: false,
  colors: {
    primary: '#5383E8',
    secondary: '#28344E'
  }
}

export default createVuetify({
    theme: {
      defaultTheme: 'myCustomDarkTheme',
      themes: {
        myCustomDarkTheme,               
      },          
      dark: {
        primary: '#5383E8',
      }
    },
  }
)
