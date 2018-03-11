import { Injectable, EventEmitter } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { Userdata } from '../models/userdata';
import { Router } from '@angular/router';
import { Observable } from "rxjs";
import { AdministrationService } from './administration.service';
import { VerkaufsburoEinstellungenService } from './verkaufsburo-einstellungen.service';
import { VerkaufsburoSpcService } from './verkaufsburo-spc.service';
import { UnternehmenService } from './unternehmen.service';

import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

@Injectable()
export class AuthenticationServiceService {

  authChanged: EventEmitter<any> = new EventEmitter();

  updatename: EventEmitter<any> = new EventEmitter();

  constructor(
    private _http: Http, private router: Router,
    private adminservice: AdministrationService,
    private VerkaufsburoEinstellungenService: VerkaufsburoEinstellungenService,
    private VerkaufsburoSpcService: VerkaufsburoSpcService,
    private UnternehmenService: UnternehmenService
  ) {

    this.token = JSON.parse(localStorage.getItem('token'));
    this.userdata = JSON.parse(localStorage.getItem('userdata'));
  }

  token: string;
  userdata: Userdata;


  login_auth(body: object): Observable<any> {
    var authHeader = new Headers();
    authHeader.append('Content-Type', 'application/json');

    return this._http.post('https://public.futures-services.com:3000/api/authenticate', JSON.stringify(body), { headers: authHeader }).map((response: Response) => {
      let local_data = response.json();
      if (local_data.success) {
        // set token property

        this.token = local_data.token;
        // store username and jwt token in local storage to keep user logged in between page refreshes
        localStorage.setItem('token', JSON.stringify(local_data.token));
        this.userdetails_auth();

        // return true to indicate successful login
        return local_data;
      } else {
        this.logout_auth();
        // return false to indicate failed login
        return local_data;
      }
    }).catch(e => {
      if (e.status === 401) {
        this.router.navigate(['/login']);
        return Observable.throw('Unauthorized');
      }
      // do any other checking for statuses here
    });


  }


  logout_auth(): Observable<any> {
      var authHeader = new Headers();
      authHeader.append('Authorization', this.token);
      authHeader.append('Content-Type', 'application/json');
          return this._http.get('https://public.futures-services.com:3000/api/logout_auth', { headers: authHeader }).map((response: Response) => {
            let local_data = response.json();
            if (local_data.success) {
              this.token = null;
              this.userdata = null;
              localStorage.removeItem('token');
              localStorage.removeItem('userdata');
              this.authChanged.emit(false);
              this.adminservice.masterdata_local = null;
              this.adminservice.emailList_local = null;
              this.VerkaufsburoEinstellungenService.einstellungen_local = null;
              this.VerkaufsburoSpcService.deliveryzones_local = null;
              this.VerkaufsburoSpcService.einstellungen_from_spc_service_local = null;
              this.VerkaufsburoSpcService.ocmdata_local = null;
              this.VerkaufsburoSpcService.verkaufsburos_local = null;
              this.VerkaufsburoSpcService.sidemenu_local = null;
              this.UnternehmenService.unternehmens_local=null;
              this.router.navigate(['/login']);
            }
          });
      }



      logout_auth_loginpage() {
                this.token = null;
                this.userdata = null;
                localStorage.removeItem('token');
                localStorage.removeItem('userdata');
                this.authChanged.emit(false);
                this.adminservice.masterdata_local = null;
                this.adminservice.emailList_local = null;
                this.VerkaufsburoEinstellungenService.einstellungen_local = null;
                this.VerkaufsburoSpcService.deliveryzones_local = null;
                this.VerkaufsburoSpcService.einstellungen_from_spc_service_local = null;
                this.VerkaufsburoSpcService.ocmdata_local = null;
                this.VerkaufsburoSpcService.verkaufsburos_local = null;
                this.VerkaufsburoSpcService.sidemenu_local = null;
                this.UnternehmenService.unternehmens_local=null;
         }



