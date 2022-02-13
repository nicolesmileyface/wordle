<template>
  <FLDefaultLayout items="start">
    <template #header>
      <header class="flex items-center justify-between p-2 border-b border-gray-700 text-gray-500">
        <router-link to="/">
          <HomeIcon class="w-6 h-6" />
        </router-link>
        <h1 class="text-2xl sm:text-4xl text-gray-200 font-black tracking-wider text-center">Puzzles</h1>
        <router-link to="/puzzles/editor">
          <PencilAltIcon class="w-6 h-6" />
        </router-link>
      </header>
    </template>
    <template #content>
      <div class="grid gap-16 w-full py-6">
        <div class="space-y-4" v-if="state.inProgress.length">
          <h3 class="text-2xl font-medium">In Progress</h3>
          <div class="grid grid-cols-2 gap-4">
            <router-link :to="urlJoin('/puzzles', puzzle.slug)" class="p-2 rounded bg-gray-800 border-2 border-gray-700 space-y-2 hover:border-teal-500 transition duration-200" v-for="(puzzle, i) of state.inProgress" :key="['in-progress', i].join()">
              <p class="text-lg">{{ puzzle.title || puzzle.slug }}</p>
              <p v-if="puzzle.description" class="text-sm">{{ puzzle.description }}</p>
              <p v-if="puzzle.author" class="text-sm">- {{ puzzle.author }}</p>
            </router-link>
          </div>
        </div>
        <div class="space-y-4" v-if="state.completed.length">
          <h3 class="text-2xl font-medium">Completed</h3>
          <div class="grid grid-cols-2 gap-4">
            <router-link :to="urlJoin('/puzzles', puzzle.slug)" class="p-2 rounded bg-blue-800 border-2 border-gray-700 space-y-2 hover:border-teal-500 transition duration-200" v-for="(puzzle, i) of state.completed" :key="['completed', i].join()">
              <p class="text-lg">{{ puzzle.title || puzzle.slug }}</p>
              <p v-if="puzzle.description" class="text-sm">{{ puzzle.description }}</p>
              <p v-if="puzzle.author" class="text-sm">- {{ puzzle.author }}</p>
            </router-link>
          </div>
        </div>
        <div class="space-y-4" v-if="state.notStarted.length">
          <h3 class="text-2xl font-medium">Not Started</h3>
          <div class="grid grid-cols-2 gap-4">
            <router-link :to="urlJoin('/puzzles', puzzle.slug)" class="p-2 rounded bg-gray-800 border-2 border-gray-700 space-y-2 hover:border-teal-500 transition duration-200" v-for="(puzzle, i) of state.notStarted" :key="['not-started', i].join()">
              <p class="text-lg">{{ puzzle.title || puzzle.slug }}</p>
              <p v-if="puzzle.description" class="text-sm">{{ puzzle.description }}</p>
              <p v-if="puzzle.author" class="text-sm">- {{ puzzle.author }}</p>
            </router-link>
          </div>
        </div>
      </div>
    </template>
  </FLDefaultLayout>
  <textarea name="template" id="" class="sr-only whitespace-pre-wrap" aria-hidden ref="clipboardEl" :value="state.url" />
</template>

<script>
import urlJoin from 'url-join'
import { reactive } from '@vue/reactivity'
import FLDefaultLayout from '../../components/FLDefaultLayout.vue'
import { HomeIcon, ShareIcon, ChevronLeftIcon, PencilAltIcon } from '@heroicons/vue/outline'
import { onMounted } from '@vue/runtime-core'
import { useRoute } from 'vue-router'
export default {
  name: 'Puzzles',
  components: { FLDefaultLayout, HomeIcon, ShareIcon, ChevronLeftIcon, PencilAltIcon },
  setup() {
    const route = useRoute()
    const state = reactive({
      inProgress: [],
      notStarted: [],
      completed: [],
      loading: false,
      title: 'PUZZLE',
    })

    const load = async () => {
      try {
        const data = (
          await fetch(window.location.origin + '/.netlify/functions/fleurdle-puzzle/api/puzzles', {
            headers: { 'Content-Type': 'application/json' },
          }).then((response) => response.json())
        ).map((a) => {
          const res = {
            title: a.title,
            description: a.description,
            slug: a.slug,
            author: a.author,
          }
          const progress = localStorage.getItem(`puzzle-${a.slug}`)
          if (progress) {
            const nextIndex = JSON.parse(progress).findIndex((a) => a.isFleurdle && !a.solved)
            res.progress = nextIndex > -1 ? 0 : 1
          } else {
            res.progress = -1
          }
          return res
        })
        state.notStarted = data.filter((a) => a.progress === -1)
        state.inProgress = data.filter((a) => a.progress === 0)
        state.completed = data.filter((a) => a.progress === 1)
      } catch (error) {
        console.log(error)
      }
    }

    onMounted(() => {
      load()
    })

    return { state, urlJoin }
  },
}
</script>