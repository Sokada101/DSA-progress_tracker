import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http'; 
import { Location } from '@angular/common'; 
import { map } from 'rxjs/operators';
import { Router } from "@angular/router";

import { environment } from '../../environments/environment';

import { Problem } from './problem.model';

const BACKEND_URL = environment.apiUrl + '/problems/';

@Injectable({ providedIn: 'root'})
export class ProblemsService {
    private problems: Problem[] = [];
    private problemsUpdated = new Subject< {problems: Problem[], probCount: number }>();

    constructor(private http: HttpClient, private router: Router, private _location: Location) {
    }

    getProblem (id: string) {
        return this.http.get<{
            _id: string, source: string,title: string, reasons: string, solved: string, creator: string }>(
             BACKEND_URL + id
            );
    }

    getProblems(rowsPerPage: number, currentPage: number) {
      const queryParams = `?pagesize=${rowsPerPage}&page=${currentPage}`;
      this.http
      .get<{message: string; problems: any, maxProbs: number}>( BACKEND_URL + queryParams)
      .pipe(
          map((probData) => { 
          return {problems: probData.problems.map(prob => {
              return {
                  id: prob._id,
                  source: prob.source,
                  title: prob.title,
                  reasons: prob.reasons,
                  solved: prob.solved,
                  creator: prob.creator
              };
          }), maxProbs: probData.maxProbs};
      }))
      .subscribe((transformedProbData) => {
          
          this.problems = transformedProbData.problems;
          this.problemsUpdated.next({
            problems: [...this.problems],
            probCount: transformedProbData.maxProbs
          });
      });
    };

    getUnsolvedProblems(rowsPerPage: number, currentPage: number) {
        const queryParams = `?pagesize=${rowsPerPage}&page=${currentPage}`;
        this.http
            .get<{ message: string; problems: any, maxProbs: number }>(BACKEND_URL + "unsolved/" + queryParams)
            .pipe(
                map((probData) => {
                    return {
                        problems: probData.problems.map(prob => {
                            return {
                                id: prob._id,
                                source: prob.source,
                                title: prob.title,
                                reasons: prob.reasons,
                                solved: prob.solved,
                                creator: prob.creator
                            };
                        }), maxProbs: probData.maxProbs
                    };
                }))
            .subscribe((transformedProbData) => {
                this.problems = transformedProbData.problems;
                this.problemsUpdated.next({
                    problems: [...this.problems],
                    probCount: transformedProbData.maxProbs
                });
            });
    };

    getSolvedProblems(rowsPerPage: number, currentPage: number) {
        const queryParams = `?pagesize=${rowsPerPage}&page=${currentPage}`;
        this.http
            .get<{ message: string; problems: any, maxProbs: number }>(BACKEND_URL + "solved/" + queryParams)
            .pipe(
                map((probData) => {
                    return {
                        problems: probData.problems.map(prob => {
                            return {
                                id: prob._id,
                                source: prob.source,
                                title: prob.title,
                                reasons: prob.reasons,
                                solved: prob.solved,
                                creator: prob.creator
                            };
                        }), maxProbs: probData.maxProbs
                    };
                }))
            .subscribe((transformedProbData) => {
                this.problems = transformedProbData.problems;
                this.problemsUpdated.next({
                    problems: [...this.problems],
                    probCount: transformedProbData.maxProbs
                });
            });
    };

    getProblemUpdateListner() {
        return this.problemsUpdated.asObservable();
    };

    
    addProblem(source: string, title: string, reasons: string, solved: string) {
        const problem: Problem = { id: '', source: source,title: title, reasons: reasons, solved: solved, creator: null  };
        this.http.post<{message: string, problemId: string}>( BACKEND_URL, problem)
        .subscribe((resData) => {
            this.router.navigate(["/problems/all"]);
        });
    };

    updateProblem(id: string, source: string, title: string, reasons: string, solved: string) {
        const problem: Problem = { id: id, source: source, title: title, reasons: reasons, solved: solved, creator: null  };
        this.http.put( BACKEND_URL + id, problem)
        .subscribe((response) => {
            this._location.back();
        });
    }

    deleteProblem(problemId: string) {
      return this.http.delete( BACKEND_URL + problemId)
    };
}