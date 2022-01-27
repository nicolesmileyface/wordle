<template>
  <div class="flex flex-col items-center h-full space-y-8 bg-gradient-to-br from-[rgb(28,31,50)] to-gray-900">
    <main class="w-screen xs:max-w-screen-xs m-auto h-full grid grid-rows-[auto,1fr,auto]">
      <div class="relative">
        <header class="flex items-center justify-between p-2 border-b border-gray-700 text-gray-500">
          <button @click="() => (modals.help = true)">
            <QuestionMarkCircleIcon class="w-6 h-6" />
          </button>
          <h1 class="text-2xl sm:text-4xl text-gray-200 font-black tracking-wider">FLEURDLE</h1>
          <button @click="() => (modals.settings = true)">
            <CogIcon class="w-6 h-6" />
          </button>
        </header>
        <div class="absolute w-full p-8" v-if="notInCorpus">
          <div class="p-4 rounded text-center w-full bg-gray-300 text-gray-900">not in word list</div>
        </div>
      </div>
      <section class="p-6 flex items-center justify-center max-w-screen-xs w-full m-auto h-full overflow-auto" v-if="!loading">
        <div class="grid gap-2 w-full px-8 xxs:px-2" :style="`grid-template-columns: repeat(${word.length}, minmax(0, 1fr));`">
          <template v-for="(guess, j) in guesses">
            <div
              class="square w-full border border-gray-700 rounded text-xl font-black text-white flex items-center justify-center"
              v-for="(letter, i) in guess.letters"
              :key="[i, j, letter].join()"
              :class="{
                'bg-gray-900 text-gray-300 bg-opacity-25': keyColors.guesses[j][i] === undefined,
                'bg-teal-700 bg-opacity-90': keyColors.guesses[j][i] === 'pink',
                'bg-yellow-500 bg-opacity-90': keyColors.guesses[j][i] === 'yellow',
                'bg-black bg-opacity-90': keyColors.guesses[j][i] === 'black',
              }"
            >
              {{ letter.letter || '' }}
            </div>
          </template>
        </div>
      </section>
      <div v-else>loading...</div>
      <section class="shrink-0" v-if="!loading">
        <div class="space-y-2 py-3 px-2 w-full">
          <div class="flex w-full gap-1 xs:gap-1.5 justify-center">
            <button
              @click="() => keyPress(key)"
              v-for="key in keys[0]"
              :key="key"
              class="text-xs sm:text-sm text-white flex items-center justify-center flex-1 py-5 rounded w-max uppercase font-black select-none"
              :class="{
                'bg-gray-700': keyColors.base[key] === undefined,
                'bg-teal-700': keyColors.base[key] === 'pink',
                'bg-yellow-500': keyColors.base[key] === 'yellow',
                'bg-black': keyColors.base[key] === 'black',
              }"
            >
              <kbd>{{ key }}</kbd>
            </button>
          </div>
          <div class="flex w-full gap-1 xs:gap-1.5 justify-center">
            <div style="flex: 0.5"></div>
            <button
              @click="() => keyPress(key)"
              v-for="key in keys[1]"
              :key="key"
              class="text-xs sm:text-sm text-white flex items-center justify-center flex-1 py-5 rounded w-max uppercase font-black select-none"
              :class="{
                'bg-gray-700': keyColors.base[key] === undefined,
                'bg-teal-700': keyColors.base[key] === 'pink',
                'bg-yellow-500': keyColors.base[key] === 'yellow',
                'bg-black': keyColors.base[key] === 'black',
              }"
            >
              <kbd>{{ key }}</kbd>
            </button>
            <div style="flex: 0.5"></div>
          </div>
          <div class="flex w-full gap-1 xs:gap-1.5 justify-center">
            <button
              @click="() => keyPress(key)"
              v-for="key in keys[2]"
              :key="key"
              class="text-xs sm:text-sm text-white flex items-center justify-center flex-1 py-5 rounded w-max uppercase font-black select-none"
              :class="{
                'bg-gray-700': keyColors.base[key] === undefined,
                'bg-teal-700': keyColors.base[key] === 'pink',
                'bg-yellow-500': keyColors.base[key] === 'yellow',
                'bg-black': keyColors.base[key] === 'black',
              }"
            >
              <BackspaceIcon class="w-4 h-4 xs:w-6 xs:h-6" v-if="key === 'backspace'" />
              <kbd v-else :class="{ 'px-0.5 xs:px-3 tracking-tight': key === 'enter' }">{{ key }}</kbd>
            </button>
          </div>
        </div>
      </section>
    </main>
  </div>
  <div class="fixed top-0 right-0 text-white text-sm p-5 max-w-xs w-screen bg-gray-700" v-if="debugging">
    <pre><code>word: {{word}}</code></pre>
    <pre class="overflow-scroll h-64 w-full"><code>keyColors: {{keyColors}}</code></pre>
    <pre class="overflow-scroll h-64 w-full"><code>results: {{results}}</code></pre>
    <pre class="overflow-scroll h-64 w-full"><code>guesses: {{guesses}}</code></pre>
  </div>
  <button class="fixed w-screen h-screen overflow-auto inset-0 bg-opacity-25 bg-black backdrop-filter backdrop-blur p-8 xxs:pt-24 flex justify-center" v-if="modals.help" @click.self="() => (modals.help = false)">
    <div class="bg-gray-800 rounded-md p-4 space-y-4 border-2 border-gray-700 shadow-xl">
      <header class="flex justify-between items-center pb-2 border-b border-gray-500 text-gray-500">
        <h2 class="text-xl sm:text-4xl text-gray-200 font-black tracking-wider text-left">HELP</h2>
        <button @click="() => (modals.help = false)">
          <XIcon class="w-6 h-6 text-orange-600" />
        </button>
      </header>
      <div class="space-y-2 text-sm xs:text-base text-left">
        <p>Guess the <span class="font-semibold">FLEURDLE</span> in {{ numGuesses }} tries.</p>
        <p>Each guess must be a valid {{ numLetters }} word. Hit the <kbd>enter</kbd> button to submit.</p>
        <p>After each guess, the color of the tiles will change to show how close your guess was to the word.</p>
        <div class="w-full h-px bg-gray-500"></div>
        <p class="font-bold">Examples</p>
        <div class="space-y-2">
          <section class="flex gap-1">
            <div class="bg-teal-700 bg-opacity-90 square w-8 border border-gray-700 rounded text-xl font-black text-white flex items-center justify-center">W</div>
            <div class="square w-8 border border-gray-700 rounded text-xl font-black text-white flex items-center justify-center">E</div>
            <div class="square w-8 border border-gray-700 rounded text-xl font-black text-white flex items-center justify-center">A</div>
            <div class="square w-8 border border-gray-700 rounded text-xl font-black text-white flex items-center justify-center">R</div>
            <div class="square w-8 border border-gray-700 rounded text-xl font-black text-white flex items-center justify-center">Y</div>
          </section>
          <p>The letter <kbd>W</kbd> is in the word and in the correct spot</p>
        </div>
        <div class="space-y-2">
          <section class="flex gap-1">
            <div class="square w-8 border border-gray-700 rounded text-xl font-black text-white flex items-center justify-center">P</div>
            <div class="bg-yellow-500 bg-opacity-90 square w-8 border border-gray-700 rounded text-xl font-black text-white flex items-center justify-center">I</div>
            <div class="square w-8 border border-gray-700 rounded text-xl font-black text-white flex items-center justify-center">L</div>
            <div class="square w-8 border border-gray-700 rounded text-xl font-black text-white flex items-center justify-center">L</div>
            <div class="square w-8 border border-gray-700 rounded text-xl font-black text-white flex items-center justify-center">S</div>
          </section>
          <p>The letter <kbd>I</kbd> is in the word but in the wrong spot</p>
        </div>
        <div class="space-y-2">
          <section class="flex gap-1">
            <div class="bg-teal-700 bg-opacity-90 square w-8 border border-gray-700 rounded text-xl font-black text-white flex items-center justify-center">V</div>
            <div class="square w-8 border border-gray-700 rounded text-xl font-black text-white flex items-center justify-center">A</div>
            <div class="square w-8 border border-gray-700 rounded text-xl font-black text-white flex items-center justify-center">G</div>
            <div class="bg-black bg-opacity-90 square w-8 border border-gray-700 rounded text-xl font-black text-white flex items-center justify-center">U</div>
            <div class="square w-8 border border-gray-700 rounded text-xl font-black text-white flex items-center justify-center">E</div>
          </section>
          <p>The letter <kbd>U</kbd> is in not in the word in any spot</p>
        </div>
      </div>
    </div>
  </button>
  <button class="fixed w-screen h-screen overflow-auto inset-0 bg-opacity-25 bg-black backdrop-filter backdrop-blur p-8 xxs:pt-24 flex justify-center" v-if="modals.settings" @click.self="() => (modals.settings = false)">
    <div class="w-full max-w-md bg-gray-800 rounded-md p-4 space-y-4 border-2 border-gray-700 shadow-xl">
      <header class="flex justify-between items-center pb-2 border-b border-gray-500 text-gray-500">
        <h2 class="text-xl sm:text-4xl text-gray-200 font-black tracking-wider text-left">SETTINGS</h2>
        <button @click="() => (modals.settings = false)">
          <XIcon class="w-6 h-6 text-orange-600" />
        </button>
      </header>
      <label class="block text-left">
        <p>Letters</p>
        <select v-model="numLetters" class="appearance-none w-full px-2 py-1 rounded border border-gray-500 bg-transparent text-white">
          <option :value="i" v-for="i in [2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15]" :key="i">{{ i }}</option>
        </select>
      </label>
      <label class="block text-left">
        <p>Guesses</p>
        <select v-model="numGuesses" class="appearance-none w-full px-2 py-1 rounded border border-gray-500 bg-transparent text-white">
          <option :value="i" v-for="(_, i) in Array.from({ length: 15 })" :key="i">{{ i }}</option>
        </select>
      </label>
      <button class="w-full bg-teal-700 px-2 py-2 rounded shadow" @click.stop="() => newGame()">new game</button>
    </div>
  </button>
  <button class="fixed w-screen h-screen overflow-auto inset-0 bg-opacity-25 bg-blue-[rgb(20,128,188)] backdrop-filter backdrop-blur p-8 xxs:pt-24 flex justify-center" v-if="modals.won" @click.self="() => (modals.won = false)">
    <div class="w-full max-w-md bg-gradient-to-br to-[#0c1e52] from-gray-800 rounded-md p-4 space-y-4 border-2 border-gray-700 shadow-xl">
      <header class="flex justify-between items-center pb-2 border-b border-gray-500 text-gray-500">
        <h2 class="text-xl sm:text-4xl text-gray-200 font-black tracking-wider text-left">CONGRATULATIONS</h2>
        <button @click="() => (modals.won = false)">
          <XIcon class="w-6 h-6 text-orange-600" />
        </button>
      </header>
      <p>you won 🏆</p>
      <button class="w-full bg-teal-700 px-2 py-2 rounded shadow" @click.stop="() => newGame()">new game</button>
    </div>
  </button>
  <button class="fixed w-screen h-screen overflow-auto inset-0 bg-opacity-25 bg-[rgb(57,02,02)] backdrop-filter backdrop-blur p-8 xxs:pt-24 flex justify-center" v-if="modals.lost" @click.self="() => (modals.lost = false)">
    <div class="w-full max-w-md bg-gradient-to-br to-[#500d0d] from-gray-800 rounded-md p-4 space-y-4 border-2 border-gray-700 shadow-xl">
      <header class="flex justify-between items-center pb-2 border-b border-gray-500 text-gray-500">
        <h2 class="text-xl sm:text-4xl text-gray-200 font-black tracking-wider text-left">OOPS!</h2>
        <button @click="() => (modals.lost = false)">
          <XIcon class="w-6 h-6 text-orange-600" />
        </button>
      </header>
      <p>you lost 😥</p>
      <p>
        word was: <span class="font-semibold">{{ word }}</span>
      </p>
      <button class="w-full bg-teal-700 px-2 py-2 rounded shadow" @click.stop="() => newGame()">new game</button>
    </div>
  </button>
