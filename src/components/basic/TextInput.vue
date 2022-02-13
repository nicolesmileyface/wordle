<template>
  <div class="text-input__wrapper">
    <label :for="$attrs.name">
      <div class="text-input__label">{{ label }}</div>
    </label>
    <input type="text" :name="$attrs.name" :id="$attrs.id" :ref="$attrs.ref" :placeholder="$attrs.placeholder" class="text-input" :class="{ 'has-error': error !== '' }" v-model="m_value" @input="$emit('input', m_value)" />
    <p v-if="error !== ''" class="text-orange-700 font-medium text-sm text-center mt-1">{{ error }}</p>
  </div>
</template>

<script>
export default {
  props: {
    value: {
      type: String,
      default: '',
    },
    label: {
      type: String,
      default: '',
      required: true,
    },
    error: {
      type: String,
      default: '',
    },
  },
  data() {
    return {
      m_value: this.value,
    }
  },
}
</script>

<style lang="postcss" scoped>
.text-input__wrapper {
  @apply w-full text-left;
}
.text-input {
  @apply w-full px-2 py-2 font-medium rounded border-2 border-gray-400 ease-fast;
}
.has-error {
  @apply border-orange-700;
}
.text-input:focus {
  outline: none;
  @apply border-teal-600;
}
.text-input__label {
  @apply font-semibold mb-1 text-sm capitalize text-gray-700;
}
.text-input__label::after {
  content: ':';
}
</style>