  userdetails_auth(): Observable<any> {
    var authHeader = new Headers();
    authHeader.append('Authorization', this.token);
    return this._http.get('https://public.futures-services.com:3000/api/memberinfo', { headers: authHeader }).map((response: Response) => {
      let local_data = response.json();
      if (local_data.success) {
        // set token property
        this.userdata = local_data.userdata;
        this.authChanged.emit(true);
        this.updatename.emit(this.userdata.FirstName + ' ' + this.userdata.LastName);
        if (this.userdata.LastName == '') {
          this.router.navigate(['/userinfo']);

        }
        else {
          this.router.navigate(['/preisrechner']);
        }
        // store username and jwt token in local storage to keep user logged in between page refreshes
        localStorage.setItem('userdata', JSON.stringify(local_data.userdata));

        // return true to indicate successful login
        return true;
      } else {
        this.logout_auth();
        // return false to indicate failed login
        return false;
      }
    }).catch(e => {
      if (e.status === 401) {
        this.router.navigate(['/login']);
        return Observable.throw('Unauthorized');
      }
      // do any other checking for statuses here
    });
  }




  firstimelogin(body): Observable<any> {
    var authHeader = new Headers();
    authHeader.append('Content-Type', 'application/json');
    authHeader.append('Authorization', this.token);
    return this._http.post('https://public.futures-services.com:3000/api/firsttimelogin', JSON.stringify(body), { headers: authHeader }).map((response: Response) => {
      let local_data = response.json();
      if (local_data.success) {
        // set token property
        this.userdata = local_data.userdata;
        this.authChanged.emit(true);
        this.updatename.emit(this.userdata.FirstName + ' ' + this.userdata.LastName);
        if (this.userdata.LastName == '') {
          this.router.navigate(['/userinfo']);

        }
        else if (this.userdata.Role == "Master" || this.userdata.Role == "Administrator") {
          this.router.navigate(['/administration']);
        }
        else if (this.supervisor_user_auth()) {
          this.router.navigate(['/verkaufsburo']);

        } else {
          this.router.navigate(['/preisrechner']);
        }
        // store username and jwt token in local storage to keep user logged in between page refreshes
        localStorage.setItem('userdata', JSON.stringify(local_data.userdata));

        // return true to indicate successful login
        return true;
      } else {
        this.logout_auth();
        // return false to indicate failed login
        return false;
      }
    }).catch(e => {
      if (e.status === 401) {
        this.router.navigate(['/login']);
        return Observable.throw('Unauthorized');
      }
      // do any other checking for statuses here
    });
  }


  clickforgotpassfromlogin() {
    this.token = null;
    this.userdata = null;
    localStorage.removeItem('token');
    localStorage.removeItem('userdata');
    this.authChanged.emit(false);
    this.adminservice.masterdata_local = null;
    this.adminservice.emailList_local = null;
    this.VerkaufsburoEinstellungenService.einstellungen_local = null;
    this.VerkaufsburoSpcService.deliveryzones_local = null;
    this.VerkaufsburoSpcService.einstellungen_from_spc_service_local = null;
    this.VerkaufsburoSpcService.ocmdata_local = null;
    this.VerkaufsburoSpcService.verkaufsburos_local = null;
    this.VerkaufsburoSpcService.sidemenu_local = null;
    this.UnternehmenService.unternehmens_local=null;
    this.router.navigate(['/forgotpassword']);
  }

  afterforgotemailsucess() {
    this.router.navigate(['/login']);

  }


  forgotpassword(body) {

    var authHeader = new Headers();
    authHeader.append('Content-Type', 'application/json');
    authHeader.append('Authorization', this.token);
    return this._http.post('https://public.futures-services.com:3000/api/forgotpassword', JSON.stringify(body), { headers: authHeader }).map((response: Response) => {
      let local_data = response.json();
      if (local_data.success) {
        return true;
      } else {

        return false;
      }
    }).catch(e => {
      if (e.status === 401) {
        this.router.navigate(['/login']);
        return Observable.throw('Unauthorized');
      }
      // do any other checking for statuses here
    });


  }





  isLoggedIn() {
    if (localStorage.getItem('token')) {
      this.authChanged.emit(true);
    }
    else {

      this.authChanged.emit(false);
      this.router.navigate(['/login']);
    }
    return this.token != null;
  }


  master_user_auth() {
    return this.userdata.Role === 'Master';
  }

  userinfo() {
    if (this.userdata.LastName == '') {
      return true;
    }
    else {
      return false;
    }

  }

  admin_user_auth() {
    return this.userdata.Role === 'Administrator';
  }

  supervisor_user_auth() {
    return this.userdata.Role === 'Supervisor';
  }

  sales_user_auth() {
    return this.userdata.Role === 'Verkäufer';
  }

}
