<template>
	<!--
Generated template for the ImageModalPage page.

See http://ionicframework.com/docs/components/#navigation for more info on
Ionic pages and navigation.
-->
	<ion-header>
		<ion-title>{{ action }} Image</ion-title>
	</ion-header>

	<ion-content padding>
		<ion-grid>
			<ion-row>
				<ion-col col-2>
					<label for="vname" width="10">Name:</label>
				</ion-col>
				<ion-col col-8 class=" dashed-border">
					<input
						v-model="imagecopy.Name"
						type="text"
						id="vname"
						align="left"
					/>
				</ion-col>
			</ion-row>
			<ion-row>
				<ion-col col-2>
					<label for="vdescription">Description:</label>
				</ion-col>
				<ion-col col-8 class=" dashed-border">
					<input
						v-model="imagecopy.Description"
						type="text"
						id="vdescription"
						align="left"
						class="dashed-border"
					/>
				</ion-col>
			</ion-row>
			<ion-row>
				<ion-col col-2>
					<label for="vtags"> Tags:</label>
				</ion-col>
				<ion-col col-8>
					<ion-select
						title="Tags"
						multiple="true"
						id="vtags"
						v-model="imagecopy.Tags"
						okText="Okay"
						cancelText="Dismiss"
						compareWith="checkSelectedTag"
						compare-with="checkSelectedTag"
						>
						<ion-label>Tags</ion-label>
						<ion-select-option v-for="(tag) in tags" :key="tag.id"
							:value="tag.id"
							>{{tag.Value}}
						</ion-select-option>
					</ion-select>
				</ion-col>
			</ion-row>

			<ion-row>
				<ion-col col-2>
					<label for="vsource"> Source:</label>
				</ion-col>
				<ion-col col-8>
					<ion-select
						style="width:85%;"
						id="vsource"
						v-model="imagecopy.DataSource"
						compareWith="checkSelectedSource"
						okText="Okay"
						cancelText="Dismiss"
						@ionChange="f()"
						:value="imagecopy.DataSource"
					>
						<ion-select-option
							v-for="(source) in datasources" :key="source.id"
							:value="source.id"
							>{{ source.Name }}
						</ion-select-option>
					</ion-select>
				</ion-col>
			</ion-row>

			<ion-row
				@dblTap="doubleClick(thisimage, true)"
			>
				<ion-col col-2>
					<label for="vpath"> Path from Source:</label>
				</ion-col>
				<ion-col col-10>
					<span id="vpath" class="dashed-border">{{
						imagecopy.PathFromSource
					}}</span>
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
	IonSelect,
	IonSelectOption,
	IonContent,
	IonFooter,
	IonHeader,
	IonIcon,
	IonLabel,
	IonTitle,
} from "@ionic/vue";

export default {
	components: {
		IonGrid,
		IonRow,
		IonCol,
		IonSelect,
		IonSelectOption,
		IonContent,
		IonFooter,
		IonHeader,
		IonIcon,
		IonLabel,
		IonTitle
	},
	name: "ImageModal",
	methods: {
		closeModal() {
			console.log("in closemodal");
		},
		saveModal() {
			console.log("in savemodal");
		}
	},
	data(){
		const imagecopy={};
		return {imagecopy}
	},
	created(){
		this.imagecopy=this.$props.image
		console.log("image modal created datasource="+JSON.stringify(this.$props.datasources))
	},
	props: {
		action: {
			type: String,
			default: function() {
				return "Sample";
			}
		},
		image: {
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
		tags : {
			type: Object,
			default: function() {
				return {};
			}
		},
		datasources : {
			type: Object,
			default: function() {
				return {};
			}
		},
		filedlg:{
			type: Object,
			default: function() {
				return {};
			}
		}
	}
};
</script>
