// Styles
import '@mdi/font/css/materialdesignicons.css'
import 'vuetify/styles'

// Vuetify
import { createVuetify } from 'vuetify'
import headSvg from '/icon-champion.svg'

import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'

const myCustomDarkTheme = {
  dark: true,
  colors: {
    primary: '#5383E8',
    secondary: '#28344E',
    subcontent: '#31313C'
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
    components,
    directives,
    theme: {
      defaultTheme: 'myCustomDarkTheme',
      themes: {
        myCustomDarkTheme,               
      },          
      dark: {
        primary: '#5383E8',
      }
    },
    icons: {
      values: {
        customIconSvg: headSvg,
        customIconSvgPath: 'M21.189 12.252c0-2.132.838-12.188-9.146-12.249L11.955 0C1.971.064 2.81 10.12 2.81 12.252c0 2.139.356 4.232-.401 4.812-.757.58-.49 1.425 1.024 3.296 1.514 1.871 4.233 2.94 4.233 2.94v-9.536c-.495-.163-.979-.456-1.392-.88-1.14-1.175-1.296-2.872-.346-3.793.945-.922 2.572-.647 3.78.456.48.439.814 1.107.965 1.624.209.655.234 1.354.234 2.206 0 1.437.016 3.463.016 3.463 0 1.305 2.152 1.305 2.152 0 0 0 .017-2.026.017-3.463 0-.852.024-1.551.234-2.206.15-.517.484-1.185.964-1.624 1.208-1.103 2.835-1.378 3.781-.456.95.921.793 2.618-.346 3.793-.413.424-.897.717-1.393.88v9.537s2.72-1.07 4.234-2.94c1.514-1.872 1.78-2.718 1.024-3.297-.757-.58-.401-2.673-.401-4.812z" transform="translate(-2164.000000, -891.000000) translate(2164.000000, 891.000000)'
      }
    }
  }
)
