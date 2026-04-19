// subscription.component.ts
import { Component, AfterViewInit, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { StripeCardElement, StripeElements } from '@stripe/stripe-js';
import { StripeService } from '../../services/stripe.service';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-subscription',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './subscription.component.html',
  styleUrl: './subscription.component.scss'
})
export class SubscriptionComponent implements OnInit {
  stripe: any;
  elements: StripeElements | null = null;
  card: StripeCardElement | null = null;

  trialMonths: number = 6; // default trial
  promoCode: string = '';
  monthlyPrice: number = 6.98;
  employerData: any = null;
  userEmail: string = '';
  token: string | null = null;

  constructor(private http: HttpClient, private stripeService: StripeService, private route: ActivatedRoute,
    private authService: AuthService, private router: Router,
    private toastr: ToastrService) { }

  ngOnInit() {
    // SCENARIO 1: Internal Flow (Registration -> Subscription)
    debugger;
    this.employerData = history.state?.employerData;

    if (this.employerData) {
      this.userEmail = this.employerData.email || '';
      console.log('Loaded from internal state');
    }
    else {
      // SCENARIO 2: External Link (Email -> Subscription/TOKEN)
      // This grabs the 'token' parameter defined in your AppRoutingModule
      this.token = this.route.snapshot.paramMap.get('token');

      if (this.token) {
        this.authService.validateToken(this.token).subscribe({
          next: (res) => {
            this.employerData = { ...res.result };
            this.userEmail = this.employerData.email;
            if(res.result.accessStatus == "allowed")
            {
              this.toastr.success('Payment is already done.');
              this.router.navigate(['']);
            }
          },
          error: (err) => {
          },
        });
        // this.verifyTokenAndLoadData(this.token);
      } else {
        console.error('No data and no token found.');
        // Optional: Redirect to login or error page
      }
    }
  }

  selectTrial(months: number) {
    this.trialMonths = months;
  }

  // async onSubscribe() {
  //   if (!this.stripe || !this.card) return;

  //   // 1️⃣ Create PaymentMethod with card
  //   const { paymentMethod, error } = await this.stripe.createPaymentMethod({
  //     type: 'card',
  //     card: this.card
  //   });

  //   if (error) {
  //     alert(error.message);
  //     return;
  //   }

  //   // 2️⃣ Call backend API
  //   const response: any = await this.http.post('https://localhost:44389/api/payment/create', {
  //     userId: this.employerData.userId,               // signedup user id
  //     email: this.employerData.email,       // signedup user email
  //     paymentMethodId: paymentMethod.id,
  //     trialMonths: this.trialMonths,
  //     promoCode: this.promoCode || null
  //   }).toPromise();

  //   debugger;
  //   if (response.isSuccess && response.result.clientSecret) {
  //     debugger;
  //     const { error: confirmError, paymentIntent } = await this.stripe.confirmCardPayment(response.result.clientSecret);

  //     if (confirmError) {
  //       alert('Payment failed: ' + confirmError.message);
  //       return;
  //     }

  //     if (paymentIntent && paymentIntent.status === 'succeeded') {
  //       alert('Subscription created and payment successful!');
  //     }
  //   } else {
  //     alert(`Subscription created. Trial for ${this.trialMonths} months started.`);
  //   }
  // }

  async onCheckout() {
    // 1️⃣ Call backend to create Checkout Session
    const response: any = await this.http.post(
      'https://localhost:44389/api/payment/checkout',
      {
        userId: this.employerData.userId,
        email: this.employerData.email,
        promoCode: this.promoCode || null
      }
    ).toPromise();

    if (response.isSuccess && response.result.checkoutUrl) {
        window.location.href = response.result.checkoutUrl;
    }
  }
}