<template>
  <header class="flex items-center justify-between p-2 border-b border-gray-700 text-gray-500">
    <button @click="$emit('help')">
      <QuestionMarkCircleIcon class="w-6 h-6" />
    </button>
    <h1 class="text-2xl sm:text-4xl text-gray-200 font-black tracking-wider">FLEURDLE</h1>
    <button @click="$emit('settings')">
      <CogIcon class="w-6 h-6" />
    </button>
  </header>
</template>

<script>
import { QuestionMarkCircleIcon } from '@heroicons/vue/outline'
import { CogIcon } from '@heroicons/vue/solid'
export default {
  name: 'FLHeader',
  emits: ['help', 'settings'],
  components: { QuestionMarkCircleIcon, CogIcon },
}
</script>