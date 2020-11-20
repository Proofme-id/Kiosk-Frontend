// import { Component, OnInit, AfterViewInit, NgZone, OnDestroy } from "@angular/core";
// import { BaseComponent } from "../base-component/base-component";
// import { Router } from "@angular/router";
// import { CameraPreview, CameraPreviewPictureOptions, CameraPreviewOptions } from "@ionic-native/camera-preview/ngx";
// import { CredentialStateFacade } from "src/app/state/credential/credential.facade";
// import { Platform } from "@ionic/angular";
// import { AppStateFacade } from "src/app/state/app/app.facade";
// import { Plugins } from "@capacitor/core";
// // import * as faceapi from "face-api.js";

// declare let faceapi: any;

// const { CameraPreviewCapacitor } = Plugins;


// @Component({
//     templateUrl: "camera.page.html",
//     styleUrls: ["camera.page.scss"]
// })
// export class CameraPage extends BaseComponent implements OnInit, AfterViewInit, OnDestroy {

//     checkingVectors = false;
//     // -1 = no error
//     // 0 = unknown error
//     // 1 = no face found
//     error = -1;
//     doneLoadingModels = false;
//     cameraOpen = false;

//     constructor(
//         private router: Router,
//         private cameraPreview: CameraPreview,
//         private credentialStateFacade: CredentialStateFacade,
//         private platform: Platform,
//         private appStateFacade: AppStateFacade,
//         private ngZone: NgZone
//     ) {
//         super();
//     }

//     async ngAfterViewInit(): Promise<void> {
//         await faceapi.loadSsdMobilenetv1Model("/assets/facemodels");
//         await faceapi.loadFaceLandmarkModel("/assets/facemodels");
//         await faceapi.loadFaceRecognitionModel("/assets/facemodels");
//         this.openCamera();
//     }

//     ngOnInit(): void {
//         //do nothing
//     }

//     ngOnDestroy(): void {
//         if (this.platform.is("android")) {
//             this.cameraPreview.stopCamera();
//         } else if (this.platform.is("ios")) {
//             CameraPreviewCapacitor.stop();
//         }
//     }

//     backButton(): void {
//         if (this.platform.is("android")) {
//             this.cameraPreview.stopCamera().then(() => {
//                 this.router.navigate(["credentials/biometrics"]);
//             });
//         } else if (this.platform.is("ios")) {
//             CameraPreviewCapacitor.stop();
//             this.router.navigate(["credentials/biometrics"]);
//         }
//     }

//     openCamera(): void {
//         console.log("openCamera!");
//         const cameraPreviewOpts: CameraPreviewOptions = {
//             width: window.innerWidth,
//             height: window.innerHeight - 90,
//             camera: "front",
//             toBack: true,
//             tapPhoto: false,
//             tapFocus: true,
//             previewDrag: false,
//             alpha: 1
//         };

//         if (this.platform.is("android")) {
//             this.cameraPreview.startCamera(cameraPreviewOpts).then(() => {
//                 this.doneLoadingModels = true;
//                 this.cameraOpen = true;
//             });
//         } else if (this.platform.is("ios")) {
//             CameraPreviewCapacitor.start();
//             this.doneLoadingModels = true;
//             this.cameraOpen = true;
//         }
//     }

//     async takePicture(): Promise<void> {
//         if (!this.checkingVectors && this.doneLoadingModels) {
//             console.log("takePicture");
//             this.ngZone.run(() => {
//                 this.cameraOpen = false;
//                 this.error = -1;
//                 this.checkingVectors = true;
//             });

//             if (this.platform.is("android")) {
//                 const pictureOpts: CameraPreviewPictureOptions = {
//                     width: window.innerWidth,
//                     height: window.innerHeight - 90,
//                     quality: 90
//                 };
//                 this.cameraPreview.takePicture(pictureOpts).then(async (imageData) => {
//                     const picture = "data:image/jpeg;base64," + imageData;
//                     try {
//                         const image = new Image();
//                         image.src = picture;
//                         this.cameraPreview.stopCamera();
//                         this.processPicture(image);
//                     } catch (error) {
//                         console.error("detectFaceLandmarks ERROR:", error);
//                         this.ngZone.run(() => {
//                             this.checkingVectors = false;
//                             this.error = 0;
//                         });
//                     }
//                 }, (err: unknown) => {
//                     console.log("takePicture error:", err);
//                     this.ngZone.run(() => {
//                         this.checkingVectors = false;
//                         this.error = 0;
//                     });
//                 });
//             } else if (this.platform.is("ios")) {
//                 try {
//                     const result = await CameraPreviewCapacitor.capture();
//                     const base64PictureData = "data:image/jpeg;base64," + result.value;
//                     const image = new Image();
//                     image.src = base64PictureData;
//                     CameraPreviewCapacitor.stop();
//                     this.processPicture(image);
//                 } catch (error) {
//                     console.error("CameraPreviewCapacitor ERROR:", error);
//                     this.ngZone.run(() => {
//                         this.checkingVectors = false;
//                         this.error = 0;
//                     });
//                 }
//             }
//         } else {
//             console.log("already checking vectors, ignore it");
//         }
//     }

//     cancel(): void {
//         this.router.navigate(["credentials/biometrics"]);
//     }

//     retry(): void {
//         this.checkingVectors = false;
//         this.error = -1;
//         this.openCamera();
//     }

//     async processPicture(image: HTMLImageElement): Promise<void> {
//         const faceApiVectorResult = await faceapi.detectSingleFace(image).withFaceLandmarks().withFaceDescriptor();
//         console.log("faceApiVectorResult:", faceApiVectorResult);
//         if (!faceApiVectorResult || !faceApiVectorResult.descriptor) {
//             this.error = 1;
//             this.checkingVectors = false;
//         } else {
//             const vectors: string[] = Object.values(faceApiVectorResult.descriptor);
//             console.log("vectors:", JSON.stringify(vectors));
//             this.credentialStateFacade.setFaceVectors(vectors);
//             this.router.navigate(["credentials/biometrics"]);
//         }
//     }
// }
