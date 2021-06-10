import { createStore } from 'vuex'
import app from './modules/app'
import card from './modules/card'
import entery from './modules/entery'
export default createStore({
  modules: {
    app,
    card,
    entery
  }
})
