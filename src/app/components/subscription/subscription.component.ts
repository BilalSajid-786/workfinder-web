// subscription.component.ts
import { Component, AfterViewInit, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { StripeCardElement, StripeElements } from '@stripe/stripe-js';
import { StripeService } from '../../services/stripe.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-subscription',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './subscription.component.html',
  styleUrl: './subscription.component.scss'
})
export class SubscriptionComponent implements AfterViewInit, OnInit {
  stripe: any;
  elements: StripeElements | null = null;
  card: StripeCardElement | null = null;

  trialMonths: number = 6; // default trial
  promoCode: string = '';
  monthlyPrice: number = 6.98;
  employerData: any = null;
  userEmail: string = '';

  constructor(private http: HttpClient, private stripeService: StripeService, private activatedRoute: ActivatedRoute) { }

  ngOnInit() {
    // Retrieve employer data passed from register-employer component
    this.employerData = history.state?.employerData;
    if (this.employerData) {
      this.userEmail = this.employerData.email || '';
    }
  }

  async ngAfterViewInit() {
    this.stripe = await this.stripeService.getStripe();
    if (!this.stripe) return;

    const elements = this.stripe.elements(); // local variable
    const card = elements.create('card');
    card.mount('#card-element');

    // now assign to class properties
    this.elements = elements;
    this.card = card;
  }

  selectTrial(months: number) {
    this.trialMonths = months;
  }

  async onSubscribe() {
    if (!this.stripe || !this.card) return;

    // 1️⃣ Create PaymentMethod with card
    const { paymentMethod, error } = await this.stripe.createPaymentMethod({
      type: 'card',
      card: this.card
    });

    if (error) {
      alert(error.message);
      return;
    }

    // 2️⃣ Call backend API
    const response: any = await this.http.post('https://localhost:7205/api/payment/create', {
      userId: this.employerData.userId,               // signedup user id
      email: this.employerData.email,       // signedup user email
      paymentMethodId: paymentMethod.id,
      trialMonths: this.trialMonths,
      promoCode: this.promoCode || null
    }).toPromise();

    debugger;
    if (response.isSuccess && response.result.clientSecret) {
      debugger;
      const { error: confirmError, paymentIntent } = await this.stripe.confirmCardPayment(response.result.clientSecret);

      if (confirmError) {
        alert('Payment failed: ' + confirmError.message);
        return;
      }

      if (paymentIntent && paymentIntent.status === 'succeeded') {
        alert('Subscription created and payment successful!');
      }
    } else {
      alert(`Subscription created. Trial for ${this.trialMonths} months started.`);
    }
  }

  async onCheckout() {
  if (!this.stripe) return;
  debugger;

  // 1️⃣ Call backend to create Checkout Session
  const response: any = await this.http.post(
    'https://localhost:7205/api/payment/checkout',
    {
      userId: this.employerData.userId,
      email: this.employerData.email,
      promoCode: this.promoCode || null
    }
  ).toPromise();

  if (response.isSuccess && response.result.checkoutUrl) {
    debugger;

    // 2️⃣ Redirect to Stripe Checkout
    // const { error } = await this.stripe.redirectToCheckout({
    //   sessionId: response.result.checkoutUrl
    // });
    window.location.href = response.result.checkoutUrl;

    // if (error) {
    //   alert(error.message);
    // }
  }
}
}