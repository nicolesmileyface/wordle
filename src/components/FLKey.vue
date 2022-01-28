<template>
  <button
    @click="$emit('click', value)"
    class="text-xs sm:text-sm text-white flex items-center justify-center flex-1 py-5 rounded w-max uppercase font-black select-none"
    :class="{
      'bg-gray-700': colors[value] === undefined,
      'bg-teal-700': colors[value] === 'pink',
      'bg-yellow-500': colors[value] === 'yellow',
      'bg-black': colors[value] === 'black',
    }"
  >
    <BackspaceIcon class="w-4 h-4 xs:w-6 xs:h-6" v-if="value === 'backspace'" />
    <kbd v-else :class="{ 'px-0.5 xs:px-3 tracking-tight': value === 'enter' }">{{ value }}</kbd>
  </button>
</template>

<script>
import { BackspaceIcon } from '@heroicons/vue/outline'

export default {
  name: 'FLKey',
  components: { BackspaceIcon },
  emits: ['click'],
  props: {
    value: {
      type: String,
      default: '',
    },
    colors: {
      type: null,
      default: () => ({}),
    },
  },
}
</script>