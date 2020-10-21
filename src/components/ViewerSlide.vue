<template>
<ion-page>
  <ion-header>
 <ion-toolbar>
  <ion-row>
    <ion-col size="1">
      <button ion-button icon-only @click="addeditClicked(1,getselectedRow('viewer'),'viewer',{true:'add',false:'edit'}[getselectedRow('viewer')<0])">
        <ion-icon name="getselectedRow('viewer')<0 ? 'md-add':'md-search'"></ion-icon>
      </button>
    </ion-col>
    <ion-col size="10" style="text-align:center" >Viewers</ion-col>
    <ion-col size="1">
      <button ion-button  icon-only @click="menu()">
        <ion-icon name="md-menu"></ion-icon>
      </button>
    </ion-col>
   </ion-row>
</ion-toolbar>
 <ion-toolbar>
  <ion-row>
    <ion-col size="4" class=" center">Name</ion-col>
    <ion-col size="3" class=" center">Tags</ion-col>
    <ion-col size="2" class=" center">Advance</ion-col>
    <ion-col size="1" class=" center">Rate</ion-col>
    <ion-col size="2" class=" center">Active</ion-col>
  </ion-row>
 </ion-toolbar>
  </ion-header>
<ion-content>
  <ion-row  v-for="(viewer,i) in data.Viewers" :key="viewer.id"
      @dbltap="addeditClicked(2,i,'viewer','edit')"
      @press="deleterow(i,'viewer')"       >
    <ion-col  size="4"  @click="setClickedRow(i,'viewer','Name')">{{viewer.Name}}</ion-col>
    <ion-col  size="3" class="colb   center" @click="setClickedRow(i,'viewer','Tags')">
       <ion-list >
         <ion-item no-lines class="center tag-background-transparent"  v-for="tag in viewer.Tags" :key="tag.id" >{{tagfromID(tag)}}</ion-item>
       </ion-list>
    </ion-col>
    <ion-col size="2" class = " colb  center " @click="setClickedRow(i,'viewer','Advance')">{{viewer.Advance}}</ion-col>
    <ion-col size="1" class = " colb  center" @click="setClickedRow(i,'viewer','RefreshRate')">{{viewer.ImageRefreshRate}}</ion-col>
    <ion-col size="2" class = "col colb  center" @click="setClickedRow(i,'viewer','Active')">{{viewer.Active}}</ion-col>
  </ion-row>
</ion-content>

</ion-page>
</template>
