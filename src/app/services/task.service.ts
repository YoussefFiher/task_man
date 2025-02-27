import { Injectable } from '@angular/core';
import { Task } from '../models/task.model';

@Injectable({
  providedIn: 'root'
})
export class TaskService {
  private tasks: Task[] = [
    { title: 'Learn Angular', description: 'Study Angular framework', completed: false },
    { title: 'Build a Task Manager', description: 'Create an app to manage tasks', completed: false }
  ];

  getTasks(): Task[] {
    return this.tasks;
  }

  addTask(task: Task) {
    this.tasks.push(task);
  }

  deleteTask(index: number) {
    this.tasks.splice(index, 1);
  }

  toggleTaskCompletion(index: number) {
    this.tasks[index].completed = !this.tasks[index].completed;
  }
}
