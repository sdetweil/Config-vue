import Vue from 'vue';

import {
	modalController,
} from "@ionic/vue";

let counter=0;
export default {
	windowHandle: 0,
	UDPPlugin: 0,
	ReceiverPort: 8056,
	BROADCAST_ADDR: "192.168.2.255",
	MirrorRequest: "DISCOVER_MIRRORSERVER_REQUEST:",
	expectedResponse: "DISCOVER_MIRRORSERVER_RESPONSE:",
	amountReceived: 0,
	//counter: 0,
	serverAddress: "",
	timeoutHandle: 0,
	discoveryTimeout: 5000,
	UdpPlugin: 0,

	async findserverAddress(window, udp) {
		return new Promise((resolve, reject) => {
			try {
				const p = {
					persistent: false
				};
				this.UDPPlugin=udp

					console.log("udp key ="+JSON.stringify(udp))

				for(const k of Object.keys(window)){
					console.log("key ="+k)
				}
				window.networkinterface.getWiFiIPAddress((info) => {
					console.log("network ip="+info.ip)
					this.windowHandle = window;
					window.chrome.sockets.tcpServer.create(p,
						(createInfo) => {
							console.log("socket created");
							this.socketId = createInfo.socketId
							try {
								console.log("calling listen with socketId="+this.socketId);
								window.chrome.sockets.tcpServer.listen(this.socketId, info.ip, 0, 1,
									(result) => {
										console.log("get socket info=" + JSON.stringify(result));

										window.chrome.sockets.tcpServer.getInfo(this.socketId,
											(info) => {
												console.log("socket info =" + JSON.stringify(info));
												//this.port=info.localPort
												console.log("using port=" + info.localPort);
												const ha = (info) => {this.handleAccept(info)};
												console.log(" handleaccept function =" + ha);

												window.chrome.sockets.tcpServer.onAccept.addListener(ha);

												console.log('setup receive listener')
												consolelog("tcp methods =", Object.keys(window.chrome.sockets.tcp))
												console.log("onReceive methods=", Object.keys(window.chrome.sockets.tcp.onReceive) )
												window.chrome.sockets.tcp.onReceive.addListener((data, socketId1) => {
													this.recvListener(data, socketId1, resolve, reject, this)
												});
													console.log('setup receive error listener')
												window.chrome.sockets.tcp.onReceiveError.addListener(
													function (info) {
														console.log("socket error=" + JSON.stringify(info));
													}
												);

												//console.log("sockets="+JSON.stringify(.chrome.sockets));
												this.timeoutHandle = setTimeout(
													function () {
														// if we timed out,return null so caller can address the issue
														reject("timeout");
													},
													this.discoveryTimeout
												);
												for (let q = 0; q < 3; q++)
													this.sendTo(this.MirrorRequest + info.localPort, this.ReceiverPort, this.BROADCAST_ADDR);
											}
										)
									}
								)
							} catch (ex) {
								console.log("listen failed=" + ex);
							}
						}
					)
				})
				console.log("after create");
			} catch (ex) {
				console.log("sockets failure=" + ex);
			}
		})
	},

	handleAccept(info1) {
		console.log("in handle");
		if (++counter === 1) {
			console.log("accept socket="+JSON.stringify(info1));
			window.chrome.sockets.tcp.getInfo(info1.clientSocketId,
				(info2) => {
					this.serverAddress = info2.peerAddress;
					console.log("saving peer=" + this.serverAddress);

					window.chrome.sockets.tcp.setPaused(info1.clientSocketId, false);
				}, (error) =>{
						console.log("getinfo error ="+JSON.stringify(error));
				}
			)
		}
	},

	getserverAddress() {

		return new Promise((resolve, reject) => {
			console.log("in promise");
			// check if there is a file saved with the ip address in it
			// if so, use that
			// otherwise prompt the user
			try {
				const addressDialog = modalController.create('AddressModalPage', {});
				console.log("dialog created");
				addressDialog.onDidDismiss((updatedObject) => {
					// Do things with data coming from modal, for instance :
					if (updatedObject != undefined) {
						if (updatedObject.address != undefined) {
							console.log("the server address specified was " + updatedObject.address);
							resolve(updatedObject.address);
						} else
						if (updatedObject.action == 'delete')
							reject("delete");
						else
							reject();
					} else {
						console.log("return from dialog, no data")
						reject("user canceled dialog, no data");
					}
				})
				console.log("showing dialog");
				addressDialog.present();
			} catch (err) {
				console.log("dialog handler setup failed " + err);
				reject(null);
			}

		})
	},
	focusChanged(type) {
		console.log("startup focus changing=" + type);
	},

	loadData(server) {
		//const self = this
		this.data.ourserverAddress = server;
		this.data.reloadData(true,
			() => {
				console.log("back from reload");
				console.log("viewers=" + this.data.Viewers + " type=" + typeof this.data.Viewers);
				this.navCtrl.push('HomePage')
					.then(
						() => {
							console.log("new page loaded");
							// first we find the index of the current view controller:
							const index = this.viewCtrl.index;
							// then we remove it from the navigation stack
							this.navCtrl.remove(index);
							// this.navCtrl.setRoot(this.navCtrl.getActive().component);
						}
					);
			}
		);
	},


	/*
	 *
	 *		this is the response listener, gets the respondse from any server on our local network
	 *   informing us of server address and port to use for api requests
	 *
	 *	  @info     the data buffer received
	 */
	recvListener(info, socketId, resolve, reject, self) {

		// clear the timeout (we got response)
		clearTimeout(self.timeoutHandle);


		// get the size of the data

		self.amountReceived += info.data.byteLength;
		console.log("receive socket info =" + info.socketId + " size=" + info.data.byteLength + " amt rcv=" + self.amountReceived);
		// 84320 is size of body, but will be more from headers.
		// if its the size we expected (at least)
		if (self.amountReceived >= self.expectedResponse.length + 4) {
			try {
				console.log(" recv address="+self.serverAddress)
				// hm,. might be able to toString() here
				const arr = new Uint8Array(info.data);
				let textChunk = String.fromCharCode.apply(null, arr);

				console.log("data=" + typeof textChunk);
				// if we got data from conversion
				if (textChunk.length > 0) {
					// tostring it
					textChunk = textChunk.toString();
					console.log("data=" + textChunk);
					// check if its the right respose
					if (textChunk.substring(0, self.expectedResponse.length) === self.expectedResponse) {
						try {
							// get the port off the end of the string
							const portInfo = textChunk.substring(self.expectedResponse.length);
							// close the socket the server sent the response on
							window.chrome.sockets.tcp.close(socketId);
							// create the full server address & port string
							const serverAddress = self.serverAddress + ":" + portInfo;
							self.ReceiverPort = portInfo;
							console.log("server address=" + serverAddress);
							// return the address back to the caller.. should use promise here
							resolve(serverAddress)
						} catch (ex) {
							reject("error=" + ex);
						}
					} else
						reject("wrong message '" + textChunk.substring(0, self.expectedResponse.length) + "'='" + self.expectedResponse + "'");
				}
			} catch (ex) {
				reject("receve data error=" + ex);
			}
		}
	},
	stringToArrayBuffer(string) {
		// UTF-8
		const buf = new ArrayBuffer(string.length);
		const bufView = new Uint8Array(buf)
		for (let i = 0, strLen = string.length; i < strLen; i++) {
			bufView[i] = string.charCodeAt(i);
		}
		return buf;
	},

	/*
	 *
	 *	routine to send the broadcast message
	 *
	 *  @data the message content to send
	 *  @port the port to send it on (server listening on this UDP port)
	 *  @the broadcast address to use
	 *
	 */
	sendTo(data, port, addr, reject) {
		const p = {
			properties: {
				name: "SmartMirrorConfig",
				bufferSize: this.expectedResponse.length + 20
			}
		};
		console.log("setup to send udp")
		this.UDPPlugin.create(p).then(
				(info) => {
					console.log("udp socket created");
					this.UDPPlugin.bind({ socketId: info.socketId, port: port}).then(()=>{
						console.log("udp bind complete")
						this.UDPPlugin.setBroadcast({
							socketId: info.socketId,
							enabled: true
							}).then( ()=>{
							console.log("udp broadcast set");
							this.UDPPlugin.send({
								socketId: info.socketId,
								address: addr,
								port: port,
								buffer:btoa(data)
							}).then(()=>{console.log("udp message sent");
							});
						})
					})
				})
	}
				//let info = await UdpPlugin.create();
        //await UdpPlugin.bind({ socketId: info.socketId, port: 5500})
        //await UdpPlugin.send({ socketId: info.socketId, address: targetAddress, port: 6000, buffer: UdpPluginUtils.bufferToString(data)}) })

}