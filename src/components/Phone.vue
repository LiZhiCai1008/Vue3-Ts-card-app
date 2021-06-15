<template>
  <span>{{ phoneText }}</span>
</template>

<script lang="ts">
  import { defineComponent, computed, ComputedRef } from 'vue'
export default defineComponent({
  props: {
    phone: {
      type: String,
      default: ""
    }
  },
  setup(props) {
    const phoneText: ComputedRef<string> = computed(() => {
      if (/^1\d{10}$/.test(props.phone)) {
        return props.phone.replace(/^(\d{3})\d{4}(\d{4})$/, "$1 **** $2");
      } else {
        return props.phone;
      }
    })
    return {
      phoneText
    }
  }
});
</script>