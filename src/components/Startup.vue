<template>
	<!--
  Generated template for the StartupPage page.

  See http://ionicframework.com/docs/components/#navigation for more info on
  Ionic pages and navigation.
-->
	<ion-header
		(ionFocus)="focusChanged('focus')"
		(ionBlur)="focusChanged('blur')"
	>
		<ion-navbar>
			<ion-title> Mirror Discovery</ion-title>
		</ion-navbar>
	</ion-header>

	<ion-content padding>
		<div class="center">Mirror Discovery in progress, please wait...</div>
	</ion-content>
</template>
<script>
import { IonContent, IonHeader, IonTitle, IonNavBar } from "@ionic/vue";

import NetworkServices from "./services/networkservice.js";

export default {
	name: "Slide",
	components: {
		IonContent,
		IonHeader,
		IonTitle,
		IonNavBar
	},
	//its: ["changepage"],

	methods: {},

	props: {}
};
</script>
