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

  // 1) Require login
  // if (!auth.isLoggedIn()) {
  //   return router.createUrlTree(['/login'], { queryParams: { returnUrl: state.url } });
  // }

  if (!auth.isLoggedIn?.() || auth.isTokenExpired?.()) {
    auth.logout?.();
    return toLogin();
  }

  // 2) OR semantics (anyPermissions) — pass if user has at least one
  // const anyPerms = route.data?.['anyPermissions'] as string[] | undefined;
  // if (anyPerms && !anyPerms.some(p => auth.hasPermission(p))) {
  //   return router.createUrlTree(['/login']);
  // }
  // if (anyPerms) return true; // already satisfied OR requirement
  const anyPerms = route.data?.['anyPermissions'] as string[] | undefined;
  if (anyPerms) {
    const okAny = anyPerms.some(p => auth.hasPermission(p));
    return okAny ? true : toLogin();
  }

  // 3) ALL semantics (permissions) — only if you still use it elsewhere
  // const required = route.data?.['permissions'] as string | string[] | undefined;
  // if (!required) return true;

  // const ok = Array.isArray(required)
  //   ? required.every(p => auth.hasPermission(p))   // ALL required
  //   : auth.hasPermission(required);                // single required

  // return ok ? true : router.createUrlTree(['/login']);
  const required = route.data?.['permissions'] as string | string[] | undefined;
  if (!required) return true;

  const okAll = Array.isArray(required)
    ? required.every(p => auth.hasPermission(p))
    : auth.hasPermission(required);

  return okAll ? true : toLogin();
};

