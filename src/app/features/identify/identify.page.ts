// import {Component, ElementRef, NgZone, OnDestroy, OnInit, ViewChild} from "@angular/core";
// import { FormGroup } from "@angular/forms";
// import { AppStateFacade } from "src/app/state/app/app.facade";
// import { Router } from "@angular/router";
// import * as QRCode from "qrcode";
// import { UserStateFacade } from "src/app/state/user/user.facade";
// import { ConfigProvider } from "../../providers/config/configProvider";
// import { detect } from "detect-browser";
// import { ClaimHolder } from "../../smartcontracts/ClaimHolder";

// const browser = detect();
// import Web3 from "@smilo-platform/web3-web";
// import { HttpClient } from "@angular/common/http";
// import * as crypto from "crypto";

// @Component({
//     templateUrl: "identify.page.html",
//     styleUrls: ["identify.page.scss"]
// })
// export class IdentifyPageComponent implements OnInit, OnDestroy {
//     form: FormGroup;
//     uuid: string = null;
//     mobileLoginUrl: string = null;
//     public identifySuccess = false;
//     public identity = null;
//     identifyType = null;
//     public connectionSuccess = false;
//     public waitingMenu = false;

//     selectedDemo = "idin";

//     @ViewChild("qrCodeCanvas", {static: false})
//     qrCodeCanvas: ElementRef;

//     authUrl = null; // Authentication server
//     signalingWS = null; // Authentication server

//     web3Url = null;
//     web3Node = null;

//     peerConnection = null;
//     wsClient = null;
//     dataChannel = null;

//     signedOnInCorrect = false;
//     userSignatureInCorrect = false;
//     serverSignatureInCorrect = false;
//     invalidTrustedIssuer = false;

//     constructor(
//         private appStateFacade: AppStateFacade,
//         private router: Router,
//         private userStateFacade: UserStateFacade,
//         private configProvider: ConfigProvider,
//         private ngZone: NgZone,
//         private http: HttpClient
//     ) {
//         this.appStateFacade.setPageTitle("Identification Demo");
//         this.userStateFacade.logout();
//         this.authUrl = configProvider.getAuthUrl();
//         this.signalingWS = configProvider.getSignalingWS();
//         this.web3Url = configProvider.getWeb3Url();
//         this.web3Node = new Web3(`${this.web3Url}`);
//     }

//     ngOnDestroy() {
//         this.userStateFacade.logout();
//         this.connectionSuccess = false;
//         this.identifySuccess = false;
//         this.identity = null;
//         this.identifyType = null;
//         this.uuid = null;
//     }

//     ngOnInit() {
//         this.connectionSuccess = false;
//         this.identifySuccess = false;
//         this.identity = null;
//         this.identifyType = null;
//         this.uuid = null;
//         this.launchWebsocketClient();
//     }

//     getRTCConfig() {
//         const secret = "proofme.id";
//         const time = Math.floor(Date.now() / 1000);
//         const expiration = 8400;
//         const username = time + expiration;
//         console.log("Username: " + username);
//         const credential = crypto.createHmac("sha1", secret).update(username.toString()).digest("base64");
//         // console.log('Password: ', credential);
//         return {
//             iceServers: [{
//                 urls: ["turn:51.89.104.5:3478"],
//                 credential,
//                 username
//             }]
//         };
//     }

//     async launchWebsocketClient() {
//         const RTCSessionDescription = require("wrtc").RTCSessionDescription;
//         const RTCIceCandidate = require("wrtc").RTCIceCandidate;

//         const W3CWebSocket = require("websocket").w3cwebsocket;
//         this.wsClient = await new W3CWebSocket(this.signalingWS);

//         this.wsClient.onerror = (error => {
//             console.log("Error: " + error.toString());
//         });

//         this.wsClient.onclose = (close => {
//                 console.log("echo-protocol Connection Closed");
//         });

//         this.wsClient.onopen = (ws => {
//             console.log("WebSocket Client Connected");
//         });

//         this.wsClient.onmessage = (async msg => {
//             if (msg.data) {
//                 console.log("Received: " + msg.data);

