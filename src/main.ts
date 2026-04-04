import naive from 'naive-ui'
import { createPinia } from 'pinia'
import { createApp } from 'vue'

import App from './App.vue'
import router from './router.js'

const app = createApp(App)

app.use(createPinia())
app.use(router)
app.use(naive)

// Pre-fetch Pokemon cards on app start
import { usePokemonStore } from './store/pokemon.store'
usePokemonStore().fetchPokemons()

app.mount('#app')
