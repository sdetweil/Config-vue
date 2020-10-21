<template><!--
  Generated template for the AddressModalPage page.

  See http://ionicframework.com/docs/components/#navigation for more info on
  Ionic pages and navigation.
-->
<ion-page>
<ion-header>

  <ion-title>
    <ion-title style="text-align:center;">Remote Server Address configuration</ion-title>
  </ion-title>

</ion-header>

<ion-content >
			<p> please enter the address of the remote mirror</p>
      <ion-list>
      <ion-item >
        <ion-label >Address    </ion-label>
          <ion-input type="text" v-model="ouraddress" placeholder="mirror_address"></ion-input>
      </ion-item>

       <button ion-item @click="itemSelected('save')">
           Save
       </button>
       <button ion-item @click="itemSelected('delete')">
           Delete
       </button>
       <button ion-item @click="itemSelected('cancel')">
           Cancel
       </button>
		</ion-list>
</ion-content>
</ion-page>
</template>
<script lang='ts'>

import { modalController, IonHeader, IonTitle, IonContent,IonItem,IonLabel,IonList, IonPage, IonInput}  from '@ionic/vue';
import { defineComponent } from 'vue';

export default  defineComponent({
  name: 'AddressModal',
  components: { IonHeader, IonTitle, IonContent,IonItem,IonLabel,IonList, IonPage,IonInput},
  methods:{
    itemSelected(parm: string){

        if(parm=='cancel')
          modalController.dismiss({action:'cancel'});
        else if(parm=='delete')
          modalController.dismiss({action:'delete'});
        else {
          console.log("ouraddress='"+this.ouraddress+"'")
          modalController.dismiss({action: 'save', address: this.ouraddress });
        }
    }
  },
  props: {
    propAddress: {
         type: String,
         default: '1234567'
       }
  },
  data(){
    return {
      'ouraddress':this.propAddress
    };
  }
});
</script>