<template>
  <FLDefaultLayout items="start">
    <template #header>
      <header class="flex items-center justify-between p-2 border-b border-gray-700 text-gray-500">
        <router-link to="/puzzles">
          <ChevronLeftIcon class="w-6 h-6" />
        </router-link>
        <h1 class="text-2xl sm:text-4xl text-gray-200 font-black tracking-wider text-center">EDITOR</h1>
        <router-link to="/">
          <HomeIcon class="w-6 h-6" />
        </router-link>
      </header>
    </template>
    <template #content>
      <div class="grid gap-8 w-full">
        <div class="space-y-4">
          <div class="space-y-2">
            <label class="block space-y-1 w-full">
              <p>Fleurdle Input:</p>
              <textarea @keydown.enter.stop.prevent="createOutput" type="text" class="w-full appearance-none block bg-transparent px-4 py-2 rounded border border-gray-500 focus:outline-none focus:ring" v-model="state.puzzleInput" rows="4" />
            </label>
            <p class="text-xs text-gray-500">Enter a series of words to transform into a fleurdle puzzle</p>
          </div>
          <div class="space-y-2">
            <button class="w-full bg-teal-700 px-2 py-2 rounded shadow cursor-not-allowed opacity-40" v-if="outputMatches">Create Puzzle</button>
            <button class="w-full bg-teal-700 px-2 py-2 rounded shadow" @click="createOutput" v-else>Create Puzzle</button>
            <p class="text-xs text-gray-500">Creates the shell for a puzzle, you can then choose which words are fleurdles</p>
          </div>
        </div>
        <div class="w-full h-px bg-gray-600" v-if="state.puzzleOutput.length"></div>
        <div class="space-y-4" v-if="state.puzzleOutput.length">
          <p>Fleurdle Output:</p>
          <div class="flex flex-wrap gap-6">
            <div v-for="(word, index) of state.puzzleOutput" :key="[word, index].join()">
              <button
                v-if="word.isFleurdleElligible && word.isFleurdle"
                class="flex flex-wrap gap-[0.125rem] focus:outline-none focus:ring hover:bg-blue-800 transition duration-300 rounded"
                @click="
                  () => {
                    if (!state.slug) word.isFleurdle = !word.isFleurdle
                  }
                "
              >
                <div class="square w-8 border bg-teal-700 border-gray-700 rounded font-black text-white flex items-center justify-center" v-for="(letter, j) of word.word" :key="[letter, j].join()">{{ letter }}</div>
              </button>
              <button
                v-else-if="word.isFleurdleElligible"
                class="text-xl px-2 tracking-widest rounded font-semibold text-white border-2 border-teal-700 focus:outline-none focus:ring hover:bg-blue-800 transition duration-300"
                @click="
                  () => {
                    if (!state.slug) word.isFleurdle = !word.isFleurdle
                  }
                "
              >
                {{ word.word }}
              </button>
              <p v-else class="text-xl">{{ word.word }}</p>
            </div>
          </div>
          <p class="text-xs text-gray-500">Choose which words are fleurdles by clicking on the word buttons</p>
        </div>
        <div class="w-full h-px bg-gray-600" v-if="state.puzzleOutput.length"></div>
        <div class="space-y-4" v-if="state.puzzleOutput.length && !state.slug">
          <div class="space-y-2">
            <p>Fleurdle Properties:</p>
            <p class="text-xs text-gray-500">All properties are optional, if title is omitted a random title will be chosen</p>
          </div>
          <div class="space-y-2">
            <div class="flex space-x-4 items-center">
              <label class="block space-y-1 w-full">
                <p>title</p>
                <input type="text" class="w-full appearance-none block bg-transparent px-4 py-2 rounded border border-gray-500" v-model="state.title" />
              </label>
              <label class="block space-y-1 w-full">
                <p>author</p>
                <input type="text" class="w-full appearance-none block bg-transparent px-4 py-2 rounded border border-gray-500" v-model="state.author" />
              </label>
              <label class="block space-y-1 w-max">
                <p>public</p>
                <Toggle v-model="state.isPublic" class="py-2 border border-transparent m-auto" />
              </label>
            </div>
            <p class="text-xs text-gray-500">Only public puzzles are available on the puzzle page</p>
          </div>
          <label class="block space-y-1 w-full">
            <p>description</p>
            <input type="text" class="w-full appearance-none block bg-transparent px-4 py-2 rounded border border-gray-500" v-model="state.description" />
          </label>
          <button class="w-full bg-teal-700 px-2 py-2 rounded shadow flex items-center space-x-2 text-white justify-between" @click="share">
            <ShareIcon class="w-4 h-4" />
            <p>Share Puzzle</p>
            <div class="w-4"></div>
          </button>
        </div>
        <a v-if="state.slug" class="block text-teal-500" :href="state.url" target="_blank" rel="noopener noreferrer">
          <p class="text-xl">/{{ state.slug }}</p>
        </a>
        <div class="w-full p-8" v-if="state.copiedMessage">
          <div class="p-4 rounded-md text-center w-full bg-gray-500 border-2 border-gray-700 border-opacity-20 bg-opacity-20 backdrop-filter backdrop-blur text-xl sm:text-2xl text-teal-500 font-semibold">copied to clipboard</div>
        </div>
      </div>
    </template>
  </FLDefaultLayout>
  <textarea name="template" id="" class="sr-only whitespace-pre-wrap" aria-hidden ref="clipboardEl" :value="state.url" />
