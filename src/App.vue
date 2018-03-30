<template>
  <v-app
    id="app"
    dark
  >
    <TheHeader/>
    <TheContent/>
    <TheSideBar/>
  </v-app>
</template>

<style lang="postcss">
html {
  background: black;
  overflow: hidden !important;
}
</style>

<script>
import TheHeader from './components/TheHeader'
import TheContent from './components/TheContent'
import TheSideBar from './components/TheSideBar'

export default {
  name: 'App',
  components: {
    TheHeader,
    TheContent,
    TheSideBar
  },
  mounted () {
    if (Object.keys(this.$store.state.Config).length) {
      this.$store.dispatch('View/FetchInfo')
    }
  }
}
</script>
