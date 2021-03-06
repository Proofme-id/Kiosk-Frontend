import { Injectable } from "@angular/core";
import { CanActivate, Router } from "@angular/router";
import { take } from "rxjs/operators";
import { UserStateFacade } from "../state/user/user.facade";

@Injectable()
export class HasJwtTokenDefinedGuard implements CanActivate {
    constructor(
        private router: Router,
        private userStateFacade: UserStateFacade
    ) {}

    async canActivate(): Promise<boolean> {
        const token = await this.userStateFacade.accessToken$.pipe(take(1)).toPromise();
        if (!token) {
            this.router.navigate(["login"]);
        }
        return !!token;
    }
}
