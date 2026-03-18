// stripe.service.ts
import { Injectable } from '@angular/core';
import { loadStripe, Stripe } from '@stripe/stripe-js';

@Injectable({
  providedIn: 'root'
})
export class StripeService {
  private stripePromise: Promise<Stripe | null>;

  constructor() {
    this.stripePromise = loadStripe('pk_test_51T3IuOLbqyjFzk0OGf14GwLfCz1oEyo6kP6mzcnLhsmmystyDm8BGWZM7gA8uPnVFXYUfXiPlNmZJl2t5yjdtUG800J6su35jj'); // your Stripe publishable key
  }

  getStripe(): Promise<Stripe | null> {
    return this.stripePromise;
  }
}