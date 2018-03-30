<template>
  <iframe
    :src="src"
    frameborder="0"
    scrolling="no"
    height="100%"
    width="340px"
  />
</template>

<script>
import { mapState } from 'vuex'

export default {
  name: 'Chat',
  props: {
    channel: {
      default: '',
      type: String,
      required: true
    }
  },
  computed: {
    ...mapState({
      View: 'View'
    }),
    src () {
      return `http://www.twitch.tv/${this.channel}/chat`
    }
  }
}
</script>
