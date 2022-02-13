<template>
  <FLDefaultLayout items="start">
    <template #header>
      <header class="flex items-center justify-between p-2 border-b border-gray-700 text-gray-500">
        <h1 class="text-2xl sm:text-4xl text-gray-200 font-black tracking-wider text-center">EXPLORE</h1>
        <router-link to="/">
          <HomeIcon class="w-6 h-6" />
        </router-link>
      </header>
    </template>
    <template #content>
      <div class="grid gap-4 w-full">
        <label class="block space-y-1 text-left">
          <p>Number of Letters</p>
          <select v-model="search.numLetters" class="appearance-none w-full px-2 py-2 rounded border border-gray-500 bg-transparent text-white">
            <option :value="i" v-for="i in [2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15]" :key="i">{{ i }}</option>
          </select>
        </label>
        <label class="block space-y-1 w-full">
          <p>Search Term</p>
          <input type="text" class="w-full appearance-none block bg-transparent px-4 py-2 rounded border border-gray-500" v-model="search.term" />
        </label>
        <label class="block space-y-1 w-full">
          <p>Not Allowed</p>
          <input type="text" class="w-full appearance-none block bg-transparent px-4 py-2 rounded border border-gray-500" v-model="search.notAllowed" />
        </label>
        <div class="space-y-2">
          <label class="block space-y-1 w-full">
            <p>Word Like:</p>
            <input type="text" class="w-full appearance-none block bg-transparent px-4 py-2 rounded border border-gray-500" v-model="search.isLike" />
          </label>
          <p class="text-xs text-gray-500">Enter a word with periods representing unknown letters</p>
        </div>
        <div class="space-y-2">
          <label class="block space-y-1 w-full">
            <p>Word Has:</p>
            <input type="text" class="w-full appearance-none block bg-transparent px-4 py-2 rounded border border-gray-500" v-model="search.has" />
          </label>
          <p class="text-xs text-gray-500">Enter a letters in word with unknown position</p>
        </div>
        <div class="grid grid-cols-3 gap-2">
          <div v-for="match in matches" :key="match.word" class="bg-gray-700 p-1 rounded">
            <p>
              {{ match.word }}
            </p>
            <p class="text-xs text-gray-500">score: {{ match.score }}</p>
          </div>
        </div>
      </div>
    </template>
  </FLDefaultLayout>
</template>

<script>
import levenshtein from 'fast-levenshtein'
import words from '../assets/words.json'
import { computed, reactive } from '@vue/reactivity'
import FLDefaultLayout from '../components/FLDefaultLayout.vue'
import Slider from '../components/basic/Slider.vue'
import { HomeIcon } from '@heroicons/vue/outline'
export default {
  name: 'Explore',
  components: { FLDefaultLayout, Slider, HomeIcon },
  setup() {
    const sortedWords = Object.fromEntries(Object.entries(words).map(([numLetters, words]) => [numLetters, words.sort((a, b) => a.localeCompare(b))]))
    // sort out blacklist
    const search = reactive({
      term: '',
      numLetters: 5,
      notAllowed: '',
      isLike: '',
      has: '',
    })
    const aboveLetterTolerance = (letter, word) => {
      const inWord = word
        .split('')
        .map((a) => a === letter)
        .filter((a) => !!a)
      const inSearchTerm = search.term
        .split('')
        .map((a) => a === letter)
        .filter((a) => !!a)
      return inWord > inSearchTerm
    }

    const matches = computed(() => {
      const notAllowed = search.notAllowed
        .toLowerCase()
        .split('')
        .filter((e) => !!e)
      const knownIndices = search.isLike
        .split('')
        .map((letter, index) => (letter !== '.' ? { letter, index } : null))
        .filter((a) => a !== null)
      const has = search.has.split('')
      return sortedWords[search.numLetters]
        .map((word) => {
          const score = levenshtein.get(word, search.term)
          if (notAllowed.some((letter) => aboveLetterTolerance(letter, word))) {
            return null
          }
          if (has.some((letter) => !word.includes(letter))) {
            return null
          }
          if (knownIndices.length > 0 && knownIndices.filter(({ letter, index }) => word.charAt(index) === letter).length < knownIndices.length) {
            return null
          }
          return { score, word }
        })
        .filter((a) => a !== null)
        .sort((a, b) => a.score - b.score)
    })
    return { search, matches }
  },
}
</script>
