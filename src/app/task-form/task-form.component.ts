import { Component, EventEmitter, Output } from '@angular/core';
import { Task } from '../models/task.model';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-task-form',
  templateUrl: './task-form.component.html',
  styleUrls: ['./task-form.component.css']
})
export class TaskFormComponent {
  @Output() taskAdded = new EventEmitter<Task>();
  taskForm: FormGroup;

  constructor(private fb: FormBuilder) {
    this.taskForm = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(3)]],
      description: ['', Validators.required]
    });
  }

  onSubmit() {
    if (this.taskForm.valid) {
      const newTask: Task = {
        ...this.taskForm.value,
        completed: false
      };
      this.taskAdded.emit(newTask);
      this.taskForm.reset();
    }
  }
}
