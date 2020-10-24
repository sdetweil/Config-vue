<template>
  <ion-page>
    <ion-content :fullscreen="true">
    <ion-slides  ref="slides1" > <!-- :options="slideOps" -->
        <ion-slide   style="display:block;" v-for="(slide,i) in slides" :key="i" >
          <Slide   :info=slide :data=data @changepage="changepage"></Slide>
        </ion-slide>
    </ion-slides>
    </ion-content>
  </ion-page>
</template>

<script>

import { IonPage, IonSlide, IonSlides,IonContent } from '@ionic/vue'; //IonRefresher, IonSlide, IonSlides, IonContent,  IonRow, IonCol , IonList, IonItem,
import Slide from '../components/SlideComponent.vue'
import * as methodHandlers from './methodHandlers.js'


export default{
  name: 'Tab1',
  components: {  IonPage,  IonSlide, IonSlides, Slide , IonContent},
  emits: ['changepage'],
  methods:{

     changepage(direction){
      console.log("changing slide direction="+direction)
      if(direction){
        //methodHandlers.invokeHandlers("advanceSlide")
        this.$refs.slides1.$el.slideNext()
      }
      else
        //methodHandlers.invokeHandlers("reverseSlide")
        this.$refs.slides1.$el.slidePrev()
        console.log("next event")
     }
  },

created(){

  methodHandlers.setSelectedRow('Viewer',-1);
  methodHandlers.setSelectedRow('DataSource',-1);
  methodHandlers.setSelectedRow('Image',-1);
  methodHandlers.setSelectedRow('Tag',-1);

},
setup(){



  const adatasource={Name:'datasource name',Type:{Type:" local"}, Active: true,Root:"/",id:9};

  const aimage={Name:"image",id:11, Tags:[42,62],Source: 9, Path:"/somepath"};

  const data = {  Viewers: [{Name:"viewer1",id:1, Advance:5, Tags:[12,22,32], ImageRefreshRate: 10, Active:false},{Name:"viewer2",id:2,Advance:5, Tags:[42,52,62], ImageRefreshRate: 10, Active:false}],
                  DataSources: [adatasource],
                  Images: [aimage],
                  Tags: [{ Value:"tag1", id:12,Description:"tag 1"},{ Value:"tag2", id:"22",Description:"tag 22"},{ Value:"tag3", id:32,Description:"tag 32"},{Value:"tag4", id:42,Description:"tag 42"},{ Value:"tag5", id:52,Description:"tag 52"},{ Value:"tag6", id:62,Description:"tag 62"}]
               };

   const viewerFields = {
                      Type: 'Viewer',
                      Fields: [{Name:'Name',width:3},
                        {Name:'Tags',width:3},
                        {Name:'Advance',width:2},
                        {Name:'ImageRefreshRate',width:2},
                        {Name:'Active',width:2}
                        ]
                        };

   const dataSourceFields =  {
                  Type: 'DataSource',
                  Fields: [{Name:'Name',width:3},
                        {Name:'Type',width:2},
                        {Name:'Active',width:2},
                        {Name:'Root',width:5}
                        ]
                  };
   const imageFields = {
                  Type: 'Image',
                  Fields: [{Name:'Name',width:3},
                        {Name:'Tags',width:3},
                        {Name:'Source',width:3},
                        {Name:'Path',width:3}
                        ]
                };
   const tagFields =  {
                  Type: 'Tag',
                  Fields:
                     [{Name:'Value',width:4},
                     {Name:'Description',width:8}
                    ]
               };
  const slides = [viewerFields,dataSourceFields,imageFields, tagFields];
  const slideOps = { loop:true}
  console.log(" prop="+JSON.stringify(methodHandlers))

  return { data, slides , slideOps};
}
}
</script>
