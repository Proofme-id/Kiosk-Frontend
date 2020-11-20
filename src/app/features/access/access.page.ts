import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { TranslateService } from "@ngx-translate/core";
import { LanguageProvider } from "../../providers/language/languageProvider";
import { ConfigProvider } from "src/app/providers/config/configProvider";
import { BaseComponent } from "../base-component/base-component";
// import * as faceapi from "face-api.js";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
declare let faceapi: any;

@Component({
    templateUrl: "access.page.html",
    styleUrls: ["access.page.scss"]
})
export class AccessPageComponent extends BaseComponent implements OnInit {
    languages = [];
    pc = null;
    checkingVectors = false;
    error = -1;

    constructor(
        private translateService: TranslateService,
        private router: Router,
        private languageProvider: LanguageProvider,
        private configProvider: ConfigProvider,
    ) {
        super();
    }

    async ngOnInit(): Promise<void>{
        await this.configProvider.getConfig();
        this.languages = this.languageProvider.getLanguages();
        await faceapi.nets.ssdMobilenetv1.loadFromUri("/assets/models");
        await faceapi.nets.faceLandmark68Net.loadFromUri("assets/models");
        await faceapi.nets.faceRecognitionNet.loadFromUri("assets/models");
        // console.log(faceapi.nets);
        startVideo();


        function startVideo() {

            const constraints = {
                audio: false,
                video: {
                    width: { min: 360, ideal: 1024 },
                    height: { min: 360, ideal: 724 },
                    frameRate: { ideal: 30, max: 60 },
                },
            };

            navigator.mediaDevices.getUserMedia(constraints).then((stream: MediaStream) => {

                const video: HTMLMediaElement = document.getElementById("video") as HTMLMediaElement;
                video.srcObject = stream;

                video.addEventListener("play", () => {
                    setInterval(async () => {

                        await faceapi.detectSingleFace(video).withFaceLandmarks().withFaceDescriptor();

                    }, 1000)
                })
            }, (err) => {
                alert("Could not acquire media: " + err);
            })
        }
    }
}

