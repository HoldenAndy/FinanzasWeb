import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NotificationService } from '../../services/notification.service';
import { NotificationItemComponent } from './notification-item.component';

@Component({
    selector: 'app-notification',
    standalone: true,
    imports: [CommonModule, NotificationItemComponent],
    templateUrl: './notification.component.html',
    styleUrls: ['./notification.component.css']
})
export class NotificationComponent {
    private notificationService = inject(NotificationService);
    notifications$ = this.notificationService.notifications$;

    close(id: number) {
        this.notificationService.remove(id);
    }
}
