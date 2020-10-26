<template>
  <!-- ion-content fullscreen="true"> -->
  <ion-row
    :ref="info.Type + i"
    v-for="(row, i) in data[info.Type + 's']"
    :key="row + '.Name'"
    v-press="info.Type"
    @press="deleteRow(i, info.Type)"
    v-dbltapd="info.Type"
    @dbltap="addeditClicked(2, i, info.Type, 'edit', $event)"
    @dbltap2="addeditClicked(1, getselectedRow(info.Type), info.Type, (getselectedRow(info.Type)==-1)?'add':'edit', $event)"
  >
    <!-- vv -->
    <ion-col
      v-for="field in info.Fields"
      :key="field.Name"
      :size="field.width"
      class=" colb  center "
      @click="setClickedRow(i, info.Type, field.Name, $event)"
    >
      <ion-list v-if="field.Name == 'Tags'">
        <ion-item
          v-for="(id, i) of row[field.Name]"
          :key="i"
          class=" colb  center "
        >
          {{ tagfromID(id) }}
        </ion-item>
      </ion-list>
      <ion-list v-else-if="field.Name == 'Type'">
        <ion-item
          v-for="(id, i) of row[field.Name]"
          :key="i"
          class=" colb  center "
        >
          {{ id }}
        </ion-item>
      </ion-list>
      <ion-list v-else>
        <ion-item v-if="field.Name == 'DataSource'" class=" colb  center ">
          {{ datasourcefromID(row[field.Name]) }}
        </ion-item>
        <span v-else class=" colb " style="text-align:center;">
          {{ row[field.Name] }}
        </span>
      </ion-list>
    </ion-col>
  </ion-row>
  <!-- </ion-grid> -->
  <!-- </ion-content> -->
</template>

<script>
import { IonRow, IonCol, IonList, IonItem ,   modalController, } from "@ionic/vue";
//import * as Hammer from 'hammerjs';
import { createGesture } from "@ionic/vue"; //from 'https://cdn.jsdelivr.net/npm/@ionic/core@latest/dist/esm/index.mjs';
import * as methodHandlers from "../composite/methodHandlers.js";
import "../../public/css/custom.css";

import ViewerModal from "./ViewerModal.vue";
import DatasourceModal from "./DatasourceModal.vue";
import ImageModal from "./ImageModal.vue";
import TagModal from "./TagModal.vue";
import FileModal from "./FileModal.vue";

