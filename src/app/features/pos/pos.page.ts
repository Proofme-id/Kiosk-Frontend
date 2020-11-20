import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { TranslateService } from "@ngx-translate/core";
import { LanguageProvider } from "../../providers/language/languageProvider";
import { ConfigProvider } from "src/app/providers/config/configProvider";
import { BaseComponent } from "../base-component/base-component";

interface Iproduct {
    amount: number,
    name: string,
    price: number
}

interface Ireceipt {
    products: Iproduct[],
    price: number
    amount: number,
}

@Component({
    templateUrl: "pos.page.html",
    styleUrls: ["pos.page.scss"],
    
})
export class PosPageComponent extends BaseComponent implements OnInit {
    languages = [];
    pc = null;
    receipt: Ireceipt = { products: [], price: 0, amount:0 };

    constructor(
        private translateService: TranslateService,
        private router: Router,
        private languageProvider: LanguageProvider,
        private configProvider: ConfigProvider,
    ) {
        super();
    }
    
    async ngOnInit(): Promise<void> {
        await this.configProvider.getConfig();
        this.languages = this.languageProvider.getLanguages();

        const constraints = {
            audio: false,
            video: {
                width: { min: 360, ideal: 1024 },
                height: { min: 360, ideal: 724 },
                frameRate: { ideal: 30, max: 60 },
            },
        };

        navigator.mediaDevices.getUserMedia(constraints).then((stream: MediaStream) => {
            const video: HTMLMediaElement =  document.getElementById("video") as HTMLMediaElement;
            video.srcObject = stream;
        }, (err) => {
            alert("Could not acquire media: " + err);
        });

    }

    public addProductToReceipt(amount: number, name: string, price: number): void {
        const product = { amount, name, price } as Iproduct;
        this.receipt.products.push(product);
        this.receipt.price += product.price;
        this.receipt.amount += product.amount;
        console.log(this.receipt);
    }
}