//                 let data;

//                 // accepting only JSON messages
//                 try {
//                     data = JSON.parse(msg.data);
//                 } catch (e) {
//                     console.log("ERROR: Invalid JSON");
//                     data = {};
//                 }
//                 const {type, message, success, host, uuid, offer, answer, candidate} = data;
//                 // console.log('================ INCOMING ==========');
//                 // console.log('Type: ', type);
//                 // console.log('message: ', message);
//                 // console.log('success: ', success);
//                 // console.log('host: ', host);
//                 // console.log('uuid: ', uuid);
//                 // console.log('offer: ', offer);
//                 // console.log('answer: ', answer);
//                 // console.log('candidate: ', candidate);
//                 // console.log('================ LET\'S PARSE ==========');

//                 switch (type) {
//                     case "error":
//                         // On an error
//                         console.log("ERROR: ", message);
//                         break;
//                     case "connect":
//                         // When connected to the Signaling service
//                         if (!success) {
//                             console.log("ERROR: Wow.. That is weird... I got a response but no success...");
//                         } else {
//                             //
//                             console.log("Successful connected");
//                             await setupHost(this.wsClient);
//                         }
//                         break;
//                     case "connected":
//                         // When a Client connects to an host
//                         if (!success) {
//                             console.log("ERROR: Wow.. That is weird... I got a response but no success...");
//                         } else {
//                             //
//                             console.log("Successful connected with client ", uuid);
//                             this.uuid = uuid;
//                             await sendOffer(this.peerConnection, this.wsClient);
//                         }
//                         break;
//                     case "offer":
//                         // On receiving an response from my offer
//                         if (!success) {
//                             console.log("ERROR: Failed to send an offer :( ...");
//                         } else {
//                             //
//                             console.log("Successful offered... Exciting!! Waiting for an answer..");
//                         }
//                         break;
//                     case "host":
//                         // Response when switching from client to host
//                         if (!success) {
//                             console.log("ERROR: could not create Host.");
//                         } else {
//                             //
//                             console.log("Successful initialised");
//                             console.log("Host: " + uuid);
//                             console.log("Waiting for user to connect to " + uuid);
//                             await this.generateQRCode(uuid);
//                             this.mobileLoginUrl = "diduxio://didux.io/p2p?uuid=" + uuid;
//                             await this.setupPeerconnection(this.wsClient, uuid);
//                         }
//                         break;
//                     case "leave":
//                         // Response when switching from client to host
//                         console.log("Successful initialised");
//                         console.log("Host: " + uuid);
//                         console.log("Waiting for user to connect to " + uuid);
//                         await this.generateQRCode(uuid);
//                         this.mobileLoginUrl = "diduxio://didux.io/p2p?uuid=" + uuid;
//                         await this.setupPeerconnection(this.wsClient, uuid);

//                         break;
//                     case "answer":
//                         // On receiving an response from my answer
//                         if (!success) {
//                             console.log("ERROR: Failed to receive an answer :( ...");
//                         } else {
//                             //
//                             console.log("Successful received an answer... Exciting!!");
//                             await this.peerConnection.setRemoteDescription(new RTCSessionDescription(answer));
//                         }
//                         break;
//                     case "candidate":
//                         // On receiving an candidate from the client
//                         if (!success) {
//                             console.log("ERROR: Failed to send an candidate :( ...");
//                         } else {
//                             //
//                             console.log("Successful candidate... Exciting!!");
//                             const clientCandidate = new RTCIceCandidate(candidate);
//                             await this.peerConnection.addIceCandidate(clientCandidate);
//                         }
//                         break;
//                     default:
//                         // The default
//                         console.log("ERROR: Could not parse message!");
//                         break;
//                 }
//             }
//         });

//         async function setupHost(wsClient) {
//             // Switching from Client to Host
//             wsClient.send(JSON.stringify({type: "host"}));
//         }

//         async function sendOffer(peerConnection, wsClient) {
//             // Start to generate an offer
//             console.log("Generate + sending offer.");

//             const offer = await peerConnection.createOffer();
//             await peerConnection.setLocalDescription(offer);
//             console.log("Offer: ", offer);

