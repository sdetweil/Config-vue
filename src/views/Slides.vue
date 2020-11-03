<template>
      <ion-slides ref="slides1" style="height:100%">
        <!-- :options="slideOps" -->
        <ion-slide style="display:block;" v-for="(slide, i) in slides" :key="i">   <!--  -->
          <Slide
            :info="slide"
            :data="serverdata"
            @changepage="changepage"
          ></Slide>
        </ion-slide>
      </ion-slides>
</template>

<script>
import {
  IonSlide,
  IonSlides,
} from "@ionic/vue";
import Slide from "../components/SlideComponent.vue";
import * as methodHandlers from "../composite/methodHandlers.js";
import DataService from "../services/dataservice.js";

export default {
  name: "Tab1",
  components: {
  //IonPage,
  IonSlide,
  IonSlides,
  Slide,
  //IonContent
  },
  methods: {
    changepage(direction) {
      console.log("changing slide direction=" + direction);
      if (direction) {
        this.$refs.slides1.$el.slideNext();
        console.log("next event");
      } else {
        this.$refs.slides1.$el.slidePrev();
        console.log("prev event");
      }
    }
  },
  beforeCreate(){
    this.serverdata = this.data;
    DataService.setTypes(this.datatypes);

    DataService.reloadData().then(sdata => {
      console.log("back from get server data " + JSON.stringify(sdata));
      this.serverdata = sdata;
    },(error)=>{
      console.log(" no server found, prototype data used");
      this.serverdata = this.data;
    });

  },
  created() {
    methodHandlers.setSelectedRow("Viewer", -1);
    methodHandlers.setSelectedRow("DataSource", -1);
    methodHandlers.setSelectedRow("Image", -1);
    methodHandlers.setSelectedRow("Tag", -1);
  },
  data() {
    const serverdata = {};
    return { serverdata };
  },
  setup() {
    // default data
    const data = {
      Viewers: [
        {
          Name: "viewer1",
          _id: 1,
          Advance: 5,
          Tags: [12, 22, 32],
          ImageRefreshRate: 10,
          Active: true
        },
        {
          Name: "viewer2",
          _id: 2,
          Advance: 5,
          Tags: [42, 52, 62],
          ImageRefreshRate: 10,
          Active: false
        }
      ],
      DataSources: [
        {
          Name: "datasource name",
          Type: { Type: " File" },
          Active: true,
          Root: "/",
          _id: 9
        },
        {
          Name: "datasource name2",
          Type: { Type: " File" },
          Active: false,
          Root: "/",
          _id: 65
        }
      ],
      Images: [
        {
          Name: "image",
          _id: 11,
          Tags: [42, 62],
          DataSource: 9,
          PathFromSource: "/somepath"
        }
      ],
      Tags: [
        { value: "tag1", _id: 12, description: "tag 1" },
        { value: "tag2", _id: 22, description: "tag 22" },
        { value: "tag3", _id: 32, description: "tag 32" },
        { value: "tag4", _id: 42, description: "tag 42" },
        { value: "tag5", _id: 52, description: "tag 52" },
        { value: "tag6", _id: 62, description: "tag 62" }
      ]
    };
    // description of the form fields, used by all the display functions and dialogs
    const viewerFields = {
      Type: "Viewer",
      Fields: [
        { Name: "Name", width: 3 },
        { Name: "Tags", width: 3 },
        { Name: "Advance", width: 2 },
        { Name: "ImageRefreshRate", width: 2 },
        { Name: "Active", width: 2 }
      ]
    };

    const dataSourceFields = {
      Type: "DataSource",
      Fields: [
        { Name: "Name", width: 3 },
        { Name: "Type", width: 2 },
        { Name: "Active", width: 2 },
        { Name: "Root", width: 5 }
      ]
    };
    const imageFields = {
      Type: "Image",
      Fields: [
        { Name: "Name", width: 3 },
        { Name: "Tags", width: 3 },
        { Name: "DataSource", width: 3 },
        { Name: "PathFromSource", width: 3 }
      ]
    };
    const tagFields = {
      Type: "Tag",
      Fields: [{ Name: "value", width: 4 }, { Name: "description", width: 8 }]
    };
    const datatypes = ["Tags", "DataSources", "Viewers", "Images"];
    const slides = [viewerFields, dataSourceFields, imageFields, tagFields];
    const slideOps = { loop: true };
    //console.log(" prop=" + JSON.stringify(methodHandlers));

    return { data, slides, slideOps, datatypes };
  }
};
</script>
<style>

body {
  display: flex;
  flex-direction: column;
}


</style>