<template>
  <ion-app>
    <EventListener relationship="Grandparent" eventName="taco">
      <EventListener relationship="Parent" eventName="taco">
        <div>
          <EventEmitter eventName="taco" />
          <EventListener relationship="sibling" eventName="taco">
            <EventListener relationship="sibling-child" eventName="taco" />
          </EventListener>
        </div>
      </EventListener>
    </EventListener>
  </ion-app>
</template>

<script lang="ts">
import { IonApp, IonRouterOutlet } from '@ionic/vue';
import { defineComponent } from 'vue';
import EventEmitter from "@/components/EventEmitter.vue";
import EventListener from "@/components/EventListener.vue";

export default defineComponent({
  name: 'App',
  components: {
    IonApp,
    EventEmitter,
    EventListener
  }
});
</script>
