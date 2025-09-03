import {
  HttpInterceptorFn,
  HttpRequest,
  HttpHandlerFn,
  HttpEvent,
} from '@angular/common/http';
import { inject } from '@angular/core';
import { Observable, finalize } from 'rxjs';
import { LoaderService } from '../services/loader.service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const loaderService = inject(LoaderService);
  loaderService.show();

  const token = localStorage.getItem('token');

  // Skip adding token for login request
  if (token && !req.url.includes('/login')) {
    const authReq = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`,
      },
    });
    return next(authReq).pipe(finalize(() => loaderService.hide()));
  }

  // If no token or it's a login request
  return next(req).pipe(finalize(() => loaderService.hide()));
};
