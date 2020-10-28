<template>
	<!--
Generated template for the TagModalPage page.

See http://ionicframework.com/docs/components/#navigation for more info on
Ionic pages and navigation.
-->
	<ion-header>
		<ion-title>{{ action}} Tags</ion-title>
	</ion-header>

	<ion-content padding>
		<ion-grid>
			<ion-row>
				<ion-col col-2>
					<label for="vname" width="10">Value</label>
				</ion-col>
				<ion-col col-8 class=" dashed-border">
					<input v-model="tagcopy.Value" type="text" id="vname" align="left" />
				</ion-col>
			</ion-row>
			<ion-row>
				<ion-col col-2>
					<label for="vdescription">Description</label>
				</ion-col>
				<ion-col col-8 class=" dashed-border">
					<input
						v-model="tagcopy.Description"
						type="text"
						id="vdescription"
						align="left"
					/>
				</ion-col>
			</ion-row>
		</ion-grid>
	</ion-content>
	<ion-footer>
		<ion-row>
			<ion-col col-2 alignleft>
				<button @click="closeModal()">
					Cancel <ion-icon md="md-close"></ion-icon>
				</button>
			</ion-col>
			<ion-col col-8> </ion-col>
			<ion-col col-2>
				<button @click="saveModal()" float-right>
					<ion-icon md="md-save"></ion-icon>Save
				</button>
			</ion-col>
		</ion-row>
	</ion-footer>
</template>
<script>
import {
	IonGrid,
	IonRow,
	IonCol,
	IonContent,
	IonFooter,
	IonHeader,
	IonTitle,
	IonIcon,
	modalController
} from "@ionic/vue";

export default {
	components: {
		IonGrid,
		IonRow,
		IonCol,
		IonContent,
		IonFooter,
		IonHeader,
		IonTitle,
		IonIcon,
	},
	name: "TagModal",
	methods: {
		closeModal() {
			console.log("tag modal closing")
			modalController.dismiss();
		},
		saveModal()
		{
			console.log("viewer modal save")
			modalController.dismiss({type:'tag',data:this.tagcopy});
		},
	},
	data(){
		const tagcopy={};
		return {tagcopy}
	},
	created(){
		this.tagcopy=this.$props.tag
	},
	props: {
		action:{
			type: String,
			default: function() {
				return "Sample";
			}
		},
		tag: {
			type: Object,
			default: function() {
				return {
				};
			}
		},
		parent: {
			type: Object,
			default: function() {
				return {};
			}
		},
	}
};
</script>
