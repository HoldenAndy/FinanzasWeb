import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { APP_MESSAGES } from '../shared/constants/messages';

export type NotificationType = 'error' | 'success' | 'warning' | 'info';

export interface Notification {
    message: string;
    title: string;
    type: NotificationType;
    id: number;
    duration?: number;
}

@Injectable({
    providedIn: 'root'
})
export class NotificationService {
    private notificationsSubject = new BehaviorSubject<Notification[]>([]);
    public notifications$ = this.notificationsSubject.asObservable();
    private counter = 0;

    constructor() { }

    show(message: string, title: string, type: NotificationType = 'info', duration: number = 5000): void {
        const id = this.counter++;
        const notification: Notification = { message, title, type, id, duration };
        const currentNotifications = this.notificationsSubject.value;

        this.notificationsSubject.next([...currentNotifications, notification]);

        // Timer logic is now handled in NotificationItemComponent
    }

    showError(message: string, duration: number = 5000): void {
        this.show(message, APP_MESSAGES.TITLES.ERROR, 'error', duration);
    }

    showSuccess(message: string): void {
        this.show(message, APP_MESSAGES.TITLES.SUCCESS, 'success', 3000);
    }

    remove(id: number): void {
        const currentNotifications = this.notificationsSubject.value;
        this.notificationsSubject.next(currentNotifications.filter(n => n.id !== id));
    }
}
