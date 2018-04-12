<template>
  <div id="the-float-layer">
    <div
      v-show="dragging"
      :style="{ 'z-index': 101 }"
      class="drag-background"
    />
    <VueDraggableResizable
      v-for="({ login }) of Player.bootedChannel"
      v-if="Player.active[login]"
      :key="login"
      :active="active[login]"
      :minh="270"
      :minw="480"
      :draggable="true"
      :resizable="true"
      :w="480"
      :h="270"
      :z="100 - (active[login] ? -1 : Player.order.indexOf(login))"
      :style="[opacity(login)]"
      drag-handle=".drag-handler"
      @deactivated="drag(login, false)"
    >
      <div
        class="drag-wrapper"
        @click="drag(login, true)"
      />
      <Player
        :channel="login"
        class="float-player"
      />
      <div
        v-show="active[login]"
        class="drag-handler"
      />
    </VueDraggableResizable>
  </div>
</template>

<style lang="postcss">
#the-float-layer {
  z-index: 100;
  & .handle {
    z-index: 101;
  }
  & .float-player,
  & .drag-handler,
  & .drag-wrapper {
    height: 100%;
    width: 100%;
    position: absolute;
  }
  & .drag-background {
    background: rgba(0,0,0,0.5);
    height: 100%;
    width: 100%;
    top: 0;
    left: 0;
    position: fixed;
  }
  & .drag-wrapper {
    left: -5px;
    top: -5px;
    background: black;
    border: 5px solid rgba(180,180,180,0.55);
    border-radius: 5px;
    box-sizing: content-box;
  }
}
</style>

<script>
import { mapState } from 'vuex'
import VueDraggableResizable from 'vue-draggable-resizable'
import Player from './Player'

export default {
  name: 'TheFloatLayer',
  components: {
    Player,
    VueDraggableResizable
  },
  data () {
    return {
      active: {},
      dragging: false
    }
  },
  computed: {
    ...mapState([
      'Player'
    ])
  },
  methods: {
    drag (login, bool) {
      this.$set(this.active, login, bool)
      this.dragging = bool
    },
    opacity (login) {
      return { opacity: this.active[login] ? 100 : this.Player.opacity[login] }
    }
  }
}
</script>