</template>

<script>
import slugify from 'slugify'
import words from '../../assets/words.json'
import { computed, reactive, ref } from '@vue/reactivity'
import FLDefaultLayout from '../../components/FLDefaultLayout.vue'
import { HomeIcon, ShareIcon, ChevronLeftIcon } from '@heroicons/vue/outline'
import { nextTick } from '@vue/runtime-core'
import Toggle from '../../components/basic/Toggle.vue'
export default {
  name: 'PuzzleEditor',
  components: { FLDefaultLayout, HomeIcon, ShareIcon, ChevronLeftIcon, Toggle },
  setup() {
    const state = reactive({
      puzzleInput: '',
      puzzleOutput: [],
      title: '',
      description: '',
      author: '',
      url: '',
      slug: '',
      isPublic: true,
      loading: false,
      error: '',
      copiedMessage: false,
    })
    const clipboardEl = ref(null)

    const computedOutput = computed(() =>
      state.puzzleInput
        .split(/\s+/)
        .filter((a) => !!a)
        .map((word) => {
          const normalizedWord = word
            .replace(/[^a-zA-Z ]/g, '')
            .toLowerCase()
            .normalize()
          if (words[normalizedWord.length] && words[normalizedWord.length].includes(normalizedWord)) {
            if (normalizedWord.length < 7) {
              return { word: normalizedWord, isFleurdle: true, isFleurdleElligible: true }
            }
            return { word: normalizedWord, isFleurdle: false, isFleurdleElligible: true }
          }
          return { word, isFleurdle: false, isFleurdleElligible: false }
        })
    )
    const createOutput = () => {
      if (outputMatches.value) {
        return
      }
      state.url = ''
      state.slug = ''
      state.puzzleOutput = computedOutput.value
    }

    const outputMatches = computed(() => {
      if (state.puzzleOutput.length !== computedOutput.value.length) {
        return false
      }
      return !state.puzzleOutput.some((entry, i) => {
        if (entry.word !== computedOutput.value[i].word) {
          return true
        }
        return false
      })
    })

    const share = async () => {
      try {
        const data = await fetch(window.location.origin + '/.netlify/functions/fleurdle-puzzle/api/puzzles', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            title: state.title,
            slug: slugify(state.title, { lower: true }),
            description: state.description,
            author: state.author,
            isPublic: state.isPublic,
            puzzle: state.puzzleOutput.map((entry) => ({ word: entry.word, isFleurdle: entry.isFleurdle })),
          }),
        }).then((response) => response.json())
        state.slug = data.slug
        state.url = new URL('/puzzles/' + data.slug, window.location.origin)
        nextTick(() => {
          if (navigator && navigator.share) {
            navigator
              .share({
                url: state.url,
              })
              .then(() => {
                console.log('Thanks for sharing!')

                state.copiedMessage = true
                setTimeout(() => {
                  state.copiedMessage = false
                }, 2000)
              })
              .catch(console.error)
          } else {
            clipboardEl.value.select()
            document.execCommand('copy')
            state.copiedMessage = true
            setTimeout(() => {
              state.copiedMessage = false
            }, 2000)
          }
        })
      } catch (error) {
        console.log(error)
        state.error = error
      }
    }

    return { state, createOutput, outputMatches, share, clipboardEl }
  },
}
</script>
