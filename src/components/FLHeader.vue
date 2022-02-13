<template>
  <div class="space-y-1">
    <header class="flex items-center justify-between p-2 border-b border-gray-700 text-gray-500">
      <div class="flex space-x-4">
        <button @click="$emit('help')">
          <QuestionMarkCircleIcon class="w-6 h-6" />
        </button>
        <router-link to="/puzzles">
          <PuzzleIcon class="w-6 h-6" />
        </router-link>
      </div>
      <h1 class="text-2xl sm:text-4xl text-gray-200 font-black tracking-wider">FLEURDLE</h1>
      <div class="flex space-x-4">
        <router-link to="/explore">
          <BookOpenIcon class="w-6 h-6" />
        </router-link>
        <button @click="$emit('settings')">
          <CogIcon class="w-6 h-6" />
        </button>
      </div>
    </header>
    <div class="flex justify-center">
      <h2 class="text-base sm:text-lg text-gray-500 font-black tracking-wider uppercase">{{ mode }}</h2>
    </div>
  </div>
</template>

<script>
import { QuestionMarkCircleIcon, BookOpenIcon, PuzzleIcon } from '@heroicons/vue/outline'
import { CogIcon } from '@heroicons/vue/solid'
export default {
  name: 'FLHeader',
  props: {
    mode: {
      type: String,
      default: 'daily',
    },
  },
  emits: ['help', 'settings'],
  components: { QuestionMarkCircleIcon, CogIcon, BookOpenIcon, PuzzleIcon },
}
</script>