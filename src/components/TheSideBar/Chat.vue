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
    src () {
      return `//www.twitch.tv/embed/${this.channel}/chat`
    }
  }
}
</script>
