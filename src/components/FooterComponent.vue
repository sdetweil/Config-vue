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

import { IonToolbar,   IonButtons, IonFooter,  }  from '@ionic/vue';
import  arrowback from './arrowback';
import  arrowforward from './arrowforward';

export default{
  name: 'Footer',
  components: { IonToolbar,   IonButtons, IonFooter,  arrowback, arrowforward} ,
  methods:{
    next(x){ console.log("next clicked type="+x);return x},
    back(x){ console.log("back clicked type="+x);return x},
  }
}
</script>