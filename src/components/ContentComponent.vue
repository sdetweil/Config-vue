<template>
<ion-content style="height:87%; --padding-bottom:110px; ">
 <ion-refresher   slot="fixed" @ionRefresh="doRefresh($event);">
    <ion-refresher-content
      refreshingSpinner="circles"
      refreshingText="refreshing data, please wait">
    </ion-refresher-content>
 </ion-refresher>
  <ion-row
    v-for="(row, i) in data[info.Type + 's']"
    :key="row + '.Name'"

        :ref="info.Type + i"
        :id="info.Type + i"

        @press="deleteRow(i, info.Type)"
        v-dbltapd="info.Type"
        @dbltap="addeditClicked(2, i, info.Type, 'edit', $event)"
        @dbltap2="
          addeditClicked(
            1,
            getselectedRow(info.Type),
            info.Type,
            getselectedRow(info.Type) == -1 ? 'add' : 'edit',
            $event
          )
        "
      >
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
            <ion-item  v-if="field.Name == 'DataSource'" class=" colb " style="text-align:left;">
              {{ datasourcefromID(row[field.Name]) }}
            </ion-item>
             <ion-item v-else-if="field.Name == 'Root'" style="text-align:left;">
                {{ row[field.Name] }}
             </ion-item>
            <span v-else class=" colb " style="text-align:center;">
              {{ row[field.Name] }}
            </span>
          </ion-list>
        </ion-col>
      </ion-row>
      <!-- <Footer @changepage="changepage" ></Footer> -->
  </ion-content>

</template>

