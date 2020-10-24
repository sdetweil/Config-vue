<template>
  <div>
    <button @click="emitEvent(eventName)">Emit Event</button>
  </div>
</template>

<script>
import { useEventHub } from '@/composables/useEventHub'

export default {
  props: [ 'eventName' ],
  setup() {
    const { emitEvent } = useEventHub()

    return {
      emitEvent
    }
  }
}

</script>