//             wsClient.send(JSON.stringify({
//                 type: "offer",
//                 offer
//             }));
//         }
//     }

//     async setupPeerconnection(ws, uuid) {

//         const RTCPeerConnection = require("wrtc").RTCPeerConnection;

//         this.peerConnection = new RTCPeerConnection(this.getRTCConfig());
//         this.dataChannel = await this.peerConnection.createDataChannel(uuid);

//         this.peerConnection.addEventListener("datachannel", event => {
//             event.channel.onmessage = (async eventMessage => {
//                 console.log("DataChannel Event:", eventMessage.data);

//                 let data;

//                 // accepting only JSON messages
//                 try {
//                     data = JSON.parse(eventMessage.data);
//                 } catch (e) {
//                     console.log("ERROR: Invalid JSON");
//                     data = {};
//                 }
//                 const { action, message, token, credentials } = data;

//                 switch (action) {
//                     // when a user tries to login
//                     case "disconnect":
//                         // On errors
//                         console.log("Disconnecting");
//                         // this.disconnected();
//                         this.disconnect();
//                         break;
//                     case "identify":
//                         const now = new Date();
//                         if (!credentials) {
//                             this.remoteDisconnect();
//                             return;
//                         }
//                         const then =  new Date(credentials.signedOn);
//                         const minutesDifference = this.calculateMinutesDifference(now, then);
//                         // Check if the timestamp is in the time range
//                         if (minutesDifference <= 5) {
//                             const recoveredAddress = this.web3Node.eth.accounts.recover(JSON.stringify(credentials.credential), credentials.proof.signature);
//                             console.log("credentials.credential:", credentials.credential);
//                             console.log("recoveredAddress:", recoveredAddress);
//                             const userSignatureResult = this.anyUserCredentialSignatureWrong(credentials.credential, recoveredAddress);
//                             // Check if the user (Identity App) did sign it correct
//                             if (userSignatureResult) {
//                                 // Check if the sent credentials were provided by the did of the credential (check the signature of each credential)
//                                 const issuerSignaturesResult = this.anyServerCredentialSignatureWrong(credentials.credential);
//                                 console.log("issuerSignaturesResult:", issuerSignaturesResult);
//                                 if (issuerSignaturesResult) {
//                                     console.log("Identify credentials:", credentials);
//                                     // Check every credential DID contract if the holder belongs to that DID
//                                     const didContractKeyResult = await this.anyDidContractKeyWrong(credentials.credential);
//                                     if (didContractKeyResult) {
//                                         // So all good, check identification
//                                         this.checkIdentification(credentials);
//                                     } else {
//                                         this.ngZone.run(() => {
//                                             this.identifySuccess = false;
//                                             this.invalidTrustedIssuer = true;
//                                         });
//                                     }
//                                 } else {
//                                     this.ngZone.run(() => {
//                                         this.identifySuccess = false;
//                                         this.serverSignatureInCorrect = true;
//                                     });
//                                 }
//                             } else {
//                                 this.ngZone.run(() => {
//                                     this.identifySuccess = false;
//                                     this.userSignatureInCorrect = true;
//                                 });
//                             }
//                         } else {
//                             this.ngZone.run(() => {
//                                 this.identifySuccess = false;
//                                 this.signedOnInCorrect = true;
//                             });
//                         }
//                         break;
//                     default:
//                         console.log("Unknown action: " + action);
//                 }
//             });

//             event.channel.onopen = (eventMessage) => {
//                 console.log("DataChannel open");
//                 this.ngZone.run(() => {
//                     this.connectionSuccess = true;
//                     this.doIdentifyRequest();
//                 });
//             };
//         });

//         this.peerConnection.addEventListener("connectionstatechange", event => {
//             console.log("**************** Connection state changed!!!");
//             console.log("**************** Connection state: ", this.peerConnection.connectionState);
//             if (this.peerConnection.connectionState === "connected") {
//                 console.log("**************** Connected");
//             }
//         });