<script>
    import {
        IonRow,
        IonCol,
        IonList,
        IonItem,
        IonContent,
        IonRefresher,
        IonRefresherContent,
        modalController,
        actionSheetController
    } from "@ionic/vue";

    //import Footer from "../components/FooterComponent.vue";

    import { defineComponent } from 'vue';

    import {
        createGesture
    } from "@ionic/vue";
    import * as methodHandlers from "../composite/methodHandlers.js";
    import "../../public/css/custom.css";
    import DataService from "../services/dataservice.js";

    import ViewerModal from "../modals/ViewerModal.vue";
    import DatasourceModal from "../modals/DatasourceModal.vue";
    import ImageModal from "../modals/ImageModal.vue";
    import TagModal from "../modals/TagModal.vue";
    import FileModal from "../modals/FileModal.vue";
    import 'hammerjs';

    const Constants = {
        NOT_SELECTED: -1,
        DataSourceTypes: [
            "File", "Samba", "DropBox", "GoogleDrive", "Onedrive"
        ]
    };
    export default   defineComponent({
        name: "Content",
        components: {
            IonRow,
            IonCol,
            IonList,
            IonItem,
          IonContent,
          IonRefresher,
           IonRefresherContent,
      //    Footer,
        },
        emits: ["dbltap", "press", "dbltap2","changepage"],
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
                        return [{
                            Name: "Test",
                            width: 10
                        }];
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
        directives: {
         /*  xtapd: {
                mounted(el, binding, vnode) {
                    const pressGesture = createGesture({
                        name:'DoubleTap',
                        el: el,
                        recognizers: [
                            [window.Hammer.Tap, {taps: 2, interval:350}]
                        ]
                    });
                    pressGesture.enable();
                    //pressGesture.on('tap', e => {
                    //  this.dblTap.emit(e);
                    //})
                }
            }, */
            dbltapd: {

                // eslint-disable-next-line
                mounted(el, binding, vnode) {
                 //console.log("vndoe="+el.id)
                    let lastOnStart = 0;
                    let timerHandle=0;
                    let canceltimerHandle=0;
                    let clickCount=0;

                    // mouse up
                    const onEnd = function (data){
                        console.log("onEnd triggered")
                        if(timerHandle && clickCount==1){
                          clearTimeout(canceltimerHandle)
                          clearTimeout(timerHandle)
                          timerHandle=0
                        }
                    };

                    // mouse down
                    const onStart = function(data) { // function(data) {
                        clickCount++;
                        console.log("enter 'start'")
                        const DOUBLE_CLICK_THRESHOLD = 600;

                        // net time now
                        const now = Date.now();

                        // if more than one click, could be our double click
                        if(clickCount>1){

                            console.log("checking limit")
                            if (Math.abs(now - lastOnStart) <= DOUBLE_CLICK_THRESHOLD) {
                                console.log("double click")
                                // we have double click,
                                // and timer is running
                                if(timerHandle){
                                    console.log("canceling timer")
                                    // stop the timer
                                    clearTimeout(timerHandle)
                                    timerHandle=0;
                                    clearTimeout(canceltimerHandle)
                                }
                                // invoke the double click event
                                console.log("component invoking handler for dbltap" + binding.value)
                                // and indicate we are done
                                lastOnStart = 0;
                                clickCount=0;
                                methodHandlers.invokeHandlers("dbltap" + binding.value);
                            } else {
                               // over the time limit, so can't be double click
                               if(clickCount>2)
                                 clickCount=0
                               console.log("not over the limit count="+clickCount)
                            }
                        } else {
                            // starting event
                            console.log("starting timer for long press")
                            lastOnStart = now;
                            timerHandle= setTimeout(function(){
                                 console.log("timer invoking handler= press"+el.id)
                                 methodHandlers.invokeHandlers("press" +el.id);
                                 timerHandle=0;
                                 clickCount=0;
                                 lastOnStart = 0;
                                },
                                DOUBLE_CLICK_THRESHOLD+50
                            );
                            // start a timer to cancel the long press if we go over the double click time
                            // means we didn't get another click
                            canceltimerHandle= setTimeout(function(){
                                 console.log("cancel timer invoking handler");
                                 clearTimeout(timerHandle)
                                 timerHandle=0;
                                 clickCount=0;
                                 lastOnStart = 0;
                                },
                                DOUBLE_CLICK_THRESHOLD+100
                            );
                        }
                    };
                    //console.log("create gesture this =" + JSON.stringify(el));
                    const gesture = createGesture({
                        name:'DoubleTap',
                        el: el,
                        threshold: 0,
                        onStart: data => { onStart(data);},
                        onEnd: data => { onEnd(data)},
                        // pass the element id to the functions
                        data: el.id
                    });

                    gesture.enable();
                },
            },
        },

        methods: {
              async doRefresh(refresher){
                    console.log("refresh requested")
                    if(this.refresher!==0){
                        console.log("in refresh")
                        DataService.reloadData().then((newdata) =>{
                            this.$props.data=newdata;
                            if(this.refresher!==1){
                                this.refresher=1;
                            }
                        });
                    }
              },
            changepage(direction) {
              console.log("received change page event, direction=" + direction);
              this.$emit("changepage", direction);
            },

            /*

                set the row clicked

            */
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
            /*

                get the row that is selected (if any)  -1 if none

            */
            getselectedRow(type) {
                //console.log("get selected returning "+this.selectedRow[type]+" type="+type);
                return methodHandlers.getSelectedRow(type);
            },

            /*

                get the tag Name/vlaue from the id

            */
            tagfromID(x) {
                for (const tag of this.data.Tags) {
                    if (tag._id == x) {
                        return tag.value;
                    }
                }
                return x + " not found";
            },

            /*

                get the datasource Name/vlaue from the id

            */
            datasourcefromID(x) {
                for (const datasource of this.data.DataSources) {
                    if (datasource._id == x) return datasource.Name;
                }
                return x + " not found";
            },

            /*

                proxy for the emit to get the add/edit action to firce from meu

            */
            addeditProxy(x) {
                console.log("add edit proxy clicked for type=" + x.datatype)

                const refname = x.datatype + (x.row == -1 ? 0 : x.row)
                console.log("proxy refs=" + JSON.stringify(this.$refs) + " refname=" + refname)
                this.$refs[refname].$emit('dbltap2')
            },

            /*

                Add/Edit clicked on row need to open modal

            */
            async addeditClicked(func, index, datatype, action, self, ) {
                if (self == undefined)
                    self = this
                console.log(
                    action + " button clicked on datatype " + datatype + " and row=" + index
                );
                if (
                    (func == 2 && index == methodHandlers.getSelectedRow(datatype)) ||
                    (func == 1 && index != methodHandlers.getSelectedRow(datatype))
                ) {
                    console.log("add edit, row selected, uncheck");
                    this.setClickedRow(index, datatype, 0);
                }
                this.modaldatatype = action;
                switch (datatype) {
                    case "Viewer": {
                        if (index != Constants.NOT_SELECTED) {
                            // make a copy
                            this.thisviewer = JSON.parse(JSON.stringify(this.data.Viewers[index]));

                            this.thisviewer.isActive = this.data.Viewers[index].Active ?
                                "true" :
                                "false";

                            this.saveobject[datatype] = JSON.parse(
                                JSON.stringify(this.thisviewer)
                            );
                        } else {
                            this.thisviewer = {
                                Name: "foo",
                                Description: "bar",
                                Advance: 10,
                                Active: false,
                                ImageRefreshRate: 30,
                                Tags: []
                            };

                            this.saveobject[datatype] = null;
                        }
                        console.log("ready to cretae modal for type=" + datatype)
                        this.parentobject = this.thisviewer;
                        this.modal[datatype] = await modalController.create({
                            component: ViewerModal,
                            componentProps: {
                                action: action,
                                viewer: this.thisviewer,
                                parent: this.parentobject,
                                tags: this.$props.data.Tags
                            }
                        });
                    }
                    break;
                case "DataSource": {
                    if (index != Constants.NOT_SELECTED) {
                        this.thisdatasource = JSON.parse(JSON.stringify(this.data.DataSources[index]));
                        this.thisdatasource.isActive = this.data.DataSources[index].Active ?
                            "true" :
                            "false";
                        this.saveobject[datatype] = JSON.parse(
                            JSON.stringify(this.thisdatasource)
                        );
                    } else {
                        this.thisdatasource = {
                            Name: "sample",
                            Description: " some source info",
                            Active: false,
                            Root: "/*",
                            AuthInfo: {
                                OAuth: "",
                                Userid: "",
                                Password: ""
                            },
                            Type: {
                                Type: "File"
                            }
                        };
                        this.saveobject[datatype] = null;
                    }
                    this.parentobject = this.thisdatasource;
                    this.modal[datatype] = await modalController.create({
                        component: DatasourceModal,
                        componentProps: {
                            action: action,
                            datasource: this.thisdatasource,
                            parent: this.parentobject,
                            types: Constants.DataSourceTypes,
                            filedlg: FileModal
                        }
                    });
                }
                break;
                case "Image": {
                    if (index != Constants.NOT_SELECTED) {
                        this.thisimage = JSON.parse(JSON.stringify(this.data.Images[index]));
                        this.saveobject[datatype] = JSON.parse(
                            JSON.stringify(this.thisimage)
                        );
                    } else {
                        this.thisimage = {
                            Name: "",
                            Description: "",
                            DataSource: "",
                            PathFromSource: "/*jpg",
                            Tags: []
                        }; //JSON.parse(JSON.stringify(this.Images[0]));

                        this.saveobject[datatype] = null;
                    }
                    this.parentobject = this.thisimage;
                }
                this.modal[datatype] = await modalController.create({
                    component: ImageModal,
                    componentProps: {
                        action: action,
                        image: this.thisimage,
                        parent: this.parentobject,
                        tags: this.$props.data.Tags,
                        datasources: this.$props.data.DataSources,
                        filedlg: FileModal
                    }
                });
                break;
                case "Tag": {
                    if (index != Constants.NOT_SELECTED) {
                        this.thistag = JSON.parse(JSON.stringify(this.data.Tags[index]));
                        this.saveobject[datatype] = JSON.parse(JSON.stringify(this.thistag));
                    } else {
                        this.thistag = {
                            value: "sample_tag_name",
                            Description: "sample tag description"
                        };

                        this.saveobject[datatype] = null;
                    }
                    this.parentobject = this.thistag;
                    this.modal[datatype] = await modalController.create({
                        component: TagModal,
                        componentProps: {
                            action: action,
                            tag: this.thistag,
                            parent: this.parentobject
                        }
                    });
                }
                break;
                }
                console.log("about to open modal for type="+datatype)
                this.modal[datatype].present();

                console.log("would open dialog =" + datatype);
                // setup the dialog close handler
                const updatedObject= await this.modal[datatype].onDidDismiss();
                if(updatedObject.data) {
                    console.log("dialog dismissed")
                    // Do things with data coming from modal, for instance :
                        console.log(
                            "return from dialog type=" +
                            updatedObject.data.type +
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
                        DataService.saveModal(
                            action,
                            updatedObject.data.type,
                            updatedObject.data,
                            updatedObject.files?updatedObject.files:[]
                        );

                } else console.log("return from dialog, no data");

            },

            /*

                delete the row, triggered from long press

            */

            deleteRow(index,type)
            {
                    console.log("delete pressed, row="+index+" for type="+type);
                    let object=null;
                    switch(type.toLowerCase())
                    {
                        case 'viewer':
                            object=this.data.Viewers[index];
                            if(object.Active==true)
                            {
                                alert("this Viewer is active");
                                return;
                            }
                            break;
                        case 'datasource':
                            object=this.data.DataSources[index];
                            // check for images using this source
                            for(const image of this.data.Images)
                            {
                                if(image.DataSource=== object._id)
                                {
                                    alert("this DataSource is being used by Image "+ image.Name);
                                    return;
                                }
                            }
                            if(object.Active==true)
                            {
                                alert("this DataSource is active");
                                return;
                            }
                            break;
                        case 'image':
                            object=this.data.Images[index];
                            break;
                        case 'tag':
                            object=this.data.Tags[index];
                            object.Name=object.value;
                            // check for images using this tag
                            for(let i=0;i<this.data.Images.length;i++)
                            {
                                for(let j=0;j<this.data.Images[i].Tags.length;j++)
                                {
                                    if(this.data.Images[i].Tags[j]=== object._id)
                                    {
                                        alert("this Tag is being used by Image "+this.data.Images[i].Name);
                                        return;
                                    }
                                }
                            }
                            // check for viewers using this tag
                            for(let i=0;i<this.data.Viewers.length;i++)
                            {
                                for(let j=0;j<this.data.Viewers[i].Tags.length;j++)
                                {
                                    if(this.data.Viewers[i].Tags[j]=== object._id)
                                    {
                                        alert("this Tag is being used by Viewer "+ this.data.Viewers[i].Name);
                                        return;
                                    }
                                }
                            }
                            break;
                    }
                    this.confirmDelete(type,object);

            },

            /*

                delete requested, confirm and delete (or not)

            */
            async confirmDelete(type,object)
            {
                console.log("in confirm delete");
                const actionSheet =  await actionSheetController.create({
                  header: 'Delete '+type+ "?",
                  buttons: [
                    {
                      text: 'Delete',
                      role: 'destructive',
                    //  icon: trash,
                      handler: () => {
                        console.log('Destructive clicked');
                        DataService.dodelete(object,type)
                      }
                    },{
                      text: 'Cancel',
                      role: 'cancel',
                      handler: () => {
                        console.log('Cancel clicked');
                      }
                    }
                  ]
                });
                return actionSheet.present();
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




            /*

                the signal routines
                used by the  external event module

            */

            signalDblTap(type) {
                // double tap event fire
                //console.log("emitting doubletap r="+type+" "+JSON.stringify(this.$refs))
                // use the type and selected row to fire appropriate event..
                try {
                    this.$refs[type + methodHandlers.getSelectedRow(type)].$emit("dbltap2");
                } catch (error) {
                    console.log("");
                }
            },
            signalPress(id) {
                // press event fire
                console.log("emitting press r="+id+" "+JSON.stringify(this.$refs))
                try {
                    this.$refs[id].$emit("press");
                } catch (error) {
                    console.log("");
                }
            },
            signalClick(type) {
                // press event fire
                console.log("emitting press r="+type+" "+JSON.stringify(this.$refs))
                // use the type and selected row to fire appropriate event..
                console.log(" ref="+methodHandlers.getSelectedRow(type))
                try {
                    this.$refs[type + methodHandlers.getSelectedRow(type)].$emit("press");
                } catch (error) {
                    console.log("");
                }
            }
        },

        updated(){
            // register the handlers for long press on each row on each slide
            //console.log("refs = "+JSON.stringify(this.$refs))
            for(const r of Object.keys(this.$refs)){
                console.log("registering handler for press"+r)
                 methodHandlers.registerHandler("press" + r, {
                        func: this.signalPress,         // function to call
                        ctx: r                          // name to pass to handler
                });
            }
            //console.log("content created this=" + JSON.stringify(this));
            methodHandlers.registerHandler("dbltap" + this.info.Type, {
                func: this.signalDblTap,
                ctx: this.info.Type
            });
            console.log("press event created for "+"press" + this.info.Type);
            methodHandlers.registerHandler("click" + this.info.Type, {
                func: this.signalClick,
                ctx: this.info.Type
            });
            console.log("registering handler for addeditProxy" + this.info.Type)
            methodHandlers.registerHandler("addeditProxy" + this.info.Type, {
                func: this.addeditProxy,
                ctx: this.info.Type
            })
        },
        data() {
            const refresher=0;
            const pressGesture = 0;
            const lastOnStart = 0;
            const rowClass = -1;
            const modals = {
                Viewer: ViewerModal,
                DataSource: DatasourceModal,
                Image: ImageModal,
                Tag: TagModal
            };
            const modaltype = '';
            const modal = {};
            const thisviewer = '';
            const thisdatasource = '';
            const thisimage = '';
            const thistag = '';
            const saveobject = {};
            const parentobject = {}
            return {
                pressGesture,
                lastOnStart,
                rowClass,
                modals,
                modaltype,
                thisimage,
                thistag,
                thisviewer,
                thisdatasource,
                saveobject,
                parentobject,
                modal,
                refresher
            };
        }
    }
)
</script>

<style>
.selected {
    background-color:grey;
    /* color:white; */
   /* font-weight:bold; */
}

.center{
            display: flex;
            flex-direction:column;
            justify-content:center;
}
.content {
    height:87%;
}


</style>