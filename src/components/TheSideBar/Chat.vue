<template>
  <iframe
    :src="`//www.twitch.tv/embed/${channel}/chat`"
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
  }
}
</script>