//         this.peerConnection.addEventListener("icecandidate", async event => {
//             if (event.candidate) {
//                 console.log("**************** Received candidate over peer, sending to signaller");
//                 console.log("Candidate", event.candidate);
//                 try {
//                     const candidate = new RTCIceCandidate(event.candidate);
//                     await this.peerConnection.addIceCandidate(candidate);
//                 } catch (e) {
//                     console.log("ooops", e);
//                 }

//                 ws.send(JSON.stringify({type: "candidate", candidate: event.candidate}));
//             }
//         });

//         this.peerConnection.addEventListener("iceconnectionstatechange", event => {
//             console.log("**************** IceConnection state changed!!!");
//             console.log("**************** IceConnection state: ", this.peerConnection.iceConnectionState);
//             if (this.peerConnection.iceConnectionState === "disconnected") {
//                 // this.disconnected();
//                 ws.send(JSON.stringify({ type: "leave" }));
//             }
//         });
//     }

//     anyUserCredentialSignatureWrong(credentials: any, recoveredAddress: string) {
//         for (const key in credentials) {
//             if (credentials.hasOwnProperty(key)) {
//                 const value = credentials[key];
//                 const credentialHolderKey = value.id.split(":")[2];
//                 if (credentialHolderKey !== recoveredAddress) {
//                     return false;
//                 }
//             }
//         }
//         return true;
//     }

//     anyServerCredentialSignatureWrong(credentials: any) {
//         for (const key in credentials) {
//             if (credentials.hasOwnProperty(key)) {
//                 const value = credentials[key];
//                 const serverSignature = value.proof.signature;
//                 const credentialServerKey = value.proof.holder;
//                 const messageWithoutProof = JSON.parse(JSON.stringify(value));
//                 delete messageWithoutProof.proof;
//                 const recoveredAddress = this.web3Node.eth.accounts.recover(JSON.stringify(messageWithoutProof), serverSignature);
//                 if (credentialServerKey !== recoveredAddress) {
//                     return false;
//                 }
//             }
//         }
//         return true;
//     }

//     async anyDidContractKeyWrong(credentials: any) {
//         const knownAddresses = [];
//         for (const key in credentials) {
//             if (credentials.hasOwnProperty(key)) {
//                 const value = credentials[key];
//                 const didContractAddress = value.issuer.id.split(":")[2];
//                 const holderKey = value.proof.holder;
//                 const sha3Key = this.getSha3Key(holderKey);
//                 const web3 = new Web3("https://api.didux.network/");
//                 const keyManagerContract = new web3.eth.Contract(
//                     ClaimHolder.abi,
//                     didContractAddress
//                 );
//                 if (!this.knownAddressesContains(knownAddresses, sha3Key, didContractAddress)) {
//                     const keyPurpose = parseInt(await this.getKeyPurpose(keyManagerContract, sha3Key), 10);
//                     if (keyPurpose !== 3) {
//                         return false;
//                     }
//                     knownAddresses.push({sha3Key, didContractAddress});
//                 }
//             }
//         }
//         return true;
//     }

//     knownAddressesContains(list: any[], sha3Key: string, didContractAddress: string) {
//         for (const listItem of list) {
//             if (listItem.sha3Key === sha3Key && listItem.didContractAddress === didContractAddress) {
//                 return true;
//             }
//         }
//     }

//     getSha3Key(key: string) {
//         return this.web3Node.utils.keccak256(key);
//     }

//     async getKeyPurpose(keyManagerContract: any, key: string): Promise<string> {
//         // Get Events
//         if (keyManagerContract.options.address === null) {
//             return Promise.resolve("-1");
//         } else {
//             console.log("keyManagerContract getKeyPurpose:", key);
//             return await keyManagerContract.methods.getKeyPurpose(key).call();
//         }
//     }

//     calculateMinutesDifference(dt2: Date, dt1: Date)  {
//         let diff = (dt2.getTime() - dt1.getTime()) / 1000;
//         diff /= 60;
//         return Math.abs(Math.round(diff));
//     }

