<template>
  <FLDefaultLayout items="start">
    <template #header>
      <header class="flex items-center justify-between p-2 border-b border-gray-700 text-gray-500">
        <h1 class="text-2xl sm:text-4xl text-gray-200 font-black tracking-wider text-center">EDITOR</h1>
        <router-link to="/">
          <HomeIcon class="w-6 h-6" />
        </router-link>
      </header>
    </template>
    <template #content>
      <div class="grid gap-4 w-full">
        <div class="space-y-2">
          <label class="block space-y-1 w-full">
            <p>Puzzle:</p>
            <textarea type="text" class="w-full appearance-none block bg-transparent px-4 py-2 rounded border border-gray-500" v-model="search.isLike" rows="4" />
          </label>
          <p class="text-xs text-gray-500">Enter a series of words to transform into a fleurdle puzzle</p>
        </div>
      </div>
    </template>
  </FLDefaultLayout>
</template>

<script>
import words from '../assets/words.json'
import { computed } from '@vue/reactivity'
import FLDefaultLayout from '../components/FLDefaultLayout.vue'
import { HomeIcon } from '@heroicons/vue/outline'
export default {
  name: 'Explore',
  components: { FLDefaultLayout, HomeIcon },
  setup() {
    const state = {
      puzzleInput: '',
      puzzleOutput: computed(() => {
        return state.puzzleInput
          .toLowerCase()
          .normalize()
          .split(/\s+/)
          .map((word) => {
            const normalizedWord = word.replace(/[^a-zA-Z ]/g, '')
            if (words[normalizedWord.length].includes(normalizedWord)) {
              return { word: normalizedWord, isFleurdle: true }
            }
            return { word: normalizedWord, isFleurdle: false }
          })
      }),
    }
    return { search, matches }
  },
}
</script>