<template>
<ion-footer>
  <ion-toolbar >
    <ion-buttons slot="start">
      <button ion-button  @click="back()">
        <!-- <ion-icon name="arrowback" ></ion-icon>-Back -->
        <arrowback/>-Back
      </button>
    </ion-buttons>

    <ion-buttons slot="end">
      <button ion-button @click="next()">Next-
         <!-- <ion-icon name="arrowforward"></ion-icon> -->
         <arrowforward/>
      </button>
    </ion-buttons>
  </ion-toolbar>
</ion-footer>
</template>
<script >

import { IonToolbar,   IonButtons, IonFooter}  from '@ionic/vue';
import  arrowback from './arrowback';
import  arrowforward from './arrowforward';

export default{
  name: 'Footer',
  emits:['changepage'],
  components: { IonToolbar,   IonButtons, IonFooter,  arrowback, arrowforward} ,
  methods:{
    next(){
      console.log("emit forward")
      this.$emit('changepage',1)
    },
    back(){
      console.log("emit back")
      this.$emit('changepage',0)
    },
  }
}
</script>