import Vue from 'vue';

import axios from 'axios';
import { Plugins } from "@capacitor/core";
const { Storage } = Plugins;


export default {
	ourTypes: [],
	async setServerAddress(newaddress) {
		return new Promise((resolve)=>{
			Storage.set({
              key: "server_ip",
              value: newaddress
            }).then(()=>{
							resolve()
      });
		})
	},

	async getServerAddress() {
		return new Promise((resolve,reject) =>{
			Storage.get({ key: "server_ip" }).then((address1)=>{
				if(address1.value !== null) {
					console.log("get server address returing "+address1.value)
					resolve(address1.value)
				}
				else {
					console.log("get server address returing no saved server address")
					reject(null)
				}
			},(error)=>{
				console.log("storage service failed ="+JSON.stringify(error))
				reject(null)
			})
		});
	},

	setTypes(types) {
		this.ourTypes = types
	},
	async reloadData() {
		return new Promise((resolve) => {
			const promises = []
			const serverdata = {}
			const headers = {
				'Content-Type': 'application/json;charset=UTF-8',
				"Access-Control-Allow-Origin": "*",
			};
			this.getServerAddress().then((serveraddress)=>{
				for (const t of this.ourTypes) {
					promises.push(axios.get('http://' + serveraddress + '/' + t.toLowerCase(), headers))
				}
				console.log("in reload data")
				Promise.all(promises)
					.then( (values) => {
						for (const i in this.ourTypes) {
							//console.log(" promises all values="+JSON.stringify(values[i].data))
							serverdata[this.ourTypes[i]] = values[i].data
						}
						console.log("serverdata="+JSON.stringify(serverdata))
						resolve(serverdata)
					}, (error)=>{
						console.log("data loading error ="+JSON.stringify(error))
				})
			})
		})
	},

	async dodelete(object, type) {
		return new Promise((resolve, reject) => {
			this.getServerAddress().then((serveraddress)=>{
				const urlstring = "http://" + serveraddress + "/" + type + "s?id=" + object._id;

				console.log("delete of " + type + "=" + object.Name + "\n url=" + urlstring + "\ndata=" + JSON.stringify(object));
				axios.delete(urlstring, {}, {})
					.then(
						(response) => {
							if (response.status == 200) {
								console.log("item deleted");
								this.doRefresh(false)
									.then(data => {
										resolve(data);
									});
								//$ionicLoading.hide();
							} else {
								reject("item delete failed rc=" + response.status);
							}
						}, (error) => {
							reject("delete request failed=" + error);
						}
					);
				})
		});
	},


	doRefresh(refresh, ) {
		return new Promise((resolve, reject) => {
			console.log('Begin async operation');
			try {
				if (refresh)
					this.reloadData()
					.then(data => {
						resolve(data);
					});
			} catch (ex) {
				reject("refresh ionic failed=" + ex);
			}
		})
	},


	updateaddsuccess(response, object, type, refresh) {
		//alert("success hide and refresh status="+JSON.stringify(response));
		//var status=response.status;

		switch (response.status) {
		case 201:
			if (this.modaltype == 'add')
				object._id = response.data;
			console.log("object added, id=" + response.data);
			break;
		case 200:
			if (refresh) {
				//this.modal[type].hide();
				this.doRefresh(true);
			}
			break;
		default:
		}
	},


	doFresh(refresher) {
		this.reloadData(true,
			function (error) {
				refresher.complete();
				console.log(error)
			}
		);
	},


	async getFiles(urlstring) {
		return new Promise((resolve) => {
			this.getServerAddress().then((serveraddress)=>{
				const u = 'http://' + serveraddress + '/files?' + encodeURI(urlstring);
				console.log("file url=" + u);
				axios.get(u)
					.then(res => {
						console.log("file list retrieved size=" + res.data.length);
						resolve(res.data);
					})
			})
		});
	},


	async saveModal(operation, type, obj, files) {
		this.modaltype = operation;
		let objectvar = obj;
		//alert("save");
		this.getServerAddress().then((serveraddress)=>{
			const urlstring = "http://" + serveraddress + "/" + type + 's';
			let results
			console.log("in data savemodal, type=" + type + " operation=" + operation);
			switch (type) {
			case 'viewer':
				objectvar = obj.data;
				delete objectvar.TagNames
				break;
			case 'datasource':
				objectvar = obj.data;
				break;
			case 'tag':
				objectvar = obj.data;
				break;
			case 'image':
				objectvar = obj.data;
				delete objectvar.TagNames
				delete objectvar.DataSourceName;

				console.log("there are " + files.length + " entries in file list + for image=" + JSON.stringify(objectvar));

				results = this.getAddsandDeletes(objectvar, files)

				if (Object.prototype.hasOwnProperty.call(objectvar, "PathFromSource")) {
						const urlstring = "http://" + serveraddress + "/images";
						console.log("setting new path for image");
						if (results.value !== "")
							objectvar.PathFromSource = results.value;

						if (operation === 'edit') {
							// now handle and object add/deletes
							results.addedImages.forEach(
								function (ia) {
									//alert("adding image entry="+ia.Name);
									console.log("will add a record=" + ia.Name);
									this.add_update_delete('add', urlstring, ia, 'image', false);
								}
							)
							results.deletedImages.forEach(
								function (ia) {
									//alert("removing image entry="+ia.Name);
									console.log("will delete a record=" + ia.Name);
									this.add_update_delete('delete', urlstring, ia, 'image', false);
								}
							)
						}
						break;
				} else {
					objectvar.Root = results.value;
				}
				return;
			default:
				console.log('unexpected type=' + type + ' in save modal dialog');
				break;
			}
			console.log("will " + operation + " a record=" + obj.data.Name);
			this.addUpdateDelete(operation, urlstring, obj.data, type, true);
		})
	},


	addUpdateDelete(action, urlstring, object, type, refresh) {
		const jobject = JSON.parse(JSON.stringify(object));
		delete jobject["$$hashKey"];
		const jsonstring = JSON.stringify(jobject);
		const headers = {
			'Content-Type': 'application/json;charset=UTF-8',
      "Access-Control-Allow-Origin": "*",
		};
		console.log("would " + action + " url=" + urlstring + " data=" + jsonstring);
		//return;
		switch (action) {
			// add a new record
		case 'add':
			console.log("add object url=" + urlstring + "\njson-data=" + jsonstring);
			//axios.setDataSerializer('json');
			axios.post(urlstring, jobject, headers)
				.then((response) => {
					console.log("add completed");
					this.updateadd_success(response, object, type, refresh)
				})
				.catch((err) => {
					console.log("http post error=" + JSON.stringify(err))
				});
			break;

			// update existing record
		case 'edit':
			console.log("update object url=" + urlstring + "?id=" + object._id + "\njson-data=" + jsonstring);
			//axios.setDataSerializer('json');
			axios.put(urlstring + "?id=" + object._id, jobject, headers)
				.then(response => {
					this.updateadd_success(response, object, type, refresh);
				})
				.catch((err) => {
					console.log("http put error=" + JSON.stringify(err))
				});
			break;

			// delete existing record
		default:
			console.log("deleting object url=" + urlstring + "?id=" + object._id);
			axios.delete(urlstring + "?id=" + object._id, {}, {})
				.then(response => {
					this.updateadd_success(response, object, type, refresh)
				});
			break;
		}
	},



	getAddsandDeletes(v, Files) {
		const result = {
			value: "",
			addedImages: [],
			deletedImages: []
		};

		console.log("calculating adds and deletes");
		let counter = 0;
		let newname = v.PathFromSource;
		console.log("a =" + newname);
		while (newname.includes("*"))
			newname = newname.substring(0, newname.lastIndexOf("*"));

		console.log("b =" + newname);
		result.value = newname;
		// v points to current row in the images database list
		// loop thru all the individual files from the file selection list
		console.log("there are " + Files.length + " entries to process");
		for (const row of Files) {
			//var row=Files[i];
			// if the user selected a folder to be used for this image object
			if (row.selected == true && row.filetype == 'Folder' && row.name !== '..') {
				result.value = row.name;
				console.log("folder for datasource");
				break;
			}
			// if this is a FILE
			else if (row.filetype == 'File') {
				console.log("have a file entry " + row.name);
				let add = true;
				for (const IMAGE of this.Images) {
					//var IMAGE= this.Images[q];
					//console.log("checking if "+IMAGE.PathFromSource+" matches "+row.name);
					if (IMAGE.PathFromSource.endsWith(row.name)) {
						// this file was in the list, so don't add
						add = false;
						// this image was in the list before
						// but not currently selected
						// console.log("have a file entry "+row.name+" selected="+JSON.stringify(row));
						if (!row.selected) {
							result.deletedImages.push(IMAGE);
							console.log("requesting delete for image=" + IMAGE.Name);
							break;
						}
					}
				}
				// if this file list file was NOT in the image list already
				if (add) {
					// AND this row IS selected
					if (row.selected) {
						//console.log("add checking row="+row.name);
						// save it to be added
						const io = {
							Name: "",
							PathFromSource: "",
							DataSource: "",
							Tags: "",
							Description: ""
						}
						const i = 0
						// make sure we haven't generated name collisions
						nameloop: while (i == 0) {
							io.Name = v.Name + (++counter);
							for (const ki of this.Images) {
								if (ki.Name == io.Name)
									continue nameloop;
							}
							break;
						}

						//console.log("file row="+JSON.stringify(row));

						io.PathFromSource = newname + row.name;
						io.DataSource = v.DataSource;
						io.Tags = v.Tags;
						io.Description = v.Descripion;
						console.log("requesting add for image=" + io.Name + " for selection=" + v.Name);
						result.addedImages.push(io);
					}
				}
			}
		}
		// update database  info and viewed images list
		return result;
	}

}