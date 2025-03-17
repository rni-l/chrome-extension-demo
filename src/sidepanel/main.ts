import { createApp } from 'vue'
import { initSPMsgListener, initSidePanel } from 'chrome-extension-tools'
import App from './Sidepanel.vue'
import { setupApp } from '~/logic/common-setup'
import '../styles'

initSPMsgListener()
initSidePanel()
const app = createApp(App)
setupApp(app)
app.mount('#app')
