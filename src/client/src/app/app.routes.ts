import { Routes } from '@angular/router';
import { MessagesComponent } from './components/messages.component';

export const routes: Routes = [
  { path: '', component: MessagesComponent },
  { path: 'messages', component: MessagesComponent }
];
