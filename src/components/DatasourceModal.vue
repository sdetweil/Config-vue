<template>
	<!--
		Generated template for the DataSourceModalPage page.

		See http://ionicframework.com/docs/components/#navigation for more info on
		Ionic pages and navigation.
		-->
	<ion-header>
		<ion-title>{{ action }} DataSource</ion-title>
	</ion-header>

	<ion-content padding>
		<ion-grid>
			<ion-row>
				<ion-col col-2>
					<label for="vname" width="10">Name:</label>
				</ion-col>
				<ion-col col-8 class=" dashed-border">
					<ion-input
						v-model="datasourcecopy.Name"
						type="text"
						id="vname"
						align="left"
						class="dashed-border"
					></ion-input>
				</ion-col>
			</ion-row>
			<ion-row>
				<ion-col col-2>
					<label for="vdescription">Description:</label>
				</ion-col>
				<ion-col col-8 class=" dashed-border">
					<ion-input
						v-model="datasourcecopy.Description"
						type="text"
						id="vdescription"
						align="left"
						class="dashed-border"
					>
					</ion-input>
				</ion-col>
			</ion-row>
			<ion-row>
				<ion-col col-2>
					<label for="vtypes"> Type:</label>
				</ion-col>
				<ion-col class=" dashed-border">
					<ion-select
						style="max-width:70%;"
						id="vtypes"
						v-model="datasourcecopy.Type"
						okText="Okay"
						cancelText="Dismiss"
						compareWith="checkSelectedSource"
					>
						<ion-select-option
							v-for="(type, i) in types"
							:key="i"
							value="type"
							>{{ type }}</ion-select-option
						>
					</ion-select>
				</ion-col>
			</ion-row>
			<ion-row>
				<ion-col col-2>
					<label for="vactive"> Active:</label>
				</ion-col>
				<ion-col col-2>
					<ion-checkbox
						id="vactive"
						@input="datasourcecopy.Active = $event.target.value"
						:value="datasourcecopy.Active"
					></ion-checkbox>
				</ion-col>
			</ion-row>
			<ion-row
				@dblTap="doubleClick(thisdatasource,true)"
				@press="doubleClick(thisdatasource,true)"
			>
				<ion-col col-2>
					<label for="vroot"> Root:</label>
				</ion-col>
				<ion-col col-10>
					<span id="vroot" class="dashed-border">{{
						datasourcecopy.Root
					}}</span>
				</ion-col>
			</ion-row>
		</ion-grid>
	</ion-content>
	<ion-footer>
		<ion-row>
			<ion-col col-2>
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
	IonTitle,
	IonGrid,
	IonRow,
	IonCol,
	IonSelect,
	IonSelectOption,
	IonContent,
	IonFooter,
	IonHeader,
	IonInput,
	IonIcon,
	IonCheckbox
} from "@ionic/vue";

export default {
	components: {
		IonTitle,
		IonGrid,
		IonRow,
		IonCol,
		IonSelect,
		IonSelectOption,
		IonContent,
		IonFooter,
		IonHeader,
		IonInput,
		IonIcon,
		IonCheckbox
	},
	name: "DatasourceModal",
	methods: {
		checkSelectedSource(tag1, tag2){
			console.log('check source, comparing '+tag1+' with '+tag2)
			return tag1==tag2;
		},
		closeModal() {
			console.log("in closemodal");
		},
		saveModal() {
			console.log("in savemodal");
		}
	},
	data() {
		const datasourcecopy = {};
		return { datasourcecopy };
	},
	created() {
		this.datasourcecopy = this.$props.datasource;
	},
	props: {
		action: {
			type: String,
			default: function() {
				return "Sample";
			}
		},
		datasource: {
			type: Object,
			default: function() {
				return {};
			}
		},
		parent: {
			type: Object,
			default: function() {
				return {};
			}
		},
		filedlg: {
			type: Object,
			default: function() {
				return {};
			}
		},
		types: {
			type: Array,
			default: function() {
				return [];
			}
		}
	}
};
</script>
