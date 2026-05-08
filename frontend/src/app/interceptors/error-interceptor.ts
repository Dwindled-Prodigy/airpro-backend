import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { ServerStatusService } from '../services/server-status.service';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const serverStatus = inject(ServerStatusService);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      // Status 0 means the request was completely blocked/failed to reach server
      // 503 Service Unavailable, 504 Gateway Timeout
      if (error.status === 0 || error.status === 503 || error.status === 504) {
        serverStatus.setServerDown(true);
      } else {
        // If we get a valid HTTP status (200, 400, 401, 403, 500, etc) 
        // the server is definitely up and responding.
        serverStatus.setServerDown(false);
      }
      return throwError(() => error);
    })
  );
};
