import { Component } from '@angular/core';
import { BillingService } from '../../services/billing.service';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-billing-details',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './billing-details.component.html',
  styleUrl: './billing-details.component.scss'
})
export class BillingDetailsComponent {
  billing?: any;
  loading = true;
  error = false;
  subscriptionId:string = "";

  constructor(private billingService: BillingService, private http: HttpClient) {}

  ngOnInit(): void {
    this.loadBilling();
  }

  loadBilling() {
    this.billingService.getSummary().subscribe({
      next: (res) => {
        this.billing = res;
        this.loading = false;
        this.subscriptionId = res.subscriptionId;
      },
      error: () => {
        this.error = true;
        this.loading = false;
      }
    });
  }

  cancelSubscription() {
  if (!confirm('Are you sure you want to cancel your subscription? You will retain access until the end of the billing period.')) {
    return;
  }

  this.http.post('https://localhost:44389/api/payment/cancel', {subscriptionId:this.subscriptionId})
    .subscribe({
      next: () => {
        this.loadBilling(); // reload billing info
      },
      error: () => {
        alert('Failed to cancel subscription.');
      }
    });
}

resumeSubscription() {
  
  }

  manageBilling() {
    this.billingService.openPortal().subscribe((res: { url: string; }) => {
      window.location.href = res.url;
    });
  }

getStatusClass(status: string) {
  // Invoice-specific mapping
  switch (status.toLowerCase()) {
    case 'paid':
      return 'paid';
    case 'active':
      return 'active';
    case 'open':
    case 'pending':
      return 'pending';
    case 'failed':
      return 'failed';
    default:
      return 'neutral';
  }
}
}
