<template>
  <ion-header>
    <ion-toolbar>
      <ion-buttons slot="start">
        <!-- <addicon v-if="getselectedRow(info.Type)<0"/> -->
        <!-- <editicon v-else/> -->
        <button
          ion-button
          icon-only
          @click="
            addeditClicked(
              1,
              getselectedRow(info.Type),
              info.Type,
              { true: 'add', false: 'edit' }[getselectedRow(info.Type) < 0]
            )
          "
        >
          <ion-icon
            :icon="getselectedRow(info.Type) < 0 ? addCircleSharp : searchSharp"
          />
        </button>
      </ion-buttons>
      <ion-title style="text-align: center;">{{ info.Type }}s</ion-title>
      <ion-buttons slot="end">
        <button ion-button icon-only @click="menu()">
          <ion-icon :icon="menuSharp"></ion-icon>
        </button>
      </ion-buttons>
    </ion-toolbar>
    <ion-toolbar>
      <ion-row>
        <ion-col
          v-for="field in info.Fields"
          :key="field.Name"
          :size="field.width"
          class=" colb  center "
          >{{ field.Name }}</ion-col
        >
      </ion-row>
    </ion-toolbar>
  </ion-header>
</template>

<script>
import { Plugins } from "@capacitor/core";

import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonButtons,
  IonRow,
  IonCol,
  IonIcon,
  modalController
} from "@ionic/vue";

import AddressModal from "../modals/AddressModal.vue";
import { addCircleSharp, searchSharp, menuSharp } from "ionicons/icons";
//import { addIcons } from "ionicons";
import * as methodHandlers from "../composite/methodHandlers.js";

const { Storage } = Plugins;

export default {
  Name: "Header",
  components: {
    IonHeader,
    IonToolbar,
    IonTitle,
    IonButtons,
    IonRow,
    IonCol,
    IonIcon
  },
  computed: {},
  methods: {
    // when the content component selects a row, our button icon functions need to be called
    refresh() {
      console.log("refresh");
      this.$forceUpdate();
    },

    async addeditClicked(func, index, datatype, action) {
      console.log("header add edit clicked for type="+datatype)
      methodHandlers.invokeHandlersWithParameters ("addeditProxy"+datatype, {mode:func, row:index, datatype:datatype, imagename:action})
      console.log("invoked handler for addeditProxy"+datatype)
    },


    // get the row that is selected
    getselectedRow(type) {
      console.log(
        "header get selected returning " +
          methodHandlers.getSelectedRow(type) +
          " type=" +
          type
      );
      const t = methodHandlers.getSelectedRow(type);
      return t;
    },

    // opens the ip address dialog for this server
    async menu() {
      // get the current saved address from storage (if any)
      const address1 = await Storage.get({ key: "server_ip" });
      let address2;
      if (address1.value == "undefined" || address1.value == null) {
        address2 = "";
      } else address2 = address1.value;
      // create the modal dialog
      const res = await modalController.create({
        component: AddressModal,
        componentProps: { propAddress: address2 }
      });

      // show the dialog
      res.present();

      // wait for dialog to be dismissed
      const updatedObject = await res.onDidDismiss();

      // Do things with data coming from modal,  :
      // get the data from the response

      // if any response
      if (updatedObject != undefined && updatedObject.data != undefined) {
        // and the action is save
        if (updatedObject.data["action"] == "save") {
          // if there is somethign to save
          if (
            updatedObject.data["address"] != undefined &&
            updatedObject.data["address"] != ""
          ) {
            Storage.set({
              key: "server_ip",
              value: updatedObject.data["address"]
            });
          }
        }
        // if delete op
        else if (updatedObject.data["action"] == "delete") {
          // clear the storage area
          Storage.remove({ key: "server_ip" });
        }
      } else {
        console.log("return from dialog, no data");
      }
    }
  },
  /* created(){
    addIcons({
      "add": addCircleSharp,
      "search": searchSharp,
      "menu": menuSharp
    });
  }, */

  // this component is created, not do initialization of any data
  created() {
    //console.log(" header created =" + JSON.stringify(this));
    methodHandlers.registerHandler("HeaderFresh" + this.info.Type, {
      func: this.refresh,
      ctx: null
    });
  },

  props: {
    info: {
      type: Object,
      Name: {
        type: String,
        default: function() {
          return "Sample";
        }
      },
      Fields: {
        type: Array,
        default: function() {
          return [{ Name: "Test", width: 10 }];
        }
      }
    },
  },
  data(){
    const modaltype='';
    const modal = {};
    const thisviewer='';
    const thisdatasource='';
    const thisimage='';
    const thistag='';
    const saveobject={};
    const parentobject = {}
    return { modaltype, thisimage, thistag, thisviewer, thisdatasource, saveobject, parentobject, modal};
  },
  setup() {


    return { addCircleSharp, searchSharp, menuSharp };
  }
};
</script>