//     async generateQRCode(uuid: string) {
//         const canvas = this.qrCodeCanvas.nativeElement as HTMLCanvasElement;
//         // tslint:disable-next-line: max-line-length
//         QRCode.toCanvas(canvas, "p2p:" + uuid, {
//             width: 210
//         });
//         console.log("Challenge QR code displayed");
//     }

//     async remoteDisconnectShowClose() {
//         if (this.dataChannel.readyState === "open") {
//             this.dataChannel.send(JSON.stringify({action: "disconnect-show-close"}));
//         }
//         await this.wsClient.close();
//         await this.peerConnection.close();
//     }

//     remoteDisconnect(): void {
//         if (this.dataChannel.readyState === "open") {
//             this.dataChannel.send(JSON.stringify({action: "disconnect"}));
//         }
//         this.disconnect();
//     }

//     async disconnect() {
//         this.ngZone.run(() => {
//             this.connectionSuccess = false;
//             this.uuid = null;
//             this.identifySuccess = false;
//             this.identity = null;
//             this.identifyType = null;
//             this.waitingMenu = false;
//             this.signedOnInCorrect = false;
//             this.userSignatureInCorrect = false;
//             this.serverSignatureInCorrect = false;
//             this.invalidTrustedIssuer = false;
//         });
//         await this.wsClient.close();
//         await this.peerConnection.close();
//         await this.launchWebsocketClient();
//     }

//     doIdentifyRequest(): void {
//         console.log("Request Identity");
//         this.waitingMenu = true;
//         if (this.selectedDemo === "idin") {
//             const timestamp = new Date();
//             const credentials = {
//                 credentials: [
//                     { key: "INITIALS", provider: "IDIN", name: "Initialen" },
//                     { key: "LAST_NAME_PREFERRED", provider: "IDIN", name: "Achternaam" },
//                     { key: "STREET", provider: "IDIN", name: "Straatnaam" },
//                     { key: "HOUSE_NUMBER", provider: "IDIN", name: "Huisnummer" },
//                     { key: "POSTAL_CODE", provider: "IDIN", name: "Postcode" },
//                     { key: "CITY", provider: "IDIN", name: "Stad" },
//                     { key: "COUNTRY_CODE", provider: "IDIN", name: "Land" },
//                     { key: "OLDER_THAN_18", provider: "IDIN", name: "Ouder dan 18" },
//                     { key: "GENDER", provider: "IDIN", name: "Geslacht" }
//                 ],
//                 by: "ProofMe.ID Demo",
//                 description: "Identification demo"
//             };
//             this.dataChannel.send(JSON.stringify({ action: "identify", request: credentials, type: "idin", timestamp }));
//         } else if (this.selectedDemo === "epass") {
//             const timestamp = new Date();
//             const credentials = {
//                 credentials: [
//                     { key: "FIRST_NAME", provider: "EPASS", name: "Voornaam" },
//                     { key: "LAST_NAME", provider: "EPASS", name: "Achternaam" },
//                     { key: "GENDER", provider: "EPASS", name: "Geslacht" },
//                     { key: "OLDER_THAN_18", provider: "EPASS", name: "Ouder dan 18" },
//                     { key: "PHOTO", provider: "EPASS", name: "Foto" }
//                 ],
//                 by: "ProofMe.ID Demo",
//                 description: "Identification demo"
//             };
//             this.dataChannel.send(JSON.stringify({ action: "identify", request: credentials, type: "epass", timestamp }));
//         }
//     }

//     async checkIdentification(identification) {
//         if (identification) {
//             this.ngZone.run(() => {
//                 this.identifySuccess = true;
//                 this.waitingMenu = false;
//                 this.identity = identification.credential;
//                 this.identifyType = identification.identifyType;
//             });
//             this.remoteDisconnectShowClose();
//         } else {
//             this.disconnect();
//             // this.ngZone.run(() => {
//             //     this.identifySuccess = false;
//             //     this.identity = 'MISSING'; // Show error?
//             //     this.waitingMenu = false;
//             //     this.identifyType = identification.identifyType;
//             // });
//         }
//     }

//     selectDemo(demoType: string): void {
//         this.selectedDemo = demoType;
//     }
// }