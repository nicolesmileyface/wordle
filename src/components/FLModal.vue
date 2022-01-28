<template>
  <button class="fixed w-screen h-screen overflow-auto inset-0 bg-opacity-25 bg-black backdrop-filter backdrop-blur p-8 xxs:pt-24 flex justify-center" :class="{ 'bg-blue-[rgb(20,128,188)]': title === 'CONGRATULATIONS', 'bg-[rgb(57,02,02)]': title === 'OOPS!' }" v-if="open" @click.self="$emit('update:open', false)">
    <div class="w-full max-w-md bg-gray-800 rounded-md p-4 space-y-4 border-2 border-gray-700 shadow-xl" :class="{ 'bg-gradient-to-br to-[#0c1e52] from-gray-800': title === 'CONGRATULATIONS', 'bg-gradient-to-br to-[#500d0d]': title === 'OOPS!' }">
      <header class="flex justify-between items-center pb-2 border-b border-gray-600 text-gray-500">
        <h2 class="text-xl sm:text-4xl text-gray-200 font-black tracking-wider text-left">{{ title }}</h2>
        <button @click="$emit('update:open', false)">
          <XIcon class="w-6 h-6 text-orange-600" />
        </button>
      </header>
      <slot />
    </div>
  </button>
</template>

<script>
import { XIcon } from '@heroicons/vue/outline'
export default {
  name: 'FLModal',
  components: { XIcon },
  props: {
    open: {
      type: Boolean,
      required: true,
    },
    title: {
      type: String,
      default: '',
    },
  },
  emits: ['update:open'],
}
</script>