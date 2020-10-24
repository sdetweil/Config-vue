<template>
<!-- ion-content style="height=100%"> -->
  <ion-row :ref="info.Type+i" v-for="(row,i) in data[info.Type+'s']" :key="row+'.Name'"
      v-press="info.Type" @press="deleteRow(i, info.Type)"
      v-dbltapd="info.Type"   @dbltap="addeditClicked(2,i,info.Type,'edit', $event)"
    >
    <ion-col v-for="(field) in info.Fields" :key="field.Name" :size="field.width" class = " colb  center " @click="setClickedRow(i,info.Type,field.Name, $event)" >
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
import { IonRow, IonCol,IonList, IonItem} from '@ionic/vue';
//import * as Hammer from 'hammerjs';
import { createGesture } from '@ionic/vue'; //from 'https://cdn.jsdelivr.net/npm/@ionic/core@latest/dist/esm/index.mjs';
import * as methodHandlers from '../views/methodHandlers.js'
import '../../public/css/custom.css';


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
    dbltapd: {
      created:function(el){
        console.log("dbltap created")
        //console.log("parms="+JSON.stringify(el,' ',2))
      },
      // eslint-disable-next-line
      mounted(el, binding, vnode) {

        let lastOnStart = 0;
        const onStart = function(ctx) {
            const DOUBLE_CLICK_THRESHOLD = 500;
            const now = Date.now();
            if (Math.abs(now - lastOnStart) <= DOUBLE_CLICK_THRESHOLD) {
              methodHandlers.invokeHandlers('dbltap'+binding.value)
              lastOnStart = 0;
            } else {
              lastOnStart = now;
            }
          }
          console.log("create gesture this ="+JSON.stringify(el))
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
    press:{
      created:function(el){
        console.log("press created")
        //console.log("parms="+JSON.stringify(el,' ',2))
      },
      unbind: function(){
         console.log("press unbind called")
      },
     // eslint-disable-next-line
     mounted(el, binding, vnode) {
        console.log("press mounted called for type=="+JSON.stringify(binding.value))
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
  getselectedRow(type){
    //console.log("get selected returning "+this.selectedRow[type]+" type="+type);
    return methodHandlers.getSelectedRow(type);
  },
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

  addeditClicked(mode, row, type, imageName){
    console.log("addedit clicked mode="+mode+" type="+type+" row="+row+" returning imagename="+imageName);
    return imageName
  },
  deleteRow(index, type){ console.log("delete row directive called="+index+" type="+type); return},

  removeString(source, item){
    //console.log("splitting ="+source)
    const x = source.split(' ')
     //console.log("splitting  after="+JSON.stringify(x))
    const y= x.indexOf(item.trim())
    //console.log("index of "+item+" is "+y)
    if(y>-1) {
      x.splice(y,1)
      //console.log("after removal="+JSON.stringify(x))
    }
    return x.join(' ')
  },

  setClickedRow(index, type, field){
  console.log("setclickedRow refs="+JSON.stringify(this.$refs))
  // if on , toggle off
  let selectedClass=' not-selected';                        //  color   'white';
  // if already selected
  if(methodHandlers.getSelectedRow(type) != -1){
    console.log("clearing selection for row = "+methodHandlers.getSelectedRow(type))
    selectedClass=' selected'
    this.$refs[type+methodHandlers.getSelectedRow(type)].$el.className=this.removeString(this.$refs[type+methodHandlers.getSelectedRow(type)].$el.className,selectedClass);                                         //style='background-color:'+selectedClass+';';
    // if the current index is NOT  the same (we are selecting a different row)
    if(index != methodHandlers.getSelectedRow(type)){
      methodHandlers.setSelectedRow('Viewer',index);
    }
    else {
      // we are deselecting the same row, already done
      methodHandlers.setSelectedRow(type,-1);
      methodHandlers.invokeHandlers("HeaderFresh"+type)
      return
    }

  } else {
    methodHandlers.setSelectedRow(type,index);
    selectedClass=' selected' //                      'blue'
  }
  this.$refs[type+methodHandlers.getSelectedRow(type)].$el.className+=selectedClass                                                                         //style='background-color:'+style1+';';

  console.log("setClickedRow clicked index="+index+" type="+type+" field="+field);
  methodHandlers.invokeHandlers("HeaderFresh"+type)
  return
  },


  signalDblTap(type){
      // double tap event fire
      //console.log("emitting doubletap r="+type+" "+JSON.stringify(this.$refs))
      // use the type and selected row to fire appropriate event..
      try {
        this.$refs[type+methodHandlers.getSelectedRow(type)].$emit('dbltap')
      }
      catch(error){
        console.log("")
      }
      //
  }
},
created(){
   console.log("content created this="+JSON.stringify(this))
   methodHandlers.registerHandler('dbltap'+this.info.Type, {func:this.signalDblTap, ctx:this.info.Type})
},
  data(){
    const pressGesture=0;
    const lastOnStart=0;

    return{ pressGesture, lastOnStart}
  },
}
</script>