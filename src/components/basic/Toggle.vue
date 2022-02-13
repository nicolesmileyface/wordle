<template>
  <div class="switch-wrapper">
    <slot />
    <label for="switch" class="relative block rounded-full w-12 h-6 border-2 border-gray-700 cursor-pointer transition duration-200" :class="{ 'bg-teal-700': modelValue, 'bg-gray-800': !modelValue }">
      <div class="w-1/2 absolute left-0 top-0 block h-full bg-teal-500 rounded-full transition duration-200 transform" :class="{ 'translate-x-full': modelValue }"></div>
    </label>
    <input type="checkbox" class="invisible w-0 h-0 absolute pointer-events-none" name="switch" id="switch" :value="modelValue" @input="$emit('update:modelValue', !modelValue)" />
  </div>
</template>

<script>
export default {
  name: 'Toggle',
  emits: ['update:modelValue'],
  props: {
    modelValue: {
      type: Boolean,
      default: false,
    },
  },
}
</script>
