<template>
  <FLDefaultLayout items="start">
    <template #header>
      <header class="flex items-center justify-center p-2 border-b border-gray-700 text-gray-500">
        <h1 class="text-2xl sm:text-4xl text-gray-200 font-black tracking-wider text-center">EXPLORE</h1>
      </header>
    </template>
    <template #content>
      <div class="grid gap-4 w-full">
        <label class="block space-y-1 w-full">
          <p>Search Term</p>
          <input type="text" class="w-full appearance-none block bg-transparent px-4 py-2 rounded border border-gray-500" v-model="search.term" />
        </label>
        <label class="block space-y-1 w-full">
          <p>Number of Letters: {{ search.numLetters }}</p>
          <Slider :min="2" :max="15" :step="1" v-model="search.numLetters" />
        </label>
        <label class="block space-y-1 w-full">
          <p>Tolerance: {{ search.tolerance }}</p>
          <Slider :min="1" :max="search.numLetters" :step="1" v-model="search.tolerance" />
        </label>
        <div class="grid grid-cols-3 gap-2">
          <div v-for="match in matches" :key="match.word" class="bg-gray-700 p-1 rounded">
            {{ match }}
          </div>
        </div>
      </div>
    </template>
  </FLDefaultLayout>
</template>

<script>
import levenshtein from 'fast-levenshtein'
import words from '../assets/words/out'
import { computed, reactive } from '@vue/reactivity'
import FLDefaultLayout from '../components/FLDefaultLayout.vue'
import Slider from '../components/basic/Slider.vue'
export default {
  name: 'Explore',
  components: { FLDefaultLayout, Slider },
  setup() {
    // sort out blacklist
    const search = reactive({
      term: '',
      numLetters: 6,
      tolerance: 5,
    })
    const matches = computed(() =>
      words[search.numLetters]
        .map((word) => {
          const score = levenshtein.get(word, search.term)
          if (score > search.tolerance) {
            return null
          }
          return { score, word }
        })
        .filter((a) => a !== null)
        .sort((a, b) => a.score - b.score)
    )
    return { search, matches }
  },
}
</script>