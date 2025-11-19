import { Routes } from '@angular/router';
import { Profile } from './profile/profile';

export const routes: Routes = [
    {
        path: 'profile',
        component: Profile,
        title: 'Profile'
    }
];
