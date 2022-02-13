<template>
  <FLDefaultLayout items="start">
    <template #header>
      <header class="flex items-center justify-between p-2 border-b border-gray-700 text-gray-500">
        <router-link to="/puzzles">
          <ChevronLeftIcon class="w-6 h-6" />
        </router-link>
        <h1 class="text-2xl sm:text-4xl text-gray-200 font-black tracking-wider text-center">{{ state.title }}</h1>
        <router-link to="/">
          <HomeIcon class="w-6 h-6" />
        </router-link>
      </header>
    </template>
    <template #content>
      <div class="grid gap-16 w-full py-6">
        <p v-if="next === null" class="px-2 py-2 text-xl bg-gradient-to-br from-blue-600 to-blue-900 rounded shadow">completed 🏆🏆🏆</p>
        <div class="flex flex-wrap gap-6">
          <div v-for="(word, index) of state.puzzle" :key="[word, index].join()">
            <router-link :to="urlJoin('/', $route.path, '' + index)" v-if="word.isFleurdle && !word.solved" class="flex flex-wrap gap-[0.125rem] focus:outline-none focus:ring hover:bg-blue-800 transition duration-300 rounded">
              <div class="square w-8 border border-gray-700 rounded font-black text-white flex items-center justify-center" v-for="(letter, j) of word.word" :key="[letter, j].join()"></div>
            </router-link>
            <button v-else-if="word.isFleurdle && word.solved" class="flex flex-wrap gap-[0.125rem] focus:outline-none focus:ring hover:bg-blue-800 transition duration-300 rounded">
              <div :class="{ 'bg-teal-700': !word.lost, 'bg-orange-700': word.lost }" class="square w-8 border border-gray-700 rounded font-black text-white flex items-center justify-center" v-for="(letter, j) of word.word" :key="[letter, j].join()">{{ letter }}</div>
            </button>
            <p v-else class="text-xl">{{ word.word }}</p>
          </div>
        </div>
        <div class="space-y-4">
          <router-link v-if="next !== null" tag="button" :to="next" class="w-full bg-teal-700 border-2 border-teal-700 px-2 py-2 rounded shadow flex items-center space-x-2 text-white justify-between">
            <p>next fleurdle</p>
          </router-link>
          <button class="w-full text-teal-500 border-2 border-teal-700 px-2 py-2 rounded flex items-center space-x-2 justify-between" @click="reset">
            <p>reset puzzle</p>
          </button>
        </div>
        <div v-if="state.description || state.author" class="p-4 border-l-4 border-gray-500 space-y-4 rounded bg-gray-800">
          <p class="text-lg" v-if="state.description">{{ state.description }}</p>
          <p class="text-lg" v-if="state.author">- {{ state.author }}</p>
        </div>
      </div>
    </template>
  </FLDefaultLayout>
  <textarea name="template" id="" class="sr-only whitespace-pre-wrap" aria-hidden ref="clipboardEl" :value="state.url" />
</template>

<script>
import urlJoin from 'url-join'
import { computed, reactive, ref } from '@vue/reactivity'
import FLDefaultLayout from '../../components/FLDefaultLayout.vue'
import { HomeIcon, ShareIcon, ChevronLeftIcon } from '@heroicons/vue/outline'
import { onMounted } from '@vue/runtime-core'
import { useRoute } from 'vue-router'
export default {
  name: 'PuzzleSlug',
  components: { FLDefaultLayout, HomeIcon, ShareIcon, ChevronLeftIcon },
  setup() {
    const route = useRoute()
    const state = reactive({
      puzzle: [],
      _puzzle: [],
      loading: false,
      title: 'PUZZLE',
      description: '',
      author: '',
    })

    const load = async () => {
      try {
        const data = await fetch(window.location.origin + '/.netlify/functions/fleurdle-puzzle/api/puzzles/' + route.params.slug, {
          headers: { 'Content-Type': 'application/json' },
        }).then((response) => response.json())
        if (data.title) {
          state.title = data.title
        }
        if (data.description) {
          state.description = data.description
        }
        if (data.author) {
          state.author = data.author
        }
        state._puzzle = data.puzzle.map((entry) => ({ ...entry, solved: false }))
        const progress = localStorage.getItem(`puzzle-${route.params.slug}`)
        if (!progress) {
          state.puzzle = data.puzzle.map((entry) => ({ ...entry, solved: false }))
          localStorage.setItem(`puzzle-${route.params.slug}`, JSON.stringify(state.puzzle))
        } else {
          state.puzzle = JSON.parse(progress)
          state.puzzle = state.puzzle.map((entry, i) => {
            entry.lost = false
            const individualProgressStr = localStorage.getItem(`game-state-puzzle-${route.params.slug}-${i}`)
            if (individualProgressStr) {
              entry.lost = JSON.parse(individualProgressStr)?.results?.solved === -1
            }
            return entry
          })
        }
      } catch (error) {
        console.log(error)
      }
    }

    const next = computed(() => {
      if (!state.puzzle.length) {
        return route.path
      }
      const nextIndex = state.puzzle.findIndex((a) => a.isFleurdle && !a.solved)
      if (nextIndex > -1) {
        return urlJoin(route.path, '' + nextIndex)
      }
      return null
    })

    const reset = () => {
      localStorage.setItem(`puzzle-${route.params.slug}`, JSON.stringify(state._puzzle))
      state._puzzle.forEach((_, i) => {
        localStorage.removeItem(`game-state-puzzle-${route.params.slug}-${i}`)
      })
      state.puzzle = JSON.parse(JSON.stringify(state._puzzle))
    }

    onMounted(() => {
      load()
    })

    return { state, next, urlJoin, reset }
  },
}
</script>
