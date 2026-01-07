import { Component, Input, Output, EventEmitter, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Notification } from '../../services/notification.service';

@Component({
    selector: 'app-notification-item',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './notification-item.component.html',
    styleUrls: ['./notification-item.component.css']
})
export class NotificationItemComponent implements OnInit, OnDestroy {
    @Input({ required: true }) notification!: Notification;
    @Output() close = new EventEmitter<number>();

    private timeoutId: any;
    private readonly DEFAULT_DURATION = 5000;

    ngOnInit() {
        this.startTimer();
    }

    ngOnDestroy() {
        this.clearTimer();
    }

    startTimer() {
        const duration = this.notification.duration || this.DEFAULT_DURATION;
        if (duration > 0) {
            this.timeoutId = setTimeout(() => {
                this.close.emit(this.notification.id);
            }, duration);
        }
    }

    clearTimer() {
        if (this.timeoutId) {
            clearTimeout(this.timeoutId);
            this.timeoutId = null;
        }
    }

    onMouseEnter() {
        this.clearTimer();
    }

    onMouseLeave() {
        this.startTimer();
    }

    onClose() {
        this.clearTimer();
        this.close.emit(this.notification.id);
    }
}
