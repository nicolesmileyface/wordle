<template>
  <FLDefaultLayout :items="state.word && state.word.length > 3 && state.numGuesses < 8 ? 'center' : 'start'" :loading="state.loading" :key="mode">
    <template #header>
      <slot name="header">
        <FLHeader @help="() => (state.modals.help = true)" @settings="() => (state.modals.settings = true)" :mode="mode" />
        <div class="absolute w-full p-8" v-if="state.errors.notInCorpus">
          <div class="error p-4 rounded-md text-center w-full bg-gray-500 border-2 border-gray-700 border-opacity-20 bg-opacity-20 backdrop-filter backdrop-blur text-xl sm:text-2xl text-orange-500 font-semibold">not in word list</div>
        </div>
      </slot>
    </template>
    <template #content>
      <div class="grid grid-flow-row-dense w-full justify-center" :class="{ 'gap-2 px-8 xxs:px-2': state.word.length < 12, 'gap-1 px-2 sm:gap-2': state.word.length >= 12 }" :style="`grid-template-columns: repeat(${state.word.length}, minmax(0, ${state.word.length > 4 ? `calc((100% * ${1 / state.word.length}) - ${state.word.length >= 12 ? 0.25 : 0.5}rem)` : '4rem'})); grid-auto-rows: min-content;`">
        <template v-for="(guess, j) in state.guesses">
          <div
            class="square w-full border border-gray-700 rounded text-xl font-black text-white flex items-center justify-center"
            v-for="(letter, i) in guess.letters"
            :key="[i, j, letter].join()"
            :class="{
              'bg-gray-900 text-gray-300 bg-opacity-25': state.keyColors.guesses[j][i] === undefined,
              'bg-teal-700 bg-opacity-90': state.keyColors.guesses[j][i] === 'pink',
              'bg-yellow-500 bg-opacity-90': state.keyColors.guesses[j][i] === 'yellow',
              'bg-black bg-opacity-90': state.keyColors.guesses[j][i] === 'black',
            }"
          >
            {{ letter.letter || '' }}
          </div>
        </template>
      </div>
    </template>
    <template #footer>
      <section class="shrink-0" v-if="!state.loading">
        <FLKeyboard @input="(key) => keyPress(key)" :colors="state.keyColors.base" />
      </section>
    </template>
    <template #modals>
      <FLModal v-model:open="state.modals.help" title="HELP">
        <slot name="modal-help">
          <div class="space-y-2 text-sm xs:text-base text-left">
            <p>Guess the <span class="font-semibold">FLEURDLE</span> in {{ state.numGuesses }} tries.</p>
            <p>Each guess must be a valid {{ state.numLetters }} word. Hit the <kbd>enter</kbd> button to submit.</p>
            <p>After each guess, the color of the tiles will change to show how close your guess was to the word.</p>
            <div class="w-full h-px bg-gray-600"></div>
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
            <div class="w-full h-px bg-gray-600"></div>
            <div class="space-y-2">
              <p class="font-bold">Game Modes:</p>
              <div class="flex space-x-2">
                <div :class="{ 'cursor-not-allowed': $route.path === '/' }">
                  <router-link class="block border-2 border-teal-700 px-4 py-2 rounded shadow font-semibold bg-teal-800 bg-opacity-50" to="/" :class="{ 'pointer-events-none !border-gray-700 !bg-gray-700 !bg-opacity-50 text-gray-500 !shadow-inner': $route.path === '/' }"> Daily </router-link>
                </div>
                <div :class="{ 'cursor-not-allowed': $route.path === '/freeplay' }">
                  <router-link class="block border-2 border-teal-700 px-4 py-2 rounded shadow font-semibold bg-teal-800 bg-opacity-50" to="/freeplay" :class="{ 'pointer-events-none !border-gray-700 !bg-gray-700 !bg-opacity-50 text-gray-500 !shadow-inner': $route.path === '/freeplay' }"> Freeplay </router-link>
                </div>
              </div>
            </div>
          </div>
        </slot>
      </FLModal>
      <FLModal v-model:open="state.modals.settings" title="SETTINGS">
        <slot name="modal-settings">
          <label class="block text-left">
            <p>Letters</p>
            <select v-model="state.numLetters" class="appearance-none w-full px-2 py-1 rounded border border-gray-500 bg-transparent text-white">
              <option :value="i" v-for="i in [2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15]" :key="i">{{ i }}{{ mode === 'daily' ? (state.history[`${i}`][`${state.day}`] == null || state.history[`${i}`][`${state.day}`] == HAS_TOUCHED ? '' : ' - completed') : '' }}</option>
            </select>
          </label>
          <label class="block text-left">
            <p>Guesses</p>
            <select :value="state.numGuesses" class="appearance-none w-full px-2 py-1 rounded border border-gray-500 bg-transparent text-gray-300 cursor-not-allowed focus:outline-none pointer-events-none" v-if="mode === 'daily'">
              <option :value="state.numGuesses">{{ state.numGuesses }}</option>
            </select>
            <select v-model="state.numGuesses" class="appearance-none w-full px-2 py-1 rounded border border-gray-500 bg-transparent text-white" v-else>
              <option :value="i + 1" v-for="(_, i) in Array.from({ length: 15 })" :key="i">{{ i + 1 }}</option>
            </select>
          </label>
          <button class="w-full bg-teal-700 px-2 py-2 rounded shadow cursor-not-allowed opacity-40" v-if="mode === 'daily' && state.history[`${state.numLetters}`][`${state.day}`] != null && state.history[`${state.numLetters}`][`${state.day}`] > HAS_TOUCHED">new game</button>
          <button class="w-full bg-teal-700 px-2 py-2 rounded shadow" @click.stop="() => newGame()" v-else>new game</button>
        </slot>
      </FLModal>
      <FLModal v-model:open="state.modals.won" title="CONGRATULATIONS">
        <slot name="modal-won">
          <p>you won 🏆</p>
          <button class="w-full bg-teal-700 px-2 py-2 rounded shadow" @click.stop="() => newGame()">new game</button>
        </slot>
      </FLModal>
      <FLModal v-model:open="state.modals.lost" title="OOPS">
        <slot name="modal-lost">
          <p>you lost 😥</p>
          <p>
            word was: <span class="font-semibold">{{ state.word }}</span>
          </p>
          <button class="w-full bg-teal-700 px-2 py-2 rounded shadow" @click.stop="() => newGame()">new game</button>
        </slot>
      </FLModal>
      <slot name="modals"></slot>
    </template>
  </FLDefaultLayout>
