import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { NotificationService } from '../services/notification.service';
import { APP_MESSAGES } from '../shared/constants/messages';

@Injectable()
export class ServerErrorInterceptor implements HttpInterceptor {

    constructor(private notificationService: NotificationService) { }

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        return next.handle(request).pipe(
            catchError((error: HttpErrorResponse) => {
                if (error.status === 0) {
                    this.notificationService.showError(APP_MESSAGES.ERRORS.SERVER_CONNECTION);
                }
                return throwError(() => error);
            })
        );
    }
}
