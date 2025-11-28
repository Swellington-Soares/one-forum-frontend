import { Routes } from '@angular/router';
import { Profile } from './pages/profile/profile';
import { Home } from './pages/home/home';

export const routes: Routes = [
    {
        path: "",
        component: Home,
        title: "Home"
    },
    {
        path: 'profile/:id',
        component: Profile,
        title: 'Profile'
    }
];
