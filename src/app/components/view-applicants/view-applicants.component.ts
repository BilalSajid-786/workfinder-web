import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { PagingService } from '../../services/paging.service';
import { ApplicantService } from '../../services/applicant.service';
import { SkillService } from '../../services/skill.service';
import { ReactiveFormsModule, FormBuilder, FormGroup } from '@angular/forms';

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
import { ActivatedRoute, Router } from '@angular/router';
import { Skill } from '../../models/skill.model';
import { CountryService } from '../../services/country.service';
import { CityService } from '../../services/city.service';

@Component({
  selector: 'app-view-applicants',
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
    MatSlideToggleModule,
    ReactiveFormsModule,
  ],
  templateUrl: './view-applicants.component.html',
  styleUrl: './view-applicants.component.scss',
})
export class ViewApplicantsComponent implements AfterViewInit {
  displayedColumns: string[] = [
    'name',
    'email',
    'city',
    'country',
    'phone',
    'resume',
    'actions',
  ];

  dataTable = {
    filters: {
      skillId: 0,
      city: null,
      country: null,
    },
    searchValue: '',
    sortColumn: 'name',
    sortOrder: 'asc',
    length: 0,
    pageSize: 5,
    pageNo: 0,
    status: true,
    pageIndex: 0,
  };

  filtersForm!: FormGroup;

  dataSource = new MatTableDataSource<any>([]);
  applicants: any[] = [];
  skillsList: Skill[] = [];
  cities: any[] = [];
  countries: any[] = [];
  totalCount: number = 0;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private route: ActivatedRoute,
    private toastr: ToastrService,
    private pagingService: PagingService,
    private applicantService: ApplicantService,
    private skillService: SkillService,
    private countryService: CountryService,
    private cityService: CityService,
    private fb: FormBuilder
  ) {
    this.getSkills();
    this.getCountries();
    this.filtersForm = this.fb.group({
      skillId: [null],
      city: [null],
      country: [null],
    });
  }

  ngAfterViewInit(): void {
    this.getApplicants();
  }

  getPagingSizeIntervals(): number[] {
    return this.pagingService.getPagingSizeIntervals();
  }

  tableSortChange(event: any) {
    this.dataTable.sortColumn = event.active;
    this.dataTable.sortOrder = event.direction;
    this.getApplicants();
  }

  handlePage(event: PageEvent) {
    this.dataTable.pageIndex = event.pageIndex;
    this.dataTable.pageSize = event.pageSize;
    this.getApplicants();
  }

  getApplicants(): void {
    this.dataTable.pageNo = this.dataTable.pageIndex + 1;

    this.applicantService.getApplicants(this.dataTable).subscribe({
      next: (res) => {
        this.applicants = res.result.items;
        this.totalCount = res.result.totalCount;
        this.dataTable.length = this.totalCount;
        this.dataSource.data = this.applicants;
      },
      error: () => this.toastr.error('Failed to get jobs'),
    });
  }

  getSkills(): void {
    this.skillService.getSkills().subscribe({
      next: (res) => {
        if (res.isSuccess) {
          // res.result should be Skill[]
          this.skillsList = res.result;
        } else {
          this.skillsList = [];
        }
      },
      error: (err) => {
        this.skillsList = [];
      },
    });
  }

  getCountries(): void {
    this.countryService.getCountries().subscribe({
      next: (res) => {
        if (res.isSuccess) {
          // res.result should be Skill[]
          this.countries = res.result;
        } else {
          this.countries = [];
        }
      },
      error: (err) => {
        this.countries = [];
      },
    });
  }

  getCities(countryId: number): void {
    this.cityService.getCitiesByCountryId(countryId).subscribe({
      next: (res) => {
        if (res.isSuccess) {
          // res.result should be Skill[]
          this.cities = res.result;
        } else {
          this.cities = [];
        }
      },
      error: (err) => {
        this.cities = [];
      },
    });
  }

  onFiltersChanged() {
    const country = this.filtersForm.get('country')?.value;
    if (country) {
      this.getCities(country.countryId);
    } 
    else {
      // don’t trigger valueChanges
      this.filtersForm.get('city')?.setValue(null, { emitEvent: false });

      // reflect UI state
      this.filtersForm.get('city')?.markAsDirty();
      this.filtersForm.get('city')?.updateValueAndValidity();
    }
  }

  CityDropdownOpen(e: MouseEvent) {
    const country = this.filtersForm.get('country')?.value;
    const city = this.filtersForm.get('city')?.value;
    if (!country) {
      e.preventDefault();
      this.toastr.error('Please select country first.');
    }
  }

  applyFilterFromControls(): void {
    const skillId = this.filtersForm.get('skillId')?.value;
    const city = this.filtersForm.get('city')?.value;
    const country = this.filtersForm.get('country')?.value;
    this.dataTable.filters.skillId = skillId;
    this.dataTable.filters.city = city;
    if (country) {
      this.dataTable.filters.country = country.countryName;
    } else {
      this.dataTable.filters.country = null;
      this.dataTable.filters.city = null;
    }
    this.getApplicants();
  }
}
