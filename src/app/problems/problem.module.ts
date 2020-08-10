import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ProblemCreateComponent } from './problem-create/problem-create.component';
import { ProblemListComponent } from './problem-list/problem-list.component';
import { SolvedProblemListComponent } from "./solved-problem-list/solved-problem-list.component";
import { UnsolvedProblemListComponent } from "./unsolved-problem-list/unsolved-problem-list.component";
import { AngularMaterialModule } from '../angular-material.module';
import { RouterModule } from '@angular/router';

@NgModule({
  declarations: [
      ProblemCreateComponent, 
      ProblemListComponent,
      SolvedProblemListComponent,
      UnsolvedProblemListComponent
    ],
    imports: [
        CommonModule,
        AngularMaterialModule,
        RouterModule,
    ],
})

export class ProblemsModule {}