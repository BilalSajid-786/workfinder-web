import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { JobService } from '../../services/job.service';
import { ToastrService } from 'ngx-toastr';
import { Job } from '../../models/job.model';
import { PagingService } from '../../services/paging.service';

import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
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
    MatTooltipModule,
    MatSlideToggleModule
  ],
  templateUrl: './active-jobs.component.html',
  styleUrl: './active-jobs.component.scss',
})
export class ActiveJobsComponent implements AfterViewInit {
  displayedColumns: string[] = [
    'title',
    'industryName',
    'expiryDate',
    'city',
    'status',
    'actions',
  ];

  dataTable = {
    searchValue: '',
    sortColumn: 'title',
    sortOrder: 'asc',
    length: 100,
    pageSize: 5,
    pageNo: 0,
    pageIndex: 0
  };


  dataSource = new MatTableDataSource<Job>([]);
  activeJobs: Job[] = [];
  totalCount: number = 0;
  EnterSearchValue:string='';


  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  

  constructor(private jobService: JobService, private toastr: ToastrService, private pagingService: PagingService) {}

  // ngOnInit(): void {
  //   this.getActiveJobs();
  // }

  ngAfterViewInit(): void {
    this.getActiveJobs();
    //this.dataSource.paginator = this.paginator;
  }

  OnSearchTextChange(){
    //console.log(this.EnterSearchValue);
    this.dataTable.searchValue=this.EnterSearchValue;
    this.getActiveJobs();
  }

  getPagingSizeIntervals(): number[] {
    return this.pagingService.getPagingSizeIntervals();
  }

  tableSortChange(event: any) {
    console.log("Sort Event", event);
    this.dataTable.sortColumn = event.active;
    this.dataTable.sortOrder = event.direction;
    this.getActiveJobs();
  }

  handlePage(event: PageEvent) {
    //console.log("handle page", event);
    this.dataTable.pageIndex = event.pageIndex;
    this.dataTable.pageSize = event.pageSize;
    this.getActiveJobs();
  }



  applyFilter(value: string): void {
    console.log("applyfilter", value);
    this.dataSource.filter = value;
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  getActiveJobs(): void {
    this.dataTable.pageNo = this.dataTable.pageIndex + 1;

    this.jobService.GetActiveJobs(this.dataTable).subscribe({
      next: (res) => {
        //console.log('res', res);
        this.activeJobs = res.result;
        this.totalCount = res.result[0].totalRows;
        this.dataTable.length = this.totalCount;
        //console.log('activeJobs', this.activeJobs);
        this.dataSource.data = this.activeJobs;
        //console.log('dataSource', this.dataSource.data);
      },
      error: () => this.toastr.error('Failed to get jobs'),
    });
  }

  onToggleStatus(job: Job, checked: boolean) {

  }
}
