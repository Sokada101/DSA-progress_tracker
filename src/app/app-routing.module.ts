import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { ProblemListComponent } from './problems/problem-list/problem-list.component';
import { ProblemCreateComponent } from './problems/problem-create/problem-create.component';
import { SplashComponent } from './splash/splash.component';
import { AuthGuard } from './auth/auth.guard';
import { UnsolvedProblemListComponent } from './problems/unsolved-problem-list/unsolved-problem-list.component';
import { SolvedProblemListComponent } from './problems/solved-problem-list/solved-problem-list.component';
import { NotFoundComponent } from './notfound/notfound.component';



const routes: Routes = [
  { path: '', component: SplashComponent },
  { path: 'problems/all', component: ProblemListComponent },
  { path: 'problems/unsolved', component: UnsolvedProblemListComponent },
  { path: 'problems/solved', component: SolvedProblemListComponent },
  {
    path: 'create',
    component: ProblemCreateComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'edit/:probId',
    component: ProblemCreateComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'auth',
    loadChildren: () => import('./auth/auth.module').then((m) => m.AuthModule),
  },
  { path: '404', component: NotFoundComponent },
  { path: '**', redirectTo: '/404' },
];

@NgModule({
    imports: [ RouterModule.forRoot(routes) ],
    exports: [ RouterModule ],
    providers: [AuthGuard]
})

export class AppRoutingModule {}