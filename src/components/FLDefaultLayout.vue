<template>
  <div class="flex flex-col items-center h-full space-y-8 bg-gradient-to-br from-[rgb(28,31,50)] to-gray-900">
    <main class="w-screen xs:max-w-screen-xs m-auto h-full grid grid-rows-[auto,1fr,auto]">
      <div class="relative">
        <slot name="header" />
      </div>
      <section class="p-6 flex justify-center max-w-screen-xs w-full m-auto h-full overflow-auto" :class="{ 'items-center': items === 'center', 'items-start': items === 'start' }" v-if="!loading">
        <slot name="content" />
      </section>
      <div v-else>loading...</div>
      <section class="shrink-0" v-if="!loading">
        <slot name="footer" />
      </section>
    </main>
  </div>
  <div v-if="!loading">
    <slot name="modals" />
  </div>
</template>

<script>
export default {
  name: 'FLDefaultLayout',
  props: {
    loading: {
      type: Boolean,
      default: false,
    },
    items: {
      type: String,
      default: 'center',
    },
  },
}
</script>