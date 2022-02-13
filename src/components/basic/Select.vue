<template>
  <div>
    <select :name="$attrs.name" @change="input" :value="value">
      <option :value="option.label" v-for="(option, i) in options" :key="i">
        {{ option.label }}
      </option>
    </select>
  </div>
</template>

<script>
export default {
  props: {
    value: {
      type: String,
      required: true,
    },
    options: {
      type: Array,
      default: () => [{ label: 'label', value: 'value' }],
    },
  },
  setup(props, { emit }) {
    function input(e) {
      emit('input', e.target.value)
    }
    return { input }
  },
}
</script>
