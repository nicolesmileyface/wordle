<template>
  <div class="space-y-2 py-3 px-2 w-full">
    <div class="flex w-full gap-1 xs:gap-1.5 justify-center">
      <FLKey @click="() => keyPress(key)" v-for="key in keys[0]" :key="key" :value="key" :colors="colors" />
    </div>
    <div class="flex w-full gap-1 xs:gap-1.5 justify-center">
      <div style="flex: 0.5"></div>
      <FLKey @click="() => keyPress(key)" v-for="key in keys[1]" :key="key" :value="key" :colors="colors" />
      <div style="flex: 0.5"></div>
    </div>
    <div class="flex w-full gap-1 xs:gap-1.5 justify-center">
      <FLKey @click="() => keyPress(key)" v-for="key in keys[2]" :key="key" :value="key" :colors="colors" />
    </div>
  </div>
</template>

<script>
import FLKey from '../components/FLKey.vue'

export default {
  name: 'FLKeyboard',
  components: { FLKey },
  emits: ['input'],
  props: {
    colors: {
      type: null,
      default: () => ({}),
    },
  },
  setup(_, { emit }) {
    const keys = [
      ['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p'],
      ['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l'],
      ['enter', 'z', 'x', 'c', 'v', 'b', 'n', 'm', 'backspace'],
    ]
    const keyPress = (key) => {
      if (!keys.flat(2).includes(key.toLowerCase())) {
        return
      }
      emit('input', key)
    }
    return { keys, keyPress }
  },
}
</script>
