import { Injectable } from '@angular/core';
import { Router, ActivatedRouteSnapshot } from '@angular/router';
import { ConfigService } from '../services/shared_data/config.service';

@Injectable({
    providedIn: 'root',
})
export class AuthGuard {

    constructor(private router: Router) {
    }

    canActivate(): boolean {
        var bitSignedIn = 1;
        if (bitSignedIn == 0) {
            this.router.navigateByUrl("/order");
            return false;
        } else {
            return true;
        }
    }
}

@Injectable({
    providedIn: 'root',
})
export class RoutingGuard {
    objConfigService: any = {};

    constructor(private configService: ConfigService, private router: Router) {
        this.objConfigService = this.configService.objConfigData;
    }

    canActivate(activatedRouteSnapshot: ActivatedRouteSnapshot): boolean {
        var strPath = activatedRouteSnapshot.url.toString();
        return true;
    }
}
