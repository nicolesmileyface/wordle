<template>
  <header class="flex items-center justify-between p-2 border-b border-gray-700 text-gray-500">
    <div class="flex space-x-4">
      <button @click="$emit('help')">
        <QuestionMarkCircleIcon class="w-6 h-6" />
      </button>
      <div class="w-6"></div>
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
</template>

<script>
import { QuestionMarkCircleIcon, BookOpenIcon } from '@heroicons/vue/outline'
import { CogIcon } from '@heroicons/vue/solid'
export default {
  name: 'FLHeader',
  emits: ['help', 'settings'],
  components: { QuestionMarkCircleIcon, CogIcon, BookOpenIcon },
}
</script>