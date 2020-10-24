<template>
  <div>
    {{relationship}} Event Occurred: {{callbackEventOccurred}}
    <slot />
  </div>
</template>

<script>
import { useEventHub } from "@/composables/useEventHub"
import { ref, onUnmounted, toRefs } from 'vue'
export default {
  props: [ "eventName", "relationship" ],
  setup(props) {
    const { registerForEvent, deregisterForEvent } = useEventHub()
    const { eventName } = toRefs(props)
    const callbackEventOccurred = ref(false)

    function updateCallbackEvent() {
      callbackEventOccurred.value = true
    }
    const eventID = registerForEvent(eventName.value, updateCallbackEvent)

    onUnmounted(() => {
      deregisterForEvent(eventID)
    })

    return {
      callbackEventOccurred
    }
  }
}
</script>
