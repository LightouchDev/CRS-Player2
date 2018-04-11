<template>
  <v-app
    id="app"
    dark
  >
    <TheHeader/>
    <TheContent/>
    <TheSideBar/>
    <TheFloatLayer/>
    <TheToast/>
  </v-app>
</template>

<style lang="postcss">
html {
  background: black;
  overflow: hidden !important;
}
</style>

<script>
import { preset } from './utils'
import TheHeader from './components/TheHeader'
import TheContent from './components/TheContent'
import TheSideBar from './components/TheSideBar'
import TheToast from './components/TheToast'

export default {
  name: 'App',
  components: {
    TheHeader,
    TheContent,
    TheSideBar,
    TheFloatLayer: () => import('./components/TheFloatLayer'),
    TheToast
  },
  mounted () {
    if (Object.keys(preset).length) {
      this.$store.dispatch('View/FetchInfo')
    }
  }
}
</script>
