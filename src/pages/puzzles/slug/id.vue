<template>
  <FLGame mode="puzzle" ref="game" :key="$route.fullPath">
    <template #header>
      <header class="flex items-center justify-between p-2 border-b border-gray-700 text-gray-500">
        <router-link :to="urlJoin('/puzzles', $route.params.slug)">
          <ChevronLeftIcon class="w-6 h-6" />
        </router-link>
        <button @click="help">
          <QuestionMarkCircleIcon class="w-6 h-6" />
        </button>
        <h1 class="text-2xl sm:text-4xl text-gray-200 font-black tracking-wider text-center">{{ title }}</h1>
        <div class="w-6"></div>
        <router-link to="/">
          <HomeIcon class="w-6 h-6" />
        </router-link>
      </header>
    </template>
    <template #modal-won>
      <p>you got it!! 🏆</p>
      <pre>{{ emojis }}</pre>
      <div class="flex space-x-2">
        <router-link tag="button" class="block w-full border-2 border-teal-700 px-2 py-2 rounded shadow" :to="urlJoin('/puzzles', $route.params.slug)">back</router-link>
        <router-link v-if="next > -1" tag="button" class="block w-full border-2 border-teal-700 bg-teal-700 px-2 py-2 rounded shadow" :to="urlJoin('/puzzles', $route.params.slug, '' + next)">next</router-link>
      </div>
    </template>
    <template #modal-lost>
      <p>you lost 😥</p>
      <p v-if="game && game.state">
        word was: <span class="font-semibold">{{ game.state.word }}</span>
      </p>
      <pre>{{ emojis }}</pre>
      <div class="flex space-x-2">
        <router-link tag="button" class="block w-full border-2 border-teal-700 px-2 py-2 rounded shadow" :to="urlJoin('/puzzles', $route.params.slug)">back</router-link>
        <router-link v-if="next > -1" tag="button" class="block w-full border-2 border-teal-700 bg-teal-700 px-2 py-2 rounded shadow" :to="urlJoin('/puzzles', $route.params.slug, '' + next)">next</router-link>
      </div>
    </template>
  </FLGame>
  <textarea name="template" id="" class="sr-only whitespace-pre-wrap" aria-hidden ref="clipboardEl" :value="clipboard" />
</template>

<script>
import { QuestionMarkCircleIcon, ChevronLeftIcon, HomeIcon } from '@heroicons/vue/outline'

import urlJoin from 'url-join'
import FLGame from '../../../components/FLGame.vue'
import { computed, onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
export default {
  name: 'PuzzleSlugID',
  components: { FLGame, QuestionMarkCircleIcon, ChevronLeftIcon, HomeIcon },
  setup() {
    const route = useRoute()
    const router = useRouter()
    const game = ref(null)
    const title = ref('PUZZLE')

    const next = computed(() => {
      const progress = JSON.parse(localStorage.getItem(`puzzle-${route.params.slug}`))
      if (!progress.length) {
        router.push(urlJoin('puzzles', route.params.slug))
      }
      return progress.findIndex((a, i) => a.isFleurdle && !a.solved && i !== route.params.id)
    })

    const emojis = computed(() => {
      if (game.value) {
        return game.value.toEmojis()
      }
      return ''
    })

    const load = async () => {
      try {
        const data = await fetch(window.location.origin + '/.netlify/functions/fleurdle-puzzle/api/puzzles/' + route.params.slug, {
          headers: { 'Content-Type': 'application/json' },
        }).then((response) => response.json())
        if (data.title) {
          title.value = data.title
        } else {
          title.value = data.slug
        }
      } catch (error) {
        console.log(error)
      }
    }

    const help = () => {
      if (!game.value) {
        return
      }
      game.value.state.modals.help = true
    }

    onMounted(() => {
      load()
    })

    return { game, next, emojis, urlJoin, title, help }
  },
}
</script>
