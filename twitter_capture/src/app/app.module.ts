import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { HttpModule } from "@angular/http";
import { AppComponent } from "./app.component";
import { firebaseConfig } from "environments/firebaseConfig";
import { AngularFireModule } from 'angularfire2';
import { AngularFireDatabaseModule } from 'angularfire2/database';
import { AngularFireAuthModule } from 'angularfire2/auth';
import { AlertModule } from "ngx-bootstrap";
import { Routes, RouterModule } from "@angular/router";
import { HomeComponent } from "./home.component";
import { AdminComponent } from "./admin.component";

const routes: Routes = [
    { path: 'home', component: HomeComponent },
    { path: 'admin', component: AdminComponent },
    { path: '', component: HomeComponent }
];

@NgModule({
    declarations: [
        AppComponent,
        AdminComponent,
        HomeComponent
    ],
    imports: [
        BrowserModule,
        FormsModule,
        ReactiveFormsModule,
        HttpModule,
        AlertModule.forRoot(),
        AngularFireModule.initializeApp(firebaseConfig),
        AngularFireDatabaseModule,
        AngularFireAuthModule,
        RouterModule.forRoot(routes)
    ],
    providers: [],
    bootstrap: [AppComponent]
})
export class AppModule {
}