const Constants={ NOT_SELECTED:-1,
    DataSourceTypes:[
    "File","Samba","DropBox","GoogleDrive","Onedrive"
    ]
};
export default {
  name: "Content",
  components: { IonRow, IonCol, IonList, IonItem,   },
  emits: ["dbltap", "press"],
  props: {
    info: {
      type: Object,
      name: {
        type: String,
        default: function() {
          return "Sample";
        }
      },
      fields: {
        type: Array,
        default: function() {
          return [{ Name: "Test", width: 10 }];
        }
      }
    },
    data: {
      type: Object,
      default: function() {
        return {};
      }
    }
  },
  /* computed:{
    getRowClass(){
       return this.rowClass!=this.selectedRow?'':'selected';
    }
},*/
  directives: {
    dbltapd: {
      created: function(el) {
        console.log("dbltap created");
        //console.log("parms="+JSON.stringify(el,' ',2))
      },
      // eslint-disable-next-line
      mounted(el, binding, vnode) {
        let lastOnStart = 0;
        const onStart = function(ctx) {
          const DOUBLE_CLICK_THRESHOLD = 500;
          const now = Date.now();
          if (Math.abs(now - lastOnStart) <= DOUBLE_CLICK_THRESHOLD) {
            methodHandlers.invokeHandlers("dbltap" + binding.value);
            lastOnStart = 0;
          } else {
            lastOnStart = now;
          }
        };
        console.log("create gesture this =" + JSON.stringify(el));
        const gesture = createGesture({
          el: el,
          threshold: 0,
          onStart: data => {
            onStart(data);
          },
          data: this
        });

        gesture.enable();
      },
      bind: function() {
        console.log("dbltap bind called");
      },
      unbind: function() {
        console.log("dbltap unbind called");
      }
    },
    press: {
      created: function(el) {
        console.log("press created");
        //console.log("parms="+JSON.stringify(el,' ',2))
      },
      unbind: function() {
        console.log("press unbind called");
      },
      // eslint-disable-next-line
      mounted(el, binding, vnode) {
        console.log(
          "press mounted called for type==" + JSON.stringify(binding.value)
        );
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
    }
  },

  methods: {
    getselectedRow(type) {
      //console.log("get selected returning "+this.selectedRow[type]+" type="+type);
      return methodHandlers.getSelectedRow(type);
    },
    tagfromID(x) {
      for (const tag of this.data.Tags) {
        if (tag.id == x) {
          return tag.Value;
        }
      }
      return x + " not found";
    },
    datasourcefromID(x) {
      for (const datasource of this.data.DataSources) {
        if (datasource.id == x) return datasource.Name;
      }
      return x + " not found";
    },
    addeditProxy(x){
      console.log("add edit proxy clicked for type="+x.datatype)

      const refname=x.datatype+(x.row==-1?0:x.row)
      console.log("proxy refs="+JSON.stringify(this.$refs)+" refname="+refname)
      this.$refs[refname].$emit('dbltap2')

      /*this.addeditClicked(this, x.mode,
          x.row,
          x.datatype,
          x.imagename);*/
    },
    addeditClicked1(mode, row, type, imageName) {
      console.log(
        "content addedit clicked mode=" +
          mode +
          " type=" +
          type +
          " row=" +
          row +
          " returning imagename=" +
          imageName
      );
      return imageName;
    },
    async addeditClicked( func, index, datatype, action, self,) {
      if(self == undefined)
        self = this
      console.log(
        action + " button clicked on datatype " + datatype + " and row=" + index
      );
      if (
        (func == 2 && index == methodHandlers.getSelectedRow(datatype)) ||
        (func == 1 && index != methodHandlers.getSelectedRow(datatype))
      ) {
        console.log("add edit, row selected, uncheck");
        self.setClickedRow(index, datatype, 0);
      }
      self.modaldatatype = action;
      switch (datatype) {
        case "Viewer":
          {
            if (index != Constants.NOT_SELECTED) {
              self.thisviewer = self.$props.data.Viewers[index];

              self.thisviewer.isActive = self.$props.data.Viewers[index].Active
                ? "true"
                : "false";

              self.saveobject[datatype] = JSON.parse(
                JSON.stringify(self.thisviewer)
              );
            } else {
              self.thisviewer = {
                Name: "foo",
                Description: "bar",
                Advance: 10,
                Active: false,
                ImageRefreshRate: 30,
                Tags: []
              };

              self.saveobject[datatype] = null;
            }
            console.log("ready to cretae modal for type="+datatype)
            self.parentobject = self.thisviewer;
            self.modal[datatype] = await modalController.create({
              component: ViewerModal,
              componentProps: {
                action: action,
                viewer: self.thisviewer,
                parent: self.parentobject,
                tags:   self.$props.data.Tags
              }
            });
          }
          break;
        case "DataSource":
          {
            if (index != Constants.NOT_SELECTED) {
              self.thisdatasource = self.data.DataSources[index];
              self.thisdatasource.isActive = self.data.DataSources[index].Active
                ? "true"
                : "false";
              self.saveobject[datatype] = JSON.parse(
                JSON.stringify(self.thisdatasource)
              );
            } else {
              self.thisdatasource = {
                Name: "sample",
                Description: " some source info",
                Active: false,
                Root: "/*",
                AuthInfo: { OAuth: "", Userid: "", Password: "" },
                datatype: { datatype: "File" }
              };
              self.saveobject[datatype] = null;
            }
            self.parentobject = self.thisdatasource;
            self.modal[datatype] = await modalController.create({
              component: DatasourceModal,
              componentProps: {
                action: action,
                datasource: self.thisdatasource,
                parent: self.parentobject,
                types: Constants.DataSourceTypes,
                filedlg: FileModal
              }
            });
          }
          break;
        case "Image":
          {
            if (index != Constants.NOT_SELECTED) {
              self.thisimage = self.data.Images[index];
              self.saveobject[datatype] = JSON.parse(
                JSON.stringify(self.thisimage)
              );
            } else {
              self.thisimage = {
                Name: "",
                Description: "",
                DataSource: "",
                PathFromSource: "/*jpg",
                Tags: []
              }; //JSON.parse(JSON.stringify(self.Images[0]));

              self.saveobject[datatype] = null;
            }
            self.parentobject = self.thisimage;
          }
          self.modal[datatype] = await modalController.create({
            component: ImageModal,
            componentProps: {
              action: action,
              image: self.thisimage,
              parent: self.parentobject,
              tags:   self.$props.data.Tags,
              datasources: self.$props.data.DataSources,
              filedlg: FileModal
            }
          });
          break;
        case "Tag":
          {
            if (index != Constants.NOT_SELECTED) {
              self.thistag = JSON.parse(JSON.stringify(self.data.Tags[index]));
              self.saveobject[datatype] = JSON.parse(JSON.stringify(self.thistag));
            } else {
              self.thistag = {
                value: "sample_tag_name",
                Description: "sample tag description"
              };

              self.saveobject[datatype] = null;
            }
            self.parentobject = self.thistag;
            self.modal[datatype] = await modalController.create({
              component: TagModal,
              componentProps: {
                action: action,
                tag: self.thistag,
                parent: self.parentobject
              }
            });
          }
          break;
      }
      console.log("would open dialog =" + datatype);
      // setup the dialog close handler
      self.modal[datatype].onDidDismiss(
        function(updatedObject) {
          // Do things with data coming from modal, for instance :
          if (updatedObject != undefined) {
            console.log(
              "return from dialog type=" +
                updatedObject.type +
                " data=" +
                JSON.stringify(updatedObject.data)
            );
            console.log("sometimes files returned=" + updatedObject.files);
            if (updatedObject.files != undefined) {
              console.log(
                "there are " +
                  updatedObject.files.length +
                  " file to process for selections"
              );
            }
            self.d.saveModal(
              self.action,
              self.page,
              updatedObject,
              updatedObject.files
            );
          } else console.log("return from dialog, no data");
        }.bind({ d: self.d, action: action, page: datatype })
      );
      self.modal[datatype].present();
    },
    deleteRow(index, type) {
      console.log("delete row directive called=" + index + " type=" + type);
      return;
    },

    removeString(source, item) {
      //console.log("splitting ="+source)
      const x = source.split(" ");
      //console.log("splitting  after="+JSON.stringify(x))
      const y = x.indexOf(item.trim());
      //console.log("index of "+item+" is "+y)
      if (y > -1) {
        x.splice(y, 1);
        //console.log("after removal="+JSON.stringify(x))
      }
      return x.join(" ");
    },

    setClickedRow(index, type, field) {
      console.log("setclickedRow refs=" + JSON.stringify(this.$refs));

      const selectedClass = " selected";

      // if already selected
      if (methodHandlers.getSelectedRow(type) != -1) {
        console.log(
          "clearing selection for row = " + methodHandlers.getSelectedRow(type)
        );
        this.$refs[
          type + methodHandlers.getSelectedRow(type)
        ].$el.className = this.removeString(
          this.$refs[type + methodHandlers.getSelectedRow(type)].$el.className,
          selectedClass
        );

        // if the current index is NOT  the same (we are selecting a different row)
        if (index != methodHandlers.getSelectedRow(type)) {
          methodHandlers.setSelectedRow(type, index);
        } else {
          // we are deselecting the same row, already done
          methodHandlers.setSelectedRow(type, -1);
          // force a header refresh
          methodHandlers.invokeHandlers("HeaderFresh" + type);
          return;
        }
      } else {
        methodHandlers.setSelectedRow(type, index);
      }

      this.$refs[
        type + methodHandlers.getSelectedRow(type)
      ].$el.className += selectedClass;
      console.log(
        "setClickedRow clicked index=" +
          index +
          " type=" +
          type +
          " field=" +
          field
      );

      // force a header refresh
      methodHandlers.invokeHandlers("HeaderFresh" + type);
      return;
    },

    signalDblTap(type) {
      // double tap event fire
      //console.log("emitting doubletap r="+type+" "+JSON.stringify(this.$refs))
      // use the type and selected row to fire appropriate event..
      try {
        this.$refs[type + methodHandlers.getSelectedRow(type)].$emit("dbltap");
      } catch (error) {
        console.log("");
      }
      //
    }
  },
  created() {
    console.log("content created this=" + JSON.stringify(this));
    methodHandlers.registerHandler("dbltap" + this.info.Type, {
      func: this.signalDblTap,
      ctx: this.info.Type
    });
    console.log("registering handler for addeditProxy" + this.info.Type)
    methodHandlers.registerHandler("addeditProxy" + this.info.Type, {
      func: this.addeditProxy,
      ctx: this.info.Type
    })


  },
  data() {
    const pressGesture = 0;
    const lastOnStart = 0;
    const rowClass = -1;
    const selectedRow = -1;
    const modals = {
      Viewer: ViewerModal,
      DataSource: DatasourceModal,
      Image: ImageModal,
      Tag: TagModal
    };
    const modaltype='';
    const modal = {};
    const thisviewer='';
    const thisdatasource='';
    const thisimage='';
    const thistag='';
    const saveobject={};
    const parentobject = {}
    return { pressGesture, lastOnStart, rowClass,  modals, modaltype, thisimage, thistag, thisviewer, thisdatasource, saveobject, parentobject, modal };
  }
};
</script>