</template>

<script>
import FLDefaultLayout from '../components/FLDefaultLayout.vue'
import FLHeader from '../components/FLHeader.vue'
import FLModal from '../components/FLModal.vue'
import FLKeyboard from '../components/FLKeyboard.vue'
import { XIcon } from '@heroicons/vue/outline'
import { useGame } from '../composables/useGame'
import { useRoute } from 'vue-router'

export default {
  name: 'FLGame',
  props: {
    mode: {
      type: String,
      default: 'daily',
    },
  },
  components: { XIcon, FLHeader, FLModal, FLKeyboard, FLDefaultLayout },
  setup(props) {
    const route = useRoute()
    const { keys, state, keyPress, newGame, toEmojis, getStreak, canStartNewGame, HAS_TOUCHED } = useGame(props.mode, route.query && route.query.day && !isNaN(Number(route.query.day)) ? Math.floor(Number(route.query.day)) : null, route.params?.slug || null, route.params?.id || null)
    return { keys, state, keyPress, newGame, toEmojis, getStreak, canStartNewGame, HAS_TOUCHED }
  },
}
</script>

<style lang="postcss">
.square {
  height: max-content;
}
.square:after {
  content: '';
  display: block;
  user-select: none;
  padding-bottom: 100%;
}
button {
  touch-action: manipulation;
}
button pre {
  user-select: text;
}
.error {
  text-shadow: 1px 1px 4px theme('colors.black');
}
</style>
