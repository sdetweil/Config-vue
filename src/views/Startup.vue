<template>
  <!--
  Generated template for the StartupPage page.

  See http://ionicframework.com/docs/components/#navigation for more info on
  Ionic pages and navigation.
-->
  <ion-header >

      <ion-title class="center"> Mirror Discovery</ion-title>

  </ion-header>

  <ion-content padding>
    <div class="center">Mirror Discovery in progress, please wait...</div>
  </ion-content>
</template>
<script>


import { IonContent, IonHeader, IonTitle,
} from "@ionic/vue";
import 'capacitor-udp';
import { Plugins } from "@capacitor/core";
const { UdpPlugin } = Plugins;
//import {UdpPluginUtils} from "capacitor-udp";

import NetworkService from "../services/networkservice.js";
import DataService from "../services/dataservice.js";

export default {
  name: "Startup",
  components: {
    IonContent,
    IonHeader,
    IonTitle,
  },
  //its: ["changepage"],

  methods: {},

  created(){
    console.log("get saved server address")
    DataService.getServerAddress().then(()=> {
      // route away with server address
    }, (error) =>{
     console.log("calling network service find")
      NetworkService.findserverAddress(window,UdpPlugin, error).then( (address) => {
          console.log("server at "+address)
          // got a server address frm discovery
          // save it
          DataService.setServerAddress(address).then(()=>{
            // address saved, we are done, go to main page
            this.$router.go({path:"/Slides"})
          });
      },(error)=>{
        // unable to locate a server
        // should put up modal here
        console.log("no server found "+error)
        })
    })
  },

  props: {
      isInOutlet: {
                type: Boolean,
                default: function() {
                  return false;
                }
            }
        ,
      registerIonPage : {
                type: Function,
                default: function() {
                    return ()=>{console.log("")};
                }
            }
  }
};
</script>
<style>

.center{
    text-align:center;
}
</style>