import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { HasJwtTokenDefinedGuard } from "./guards/has-jwt-token-defined.guard";

const routes: Routes = [
    {
        path: "",
        redirectTo: "/main",
        pathMatch: "full",
    },
    {
        path: "main",
        loadChildren: "./features/main/main.module#MainPageModule"
    },
    {
        path: "login",
        loadChildren: "./features/login/login.module#LoginPageModule"
    },
    {
        path: "registrate",
        loadChildren: "./features/registrate/registrate.module#RegistratePageModule"
    },
    {
        path: "terms",
        loadChildren: "./features/terms/terms.module#TermsPageModule"
    },
    {
        path: "privacy",
        loadChildren: "./features/privacy/privacy.module#PrivacyPageModule"
    },
    {
        path: "registrate-finish",
        loadChildren: "./features/registrate-finish/registrate-finish.module#RegistrateFinishPageModule"
    },
    {
        path: "faq",
        loadChildren: "./features/test_faq/faq.module#FaqPageModule"
    },
    {
        path: "access",
        loadChildren: "./features/access/access.module#AccessPageModule"
    },
    {
        path: "pos",
        loadChildren: "./features/pos/pos.module#PosPageModule"
    },
    {
        path: "identification",
        loadChildren: "./features/identification/identification.module#IdentificationPageModule"
    },
    {
        path: "home",
        loadChildren: "./features/home/home.module#HomePageModule",
        canActivate: [HasJwtTokenDefinedGuard]
    }
];

@NgModule({
    imports: [RouterModule.forRoot(routes, { scrollPositionRestoration: "top" })],
    exports: [RouterModule]
})
export class AppRoutingModule { }
