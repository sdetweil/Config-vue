<template>
<!-- <ion-content> -->
  <ion-row ref="info.Type" v-for="(row,i) in data[info.Type+'s']" :key="row+'.Name'"
      v-press @press="deleteRow(i, info.Type)"
      @dbltap="addeditClicked(2,i,info.Type,'edit')"
    >
    <ion-col v-for="(field) in info.Fields" :key="field.Name" :size="field.width" class = " colb  center " @click="setClickedRow(i,info.Type,field.Name)" >
      <ion-list v-if="field.Name=='Tags'"  >
        <ion-item v-for="(id,i) of row[field.Name]" :key="i" class = " colb  center ">
          {{tagfromID(id)}}
        </ion-item>
      </ion-list>
      <ion-list v-else-if="field.Name=='Type'">
        <ion-item v-for="(id,i) of row[field.Name]" :key="i" class = " colb  center ">
          {{id}}
        </ion-item>
      </ion-list>
      <ion-list v-else>
        <ion-item v-if="field.Name=='Source'" class = " colb  center ">
         {{datasourcefromID(row[field.Name])}}
        </ion-item>
        <span v-else class = " colb " style="text-align:center;">
           {{row[field.Name]}}
        </span>
      </ion-list>
    </ion-col>
  </ion-row>
  <!-- </ion-grid> -->
 <!-- </ion-content> -->
</template>

<script >
import { IonRow, IonCol,IonList, IonItem } from '@ionic/vue';
//import * as Hammer from 'hammerjs';
import { createGesture } from '@ionic/vue'; //from 'https://cdn.jsdelivr.net/npm/@ionic/core@latest/dist/esm/index.mjs';

export default{
  name: 'Content',
  components: {  IonRow, IonCol ,  IonList, IonItem },
  emits:['dbltap','press'],
  props: {
    info: { type: Object,
         name: {
           type: String,
           default: function () {
             return 'Sample'
           }
         },
         fields: {
           type: Array,
           default: function() {
             return [{Name: 'Test', width: 10}]
           }
         }
     },
       data: {
         type:Object,
         default: function() {
           return {}
         }
       }
   },

directives:{
    press: {
      created:function(el){
        console.log("dbltap created")
        console.log("parms="+JSON.stringify(el,' ',2))
      },
      mounted(el){
        let lastOnStart = 0;
        const onStart = function(data) {
            const DOUBLE_CLICK_THRESHOLD = 500;

            const now = Date.now();

            if (Math.abs(now - lastOnStart) <= DOUBLE_CLICK_THRESHOLD) {
              console.log("should fire")
              data.$emit('dbltap')
              lastOnStart = 0;
            } else {
              lastOnStart = now;
            }
          }
        const gesture = createGesture({
          el:el,
          threshold: 0,
          onStart: (data) => { onStart(data); },
          data:this
        });

        gesture.enable();

      },
      bind: function(){
         console.log("dbltap bind called")
      },
      unbind: function(){
         console.log("dbltap unbind called")
      }
    },
    dbltap:{

      unbind: function(){
         console.log("press unbind called")
      },
      mounted(el){
        console.log("press mounted called for el="+JSON.stringify(el))
     /*   for (const key of Object.keys(Hammer)){
           console.log("hammer key="+key)
        }
       this.pressGesture = createGesture(el, {
          recognizers: [
            [ Hammer.Tap, {taps: 2, interval:350} ]
          ]
        });
        this.pressGesture.listen();
        this.pressGesture.on('tap', e => {
          this.dblTap.emit(e);
        }) */
      }

    },
},

methods:{
  tagfromID (x){
      for(const tag of this.data.Tags){
         if(tag.id == x) {
           return tag.Value
         }
      }
      return x+' not found'
  },
  datasourcefromID (x){
        for(const datasource of this.data.DataSources){
         if(datasource.id == x)
           return datasource.Name
      }
      return x+' not found'
  },

  addeditClicked(mode, row, type, imageName){ console.log("addedit clicked mode="+mode+" type="+type+" returning imagename="+imageName);return imageName},
  deleteRow(index, type){ console.log("delete row directive called="+index+" type="+type); return},
  setClickedRow(index, type, field){console.log("setClickedRow clicked index="+index+" type="+type+" field="+field); return}
},
  data(){
    const pressGesture=0;
    const lastOnStart=0;
    return{ pressGesture, lastOnStart}
  },
}
</script>