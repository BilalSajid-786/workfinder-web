import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class PagingService {

  getPagingSizeIntervals(): number[] {
    return [5, 10, 20, 50];
  }
}
