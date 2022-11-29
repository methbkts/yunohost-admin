import Vue, { createApp } from 'vue'
import App from './App.vue'
import BootstrapVue from 'bootstrap-vue'
import VueShowdown from 'vue-showdown'

import store from './store'
import router from './router'
import i18n from './i18n'

import { registerGlobalErrorHandlers } from './api'
import { initDefaultLocales } from './i18n/helpers'


const app = createApp(App)

app.use(store)
// Styles are imported in `src/App.vue` <style>
app.use(BootstrapVue, {
  BSkeleton: { animation: 'none' },
  BAlert: { show: true },
  BBadge: { pill: true }
})

app.use(VueShowdown, {
  options: {
    emoji: true
  }
})

// Ugly wrapper for `$bvModal.msgBoxConfirm` to set default i18n button titles
// FIXME find or wait for a better way
app.config.globalProperties.$askConfirmation = function (message, props) {
  return this.$bvModal.msgBoxConfirm(message, {
    okTitle: this.$i18n.t('ok'),
    cancelTitle: this.$i18n.t('cancel'),
    bodyBgVariant: 'warning',
    centered: true,
    bodyClass: ['font-weight-bold', 'rounded-top', store.state.theme ? 'text-white' : 'text-black'],
    ...props
  })
}


// Register global components
const requireComponent = require.context('@/components/globals', true, /\.(js|vue)$/i)
// For each matching file name...
requireComponent.keys().forEach((fileName) => {
  // Get the component
  const component = requireComponent(fileName).default
  // Globally register the component
  app.component(component.name, component)
})

registerGlobalErrorHandlers()

// Load default locales translations files and setup store data
initDefaultLocales().then(() => {
  app.mount('#app')
})
