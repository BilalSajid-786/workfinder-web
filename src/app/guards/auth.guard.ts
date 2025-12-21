// import { CanActivateFn, Router } from '@angular/router';
// import { AuthService } from '../services/auth.service';
// import { inject } from '@angular/core';

// export const authGuard: CanActivateFn = (route, state) => {
//   const authService = inject(AuthService);
//   const router = inject(Router);

//   const requiredPermission = route.data['permissions'];

//   if (authService.hasPermission(requiredPermission)) {
//     return true;
//   } else {
//     router.navigate(['register']);
//     return false;
//   }
// };


// auth.guard.ts
import { CanActivateFn, Router, UrlTree } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';

export const authGuard: CanActivateFn = (route, state): boolean | UrlTree => {
  const auth = inject(AuthService);
  const router = inject(Router);
  const toLogin = () => router.createUrlTree(['/'], { queryParams: { returnUrl: state.url } });

  if (!auth.isLoggedIn?.() || auth.isTokenExpired?.()) {
    auth.logout?.();
    return toLogin();
  }

  const anyPerms = route.data?.['anyPermissions'] as string[] | undefined;
  if (anyPerms) {
    const okAny = anyPerms.some(p => auth.hasPermission(p));
    return okAny ? true : toLogin();
  }

  const required = route.data?.['permissions'] as string | string[] | undefined;
  if (!required) return true;

  const okAll = Array.isArray(required)
    ? required.every(p => auth.hasPermission(p))
    : auth.hasPermission(required);

  return okAll ? true : toLogin();
};

