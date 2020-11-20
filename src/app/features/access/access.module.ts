import { NgModule } from "@angular/core";
import { AccessPageComponent } from "./access.page";
import { Routes, RouterModule } from "@angular/router";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { TranslateModule } from "@ngx-translate/core";
import { CommonModule } from "@angular/common";
import { FontAwesomeModule } from "@fortawesome/angular-fontawesome";
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { ComponentsModule } from "src/app/components/components.module";
import { NgxSelectModule } from "ngx-select-ex";
import { LanguageProvider } from "../../providers/language/languageProvider";
import {WebcamModule} from "ngx-webcam";

const routes: Routes = [
    {
        path: "",
        component: AccessPageComponent
    }
];

@NgModule({
    imports: [
        TranslateModule,
        RouterModule.forChild(routes),
        ReactiveFormsModule,
        CommonModule,
        FormsModule,
        FontAwesomeModule,
        NgbModule,
        ComponentsModule,
        NgxSelectModule,
        WebcamModule
    ],
    declarations: [
        AccessPageComponent
    ],
    providers: [
        LanguageProvider
    ]
})
export class AccessPageModule {

}
