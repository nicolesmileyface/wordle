<template>
  <FLGame mode="daily" ref="game">
    <template #modal-won>
      <p>you won!! 🏆</p>
      <pre>{{ emojis }}</pre>
      <div v-if="streak" class="py-2">
        <p class="text-gray-200 text-sm">
          current streak: <span class="font-semibold pl-1" :class="{ 'text-teal-400': streak.current === streak.longest, 'text-red-500': streak.current == 0, 'text-yellow-400': streak.current !== streak.longest && streak.current > 0 }">{{ streak.current }} days</span>
        </p>
        <p class="text-gray-200 text-sm">
          longest streak: <span class="text-teal-400 font-semibold pl-1">{{ streak.longest }} days</span>
        </p>
      </div>
      <button class="w-full border-2 border-teal-700 bg-teal-700 px-2 py-2 rounded shadow flex items-center justify-between" @click.stop="share" v-if="shareIcon">
        <ShareIcon class="w-4 h-4" />
        <p>share results</p>
        <div class="w-4 opacity-0 select-none"></div>
      </button>
      <button class="w-full border-2 border-teal-700 bg-teal-700 px-2 py-2 rounded shadow flex items-center justify-between" @click.stop="share" v-else>
        <ClipboardCopyIcon class="w-4 h-4" />
        <p>copy results</p>
        <div class="w-4 opacity-0 select-none"></div>
      </button>
      <router-link tag="button" class="block w-full border-2 border-teal-700 px-2 py-2 rounded shadow" to="/freeplay">freeplay</router-link>
    </template>
    <template #modal-lost>
      <p>you lost 😥</p>
      <p v-if="game && game.state">
        word was: <span class="font-semibold">{{ game.state.word }}</span>
      </p>
      <pre>{{ emojis }}</pre>
      <div v-if="streak" class="py-2">
        <p class="text-gray-200 text-sm">
          current streak: <span class="font-semibold pl-1" :class="{ 'text-teal-400': streak.current === streak.longest, 'text-red-500': streak.current == 0, 'text-yellow-400': streak.current !== streak.longest && streak.current > 0 }">{{ streak.current }} days</span>
        </p>
        <p class="text-gray-200 text-sm">
          longest streak: <span class="text-teal-400 font-semibold pl-1">{{ streak.longest }} days</span>
        </p>
      </div>
      <button class="w-full border-2 border-teal-700 bg-teal-700 px-2 py-2 rounded shadow flex items-center justify-between" @click.stop="share" v-if="shareIcon">
        <ShareIcon class="w-4 h-4" />
        <p>share results</p>
        <div class="w-4 opacity-0 select-none"></div>
      </button>
      <button class="w-full border-2 border-teal-700 bg-teal-700 px-2 py-2 rounded shadow flex items-center justify-between" @click.stop="share" v-else>
        <ClipboardCopyIcon class="w-4 h-4" />
        <p>copy results</p>
        <div class="w-4 opacity-0 select-none"></div>
      </button>
      <router-link tag="button" class="block w-full border-2 border-teal-700 px-2 py-2 rounded shadow" to="/freeplay">freeplay</router-link>
    </template>
  </FLGame>
  <textarea name="template" id="" class="sr-only whitespace-pre-wrap" aria-hidden ref="clipboardEl" :value="clipboard" />
</template>

<script>
import FLGame from '../components/FLGame.vue'
import { ShareIcon, ClipboardCopyIcon } from '@heroicons/vue/outline'
import { computed, onMounted, ref } from 'vue'
export default {
  name: 'App',
  components: { FLGame, ShareIcon, ClipboardCopyIcon },
  setup() {
    const game = ref(null)
    const clipboardEl = ref(null)
    const shareIcon = ref(false)

    const share = () => {
      if (navigator && navigator.share) {
        navigator
          .share({
            text: clipboard.value,
          })
          .then(() => {
            console.log('Thanks for sharing!')
          })
          .catch(console.error)
      } else {
        clipboardEl.value.select()
        document.execCommand('copy')
      }
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

    const streak = computed(() => {
      if (!game.value) return
      const res = game.value.getStreak()
      return res
    })

    const newGame = () => {
      console.log({ game: game.value })
      game.value.newGame()
    }

    onMounted(() => {
      if (navigator.share) {
        shareIcon.value = true
      }
    })

    return { game, newGame, emojis, clipboard, share, clipboardEl, shareIcon, streak }
  },
}
</script>
