import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { PageEvent } from '@angular/material/paginator';

import { Problem } from '../problem.model';
import { ProblemsService } from '../problems.service';
import { AuthService } from '../../auth/auth.service';


@Component({
  templateUrl: './unsolved-problem-list.component.html',
  styleUrls: ['./unsolved-problem-list.component.css'],
})
export class UnsolvedProblemListComponent implements OnInit, OnDestroy {
  searchText = '';
  problems: Problem[] = [];
  isLoading = false;
  userId: string;
  totalProbs = 0;
  rowsPerPage = 10;
  currentPage = 1;
  pageSizeOptions = [5, 10, 20, 50];
  userIsAuthenticated = false;
  private problemsSub: Subscription;
  private authStatusSub: Subscription;

  constructor(
    public problemsService: ProblemsService,
    private authService: AuthService
  ) {
  }

  ngOnInit() {
    this.isLoading = true;
    this.problemsService.getUnsolvedProblems(this.rowsPerPage, this.currentPage);
    this.userId = this.authService.getUserId();
    this.problemsSub = this.problemsService
      .getProblemUpdateListner()
      .subscribe((problemData: { problems: Problem[]; probCount: number }) => {
        this.isLoading = false;
        this.totalProbs = problemData.probCount;
        this.problems = problemData.problems;
        this.userId = this.authService.getUserId();
      });
    this.userIsAuthenticated = this.authService.getIsAuth();
    this.authStatusSub = this.authService
      .getAuthStatusListener()
      .subscribe((isAuthenticated) => {
        this.userIsAuthenticated = isAuthenticated;
        this.userId = this.authService.getUserId();
      });
  }

  ngOnDestroy() {
    this.problemsSub.unsubscribe();
    this.authStatusSub.unsubscribe();

  }

  onDelete(problemId: string) {
    this.isLoading = true;
    this.problemsService.deleteProblem(problemId).subscribe(() => {
      this.problemsService.getUnsolvedProblems(this.rowsPerPage, this.currentPage);
    }, () => {
      this.isLoading = false;
    });
  }

  onChangedPage(pageData: PageEvent) {
    this.isLoading = true;
    this.currentPage = pageData.pageIndex + 1;
    this.rowsPerPage = pageData.pageSize;
    this.problemsService.getUnsolvedProblems(this.rowsPerPage, this.currentPage);
  }

  onSearch(event) {
    console.log(this.searchText);
    this.currentPage = 1;
    // this.rowsPerPage = pageData.pageSize;
    this.problemsService.getUnsolvedProblems(this.rowsPerPage, this.currentPage);
  }
}
