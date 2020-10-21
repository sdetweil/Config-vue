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

<ion-content style="text-align:center;">
			<p> please enter the address of the remote mirror</p>
      <ion-item>
        <ion-label fixed>Address</ion-label>
          <ion-input id="ouraddress" type="text" placeholder="mirror_address">{{propAddress}}</ion-input>
        </ion-item>
      <ion-list>
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
          /*let foo;
          const el = document.getElementById('ouraddress')
          if(el){
             console.log("have element")
             foo =el.value;
             console.log("element value="+foo)
          } else {
            console.log('did not find element')
          }*/

          modalController.dismiss({action: 'save', address: '12345' });
        }
    }
  },
  props: {
    propAddress: {
         type: String,
         default: '1234567'
       }
  },
});
</script>