</template>

<script>
import words from '../assets/words/out'
import { QuestionMarkCircleIcon, BackspaceIcon, XIcon } from '@heroicons/vue/outline'
import { CogIcon } from '@heroicons/vue/solid'
import { onMounted, ref } from 'vue'

export default {
  name: 'App',
  components: { QuestionMarkCircleIcon, CogIcon, BackspaceIcon, XIcon },
  setup() {
    const count = ref(0)
    const debugging = ref(false)
    const numLetters = ref(5)
    const numGuesses = ref(6)
    const word = ref('')
    const results = ref({})
    const guesses = ref([])
    const keyColors = ref({})
    const loading = ref(true)
    const corpus = ref([])
    const modals = ref({})
    const notInCorpus = ref(false)

    const newGame = async (showHelp = false) => {
      loading.value = true
      corpus.value = words[numLetters.value]
      word.value = corpus.value[Math.floor(Math.random() * corpus.value.length)]
      guesses.value = Array.from({ length: numGuesses.value }).map(() => ({
        letters: Array.from({ length: word.value.length }).map(() => ({ letter: null, color: 'gray' })),
        final: false,
      }))
      keyColors.value = {
        base: {},
        guesses: Array.from({ length: numGuesses.value }).map(() => ({})),
      }
      results.value = {
        solved: -1,
      }
      modals.value = {
        help: showHelp,
        settings: false,
        won: false,
        lost: false,
      }
      loading.value = false
    }

    const guess = (index) => {
      if (!corpus.value.includes(guesses.value[index].letters.map(({ letter }) => letter).join(''))) {
        notInCorpus.value = true
        setTimeout(() => {
          notInCorpus.value = false
        }, 1500)
        return
      }
      guesses.value[index].final = true
      guesses.value[index].letters.forEach((letter, i) => {
        const totalLetterMatches = word.value.split('').filter((wordLetter) => letter.letter === wordLetter).length
        const totalIndexMatches = word.value.split('').filter((wordLetter, i) => guesses.value[index].letters.map(({ letter }) => letter)[i] === wordLetter && letter.letter === wordLetter).length
        const maxYellows = totalLetterMatches - totalIndexMatches
        if (letter.letter === word.value[i]) {
          letter.color = 'pink'
        } else if (word.value.includes(letter.letter) && maxYellows > 0) {
          letter.color = 'yellow'
        } else {
          letter.color = 'black'
        }
        if (!(letter.letter in keyColors.value.base) || keyColors.value.base[letter.letter] === 'black') {
          keyColors.value.base[letter.letter] = letter.color
        } else if (keyColors.value.base[letter.letter] === 'yellow' && letter.color === 'pink') {
          keyColors.value.base[letter.letter] = letter.color
        }
        keyColors.value.guesses[index][i] = letter.color
      })
      if (guesses.value[index].letters.map(({ letter }) => letter).join('') === word.value) {
        results.value.solved = index
        modals.value.won = true
        return
      }
      if (index === numGuesses.value - 1) {
        modals.value.lost = true
      }
    }
    const keyPress = (key) => {
      if (!keys.flat(2).includes(key.toLowerCase())) {
        return
      }
      if (keyColors.value.base[key] === 'black') {
        return
      }
      if (results.value.solved > -1) {
        return
      }
      const index = guesses.value.findIndex((guess) => !guess.final)
      if (index === -1) {
        return
      }
      const insertIndex = guesses.value[index].letters.findIndex((letter) => !letter.letter)
      if (key === 'backspace') {
        const deleteIndex = insertIndex === 0 ? 0 : insertIndex > 0 ? insertIndex - 1 : word.value.length - 1
        guesses.value[index].letters[deleteIndex].letter = null
      } else if (key === 'enter' && insertIndex === -1) {
        guess(index)
      } else if (key !== 'backspace' && key !== 'enter' && insertIndex > -1) {
        guesses.value[index].letters[insertIndex].letter = key.toLowerCase()
      }
    }
    const keys = [
      ['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p'],
      ['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l'],
      ['enter', 'z', 'x', 'c', 'v', 'b', 'n', 'm', 'backspace'],
    ]
    onMounted(() => {
      document.addEventListener('keyup', (e) => {
        if ([modals.value.help, modals.value.settings, modals.value.won, modals.value.lost].some((v) => v)) {
          return
        }
        keyPress(e.key.toLowerCase())
      })
      newGame(true)
    })
    return { count, keys, guesses, word, keyPress, results, keyColors, debugging, modals, numLetters, numGuesses, loading, notInCorpus, newGame }
  },
}
</script>

<style scoped lang="postcss">
.square:after {
  content: '';
  display: block;
  user-select: none;
  padding-bottom: 100%;
}
</style>