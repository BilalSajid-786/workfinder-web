import { Component, OnInit, ViewChild } from '@angular/core';
import { JobService } from '../../services/job.service';
import { ToastrService } from 'ngx-toastr';
import { Job } from '../../models/job.model';

import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-active-jobs',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatButtonModule,
    MatTooltipModule
  ],
  templateUrl: './active-jobs.component.html',
  styleUrl: './active-jobs.component.scss'
})
export class ActiveJobsComponent implements OnInit {
  displayedColumns: string[] = [
    'title',
    'industryName',
    'expiryDate',
    'city',
    'status',
    'actions'
  ];

  dataSource = new MatTableDataSource<Job>([]);
  activeJobs: Job[] = [];

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(private jobService: JobService, private toastr: ToastrService) {}

  ngOnInit(): void {
    this.getActiveJobs();
  }

  ngAfterViewInit(): void {
    // attach once view init; data will connect after API returns
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;

    // custom filter by title, city, industry
    this.dataSource.filterPredicate = (data: Job, filter: string) => {
      const str = (data.title + ' ' + data.city + ' ' + data.industryName).toLowerCase();
      return str.includes(filter.trim().toLowerCase());
    };
  }

  applyFilter(value: string): void {
    this.dataSource.filter = value;
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  getActiveJobs(): void {
    const payload: any = {
      searchValue: '',
      sortColumn: 'JobTitle',
      sortOrder: 'Asc',
      pageSize: 10,
      pageNo: 1,
      employerId: '7FBD2975-5FE2-476F-B4A8-9B2DC2A331EB',
    };
    this.jobService.GetActiveJobs(payload).subscribe({
      next: (res: any) => {
        this.activeJobs = res.result;
        console.log("activeJobs", this.activeJobs);
        this.dataSource.data = this.activeJobs;
        console.log("dataSource", this.dataSource.data);
      },
      error: () => this.toastr.error('Failed to get jobs'),
    });
  }
}
