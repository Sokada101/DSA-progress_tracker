import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { NgForm } from '@angular/forms';

import { ProblemsService } from '../problems.service';
import { Problem } from '../problem.model';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/auth/auth.service';

@Component({
  selector: 'app-problem-create',
  templateUrl: './problem-create.component.html',
  styleUrls: ['./problem-create.component.css']
})

export class ProblemCreateComponent implements OnInit, OnDestroy {
  source = '';
  title = '';
  link = '';
  reasons = '';
  solved = '';
  default = true;
  solvedOrNot = null;
  problem: Problem;
  isLoading = false;
  private mode = 'create';
  private probId: string;
  private authStatusSub: Subscription;

  constructor(
    public problemsService: ProblemsService,
    public route: ActivatedRoute,
    private authService: AuthService,
  ) {
  }

  ngOnInit() {
    this.authStatusSub = this.authService
      .getAuthStatusListener()
      .subscribe((authStatus) => {
        this.isLoading = false;
      });

    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      if (paramMap.has('probId')) {
        this.mode = 'edit';
        this.probId = paramMap.get('probId');
        this.isLoading = true;
        this.problemsService.getProblem(this.probId).subscribe(problemData => {
          this.isLoading = false;
          this.problem = {
            id: problemData._id,
            source: problemData.source,
            title: problemData.title,
            link: problemData.link,
            reasons: problemData.reasons,
            solved: problemData.solved,
            creator: problemData.creator
          };
        });

      } else {
        this.mode = 'create';
        this.probId = '';
      }
    });
  }

  handleChange(e) {
    this.solved = e.value;
    if (!this.solved) {
      return false;
    }

    if (this.solved === 'true') {

      this.solvedOrNot = true;

    } else {

      this.solvedOrNot = false;
      this.default = false;
    }
  };

  onSaveProblem(form: NgForm) {
    if (form.invalid) {
      return;
    }
    this.isLoading = true;
    if (this.mode === 'create') {
      this.problemsService.addProblem(form.value.source, form.value.title, form.value.link, form.value.reasons, form.value.solved);
    } else {
      if (this.solvedOrNot) {
        form.value.reasons = '';
      }
      this.problemsService.updateProblem(
        this.probId,
        form.value.source,
        form.value.title,
        form.value.link,
        form.value.reasons,
        form.value.solved
      );
    }
    form.resetForm();
    this.default = true;
  }

  ngOnDestroy() {
    this.authStatusSub.unsubscribe();
  }

}
