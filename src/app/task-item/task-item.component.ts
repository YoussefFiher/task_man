import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Task } from '../models/task.model';

@Component({
  selector: 'app-task-item',
  templateUrl: './task-item.component.html',
  styleUrls: ['./task-item.component.css']
})
export class TaskItemComponent {
  @Input() task!: Task;
  @Output() deleteTask = new EventEmitter<void>();
  @Output() toggleCompletion = new EventEmitter<void>();

  onDelete() {
    this.deleteTask.emit();
  }

  onToggleCompletion() {
    this.toggleCompletion.emit();
  }
}
