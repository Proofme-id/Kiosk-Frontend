import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { TranslateService } from "@ngx-translate/core";
import { LanguageProvider } from "../../providers/language/languageProvider";
import { ConfigProvider } from "src/app/providers/config/configProvider";
import { BaseComponent } from "../base-component/base-component";

@Component({
    templateUrl: "identification.page.html",
    styleUrls: ["identification.page.scss"],
})
export class IdentificationPageComponent extends BaseComponent implements OnInit {
    languages = [];
    pc = null;

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
    }
}




