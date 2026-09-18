import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from '../components/canvas/static/home/home.component';
import { AboutUsComponent } from '../components/canvas/static/about-us/about-us.component';
import { ContactUsComponent } from '../components/canvas/static/contact-us/contact-us.component';
import { OrderComponent } from '../components/canvas/order/order/order.component';
import { NoPageFoundComponent } from '../components/canvas/static/no-page-found/no-page-found.component';
import { AuthGuard, RoutingGuard } from '../modules/app-routing-guard';

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'home', component: HomeComponent },
  { path: 'about-us', component: AboutUsComponent },
  { path: 'contact-us', component: ContactUsComponent },
  { path: 'reservation', component: ContactUsComponent, canActivate: [AuthGuard, RoutingGuard] },
  { path: 'order', component: OrderComponent },
  { path: 'profile', component: ContactUsComponent, canActivate: [AuthGuard, RoutingGuard] },
  { path: 'order-history', component: ContactUsComponent, canActivate: [AuthGuard, RoutingGuard] },
  { path: 'deals-and-rewards', component: ContactUsComponent, canActivate: [AuthGuard, RoutingGuard] },
  { path: 'wallet', component: ContactUsComponent, canActivate: [AuthGuard, RoutingGuard] }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {


}
