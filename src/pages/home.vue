<template>
  <FLGame mode="daily" ref="game">
    <template #modal-won>
      <p>you won!! 🏆</p>
      <pre>{{ emojis }}</pre>
      <button class="w-full border-2 border-teal-700 bg-teal-700 px-2 py-2 rounded shadow" @click.stop="copy">copy results</button>
      <router-link tag="button" class="block w-full border-2 border-teal-700 px-2 py-2 rounded shadow" to="/freeplay">freeplay</router-link>
      <button class="w-full border-2 border-transparent text-teal-500 px-2 py-2" @click.stop="newGame">replay</button>
    </template>
    <template #modal-lost> </template>
  </FLGame>
  <textarea name="template" id="" class="sr-only whitespace-pre-wrap" aria-hidden ref="clipboardEl" :value="clipboard" />
</template>

<script>
import FLGame from '../components/FLGame.vue'
import { computed, ref } from 'vue'
export default {
  name: 'App',
  components: { FLGame },
  setup() {
    const game = ref(null)
    const clipboardEl = ref(null)
    const copy = () => {
      clipboardEl.value.select()
      document.execCommand('copy')
    }
    const emojis = computed(() => {
      if (game.value) {
        return game.value.toEmojis()
      }
      return ''
    })
    const clipboard = computed(() => {
      if (!game.value) return
      const now = new Date()
      const start = new Date(2022, 0, 0)
      const diff = Number(now) - Number(start)
      const day = Math.floor(diff / (1000 * 60 * 60 * 24))
      return ['fleurdle', `day ${day}, ${game.value.state.numLetters} letters`, emojis.value].join('\n')
    })
    const newGame = () => {
      console.log({ game: game.value })
      game.value.newGame()
    }
    return { game, newGame, emojis, clipboard, copy, clipboardEl }
  },
}
</script>