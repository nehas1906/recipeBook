import { Component } from '@angular/core';
import { AuthService } from './auth/auth.service';
import * as fromApp from './store/app.reducer';
import * as AuthActions from './auth/store/auth.actions';
import { Store } from '@ngrx/store';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'recipeBookAngular';
  constructor(private authService: AuthService, private store: Store<fromApp.AppState>,) { }

  ngOnInit() {
    this.store.dispatch(new AuthActions.AutoLogin());
  }

}
