import {
  Component,
  ComponentFactoryResolver,
  OnInit,
  ViewChild,
} from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { Observable, Subscription } from 'rxjs';
import { Store } from '@ngrx/store';
import { AuthService, AuthResponseData } from './auth.service';
import { AlertComponent } from '../shared/alert/alert.component';
import { PlaceholderDirective } from '../shared/placeholder/placeholder.directive';
import * as fromApp from '../store/app.reducer';
import * as AuthActions from './store/auth.actions';


@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css'],
})


export class AuthComponent implements OnInit {
  constructor(
    private componentFactoryResolver: ComponentFactoryResolver,
    private authService: AuthService,
    private store: Store<fromApp.AppState>
  ) { }
  isLoginMode = true;
  error: any = null;
  isLoading = false;
  @ViewChild(PlaceholderDirective, { static: false })
  alertHost!: PlaceholderDirective;
  private closeSub!: Subscription;
  private storeSub: Subscription;
  ngOnInit() {
    this.storeSub = this.store.select('auth').subscribe((authState) => {
      this.isLoading = authState.loading;
      this.error = authState.authError;
      if (this.error) {
        this.showErrorAlert(this.error);
      }
    });
  }

  onSwitchMode() {
    this.isLoginMode = !this.isLoginMode;
  }
  // onSubmit(form: NgForm) {
  //   if (!form.valid) {
  //     return;
  //   }
  //   const email = form.value.email;
  //   const password = form.value.password;

  //   let authObs: Observable<AuthResponseData>;

  //   this.isLoading = true;

  //   if (this.isLoginMode) {
  //     // authObs = this.authService.login(email, password);
  //     this.store.dispatch(
  //       new AuthActions.LoginStart({ email: email, password: password })
  //     );
  //   } else {
  //     authObs = this.authService.signup(email, password);
  //   }

  //   // authObs.subscribe(
  //   //   (resData) => {
  //   //     console.log(resData);
  //   //     this.isLoading = false;
  //   //     this.router.navigate(['/recipes']);
  //   //   },
  //   //   (errorMessage) => {
  //   //     console.log(errorMessage);
  //   //     this.error = errorMessage;
  //   //     this.showErrorAlert(errorMessage);
  //   //     this.isLoading = false;
  //   //   }
  //   // );

  //   form.reset();
  //   // console.log("working");

  //   // if (!form.valid) {
  //   //   return;
  //   // }
  //   // const email = form.value.email;
  //   // const password = form.value.password;

  //   // this.isLoading = true;
  //   // if (this.isLoginMode) {
  //   //   // ...
  //   // } else {
  //   //   this.authService.signup(email, password).subscribe(
  //   //     resData => {
  //   //       console.log(resData);
  //   //      this.isLoading = false;
  //   //     },
  //   //     errorMessage => {
  //   //       console.log(errorMessage);
  //   //       this.error = errorMessage;
  //   //       this.isLoading = false;
  //   //     }
  //   //   );
  //   // }

  //   // form.reset();
  // }
  onSubmit(form: NgForm) {
    if (!form.valid) {
      return;
    }
    const email = form.value.email;
    const password = form.value.password;

    let authObs: Observable<AuthResponseData>;

    this.isLoading = true;

    if (this.isLoginMode) {
      // authObs = this.authService.login(email, password);
      this.store.dispatch(
        new AuthActions.LoginStart({ email: email, password: password })
      );
    } else {
      this.store.dispatch(
        new AuthActions.SignupStart({ email: email, password: password })
      );
    }

    // authObs.subscribe(
    //   resData => {
    //     console.log(resData);
    //     this.isLoading = false;
    //     this.router.navigate(['/recipes']);
    //   },
    //   errorMessage => {
    //     console.log(errorMessage);
    //     this.error = errorMessage;
    //     this.showErrorAlert(errorMessage);
    //     this.isLoading = false;
    //   }
    // );

    form.reset();
  }

  onHandleError() {
    this.store.dispatch(new AuthActions.ClearError());
  }
  private showErrorAlert(message: string) {
    // const alertCmp = new AlertComponent();
    const alertCmpFactory = this.componentFactoryResolver.resolveComponentFactory(
      AlertComponent
    );
    const hostViewContainerRef = this.alertHost.viewContainerRef;
    hostViewContainerRef.clear();

    const componentRef = hostViewContainerRef.createComponent(alertCmpFactory);

    componentRef.instance.message = message;
    this.closeSub = componentRef.instance.close.subscribe(() => {
      this.closeSub.unsubscribe();
      hostViewContainerRef.clear();
    });
  }
  ngOnDestroy() {
    if (this.closeSub) {
      this.closeSub.unsubscribe();
    }
  }
}
