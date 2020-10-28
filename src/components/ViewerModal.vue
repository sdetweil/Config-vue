<template>
	<ion-header>
		<ion-title>{{ action }} Viewer </ion-title>
	</ion-header>

	<ion-content >
		<ion-grid>
			<ion-row>
				<ion-col col-2>
					<label for="vname">Name:</label>
				</ion-col>
				<ion-col col-8>
					<ion-input  type="text" id="vname" align="left" v-model="viewercopy.Name" ></ion-input>
				</ion-col>
			</ion-row>
			<ion-row>
				<ion-col col-2>
					<label for="vdescription">Description:</label>
				</ion-col>
				<ion-col col-8 class="col colb">
					<ion-input
						type="text"
						id="vdescription"
						v-model="viewercopy.Description"
					>
					</ion-input>
				</ion-col>
			</ion-row>
		<ion-row>
				<ion-col col-2>
					<label for="vtags"> Tags:</label>
				</ion-col>
				<ion-col>
					<ion-select
						title="Tags"
						multiple="true"
						id="vtags"
						v-model="viewercopy.Tags"
						okText="Okay"
						cancelText="Dismiss"
						:compareWith="checkSelectedTag"
						compare-with="checkSelectedTag"
						>
						<ion-label>Tags</ion-label>
						<ion-select-option v-for="(tag) in tags" :key="tag._id"
							:value="tag._id" >{{tag.value}}
						</ion-select-option>
					</ion-select>
				</ion-col>
			</ion-row>
		<ion-row>
				<ion-col col-2>
					<label for="vdays">Advance:</label>
				</ion-col>
				<ion-col col-2 class="dashed-border">
					<ion-input
						type="number"
						id="vdays"
						class="dashed-border"
						v-model="viewercopy.Advance"
					>
					</ion-input>
				</ion-col>
			</ion-row>
			<ion-row>
				<ion-col col-2>
					<label for="vrate"> Rate:</label>
				</ion-col>
				<ion-col class="dashed-border">
					<ion-input
						type="number"
						id="vrate"
						class="dashed-border"
						v-model="viewercopy.ImageRefreshRate"
					>
					</ion-input>
				</ion-col>
			</ion-row>
			<ion-row>
				<ion-col col-2>
					<label for="vactive"> Active:</label>
				</ion-col>
				<ion-col col-10>
					<ion-checkbox
						id="vactive"
						@input="viewercopy.Active = $event.target.value"
						:value="viewercopy.Active"
					></ion-checkbox>
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
	IonCheckbox,
	IonHeader,
	IonTitle,
	IonGrid,
	IonRow,
	IonCol,
	IonSelect,
	IonSelectOption,
	IonContent,
	IonFooter,
	IonIcon,
	IonLabel,
	IonInput,
	modalController
} from "@ionic/vue";
import { defineComponent } from 'vue';

export default defineComponent( {
	components: {
		IonCheckbox,
		IonHeader,
		IonTitle,
		IonGrid,
		IonRow,
		IonCol,
		IonSelect,
		IonSelectOption,
		IonContent,
		IonFooter,
		IonIcon,
		IonLabel,
		IonInput
	},
	name: "ViewerModal",
	methods: {
		closeModal() {
			console.log("viewer modal closing")
			modalController.dismiss();
		},
		saveModal()
		{
			console.log("viewer modal save")
			modalController.dismiss({type:'viewer',data:this.viewercopy});
		},
		checkSelectedTag(tag1, tag2){
			console.log("comparing "+tag1+" with "+tag2)
			if(Array.isArray(tag2))
				return tag2.includes(tag1)
			return tag1===tag2;
		},
	},
	data(){
		const viewercopy={};
		return {viewercopy}
	},
	created(){
		this.viewercopy=this.$props.viewer
	},
	props: {
		action: {
			type: String,
			default: function() {
				return "Sample";
			}
		},
		viewer: {
			type: Object,
			default: function() {
				return {
					Name: "Test",
					Description: "no desc",
					Tags: "",
					Advance: 1,
					ImageRefreshRate: "30"
				};
			}
		},
		parent: {
			type: Object,
			default: function() {
				return {};
			}
		},
		tags : {
			type: Object,
			default: function() {
				return {};
			}
		}
	}
});
</script>
