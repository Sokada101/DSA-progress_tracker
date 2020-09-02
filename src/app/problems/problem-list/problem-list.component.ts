import { Component,OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { PageEvent } from '@angular/material/paginator';

import { Problem } from '../problem.model';
import { ProblemsService } from '../problems.service';
import { AuthService } from '../../auth/auth.service';


@Component({
  selector: 'app-problem-list',
  templateUrl: './problem-list.component.html',
  styleUrls: ['./problem-list.component.css'],
})
export class ProblemListComponent implements OnInit, OnDestroy {
  searchText  = "";
  problems: Problem[] = [];
  isLoading = false;
  userId: string;
  totalProbs = 0;
  rowsPerPage = 10;
  currentPage = 1;
  pageSizeOptions = [5, 10, 20, 50 ,100];
  userIsAuthenticated = false;
  private problemsSub: Subscription;
  private authStatusSub: Subscription;

  constructor(
    public problemsService: ProblemsService,
    private authService: AuthService,
  ) {}

  ngOnInit() {
    this.isLoading = true;
    this.problemsService.getProblems(this.rowsPerPage, this.currentPage, this.searchText);
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
      this.problemsService.getProblems(this.rowsPerPage, this.currentPage, this.searchText);
    }, () => {
      this.isLoading = false;
    });
  }

  onChangedPage(pageData: PageEvent) {
    this.isLoading = true;
    this.currentPage = pageData.pageIndex + 1;
    this.rowsPerPage = pageData.pageSize;
    this.problemsService.getProblems(this.rowsPerPage, this.currentPage, this.searchText);
  }

  onSearch(event) {
    this.currentPage = 1;
    // this.rowsPerPage = pageData.pageSize;
    this.problemsService.getProblems(this.rowsPerPage, this.currentPage, this.searchText);
  }
}
