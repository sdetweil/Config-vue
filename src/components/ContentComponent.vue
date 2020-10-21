<template>
<!-- <ion-content> -->
  <ion-row  v-for="(row,i) in data[info.Type+'s']" :key="row+'.Name'"
      v-dbltap="addeditClicked(2,i,info.Type,'edit')"
      v-press="deleteRow(i,info.Type)"       >
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


export default{
  name: 'Content',
  components: {  IonRow, IonCol ,  IonList, IonItem },
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
    dbltap: {
      created:function(){
         console.log("dbltap created")
         console.log("parms="+JSON.stringify(this,' ',2))
      },
      beforeMount(el){ console.log("mounted called for el="+JSON.stringify(el))},
      bind: function(){
         console.log("dbltap bind called")
      },
      unbind: function(){
         console.log("dbltap unbind called")
      }
    },
    press:{
      created: function(){
         console.log("press created")
         console.log("parms="+JSON.stringify(this,' ',2))
      },
      unbind: function(){
         console.log("press unbind called")
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
  datasourcefromID (x){ console.log("datasource fromid clicked ="+x);
        for(const datasource of this.data.DataSources){
         if(datasource.id == x)
           return datasource.Name
      }
      return x+' not found'
  },
  addeditClicked(mode, row, type, imageName){ console.log("addedit clicked mode="+mode+" type="+type+" returning imagename="+imageName);return imageName},
  deleteRow(x){ console.log("delete row directive called="+x); return},
  setClickedRow(index, type, field){console.log("setClickedRow clicked index="+index+" type="+type+" field="+field); return}
}

}
</script>