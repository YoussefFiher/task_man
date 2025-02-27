import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Task } from '../models/task.model';
import { TaskService } from '../services/task.service';

@Component({
  selector: 'app-task-list',
  templateUrl: './task-list.component.html',
  styleUrls: ['./task-list.component.css']
})
export class TaskListComponent implements OnInit {
  tasks: Task[] = [];
  filteredTasks: Task[] = [];
  currentFilter: 'all' | 'active' | 'completed' = 'all';
  @ViewChild('taskForm') taskForm!: ElementRef;

  constructor(private taskService: TaskService) {}

  ngOnInit() {
    this.loadTasks();
  }

  loadTasks() {
    this.tasks = this.taskService.getTasks();
    this.filterTasks(this.currentFilter);
  }

  addTask(task: Task) {
    this.taskService.addTask(task);
    this.loadTasks();
  }

  deleteTask(index: number) {
    this.taskService.deleteTask(index);
    this.loadTasks();
  }

  toggleCompletion(index: number) {
    this.taskService.toggleTaskCompletion(index);
    this.loadTasks();
  }

  filterTasks(filter: 'all' | 'active' | 'completed') {
    this.currentFilter = filter;
    
    switch (filter) {
      case 'active':
        this.filteredTasks = this.tasks.filter(task => !task.completed);
        break;
      case 'completed':
        this.filteredTasks = this.tasks.filter(task => task.completed);
        break;
      default:
        this.filteredTasks = [...this.tasks];
    }
  }

  getCompletedTasks(): number {
    return this.tasks.filter(task => task.completed).length;
  }

  getPendingTasks(): number {
    return this.tasks.filter(task => !task.completed).length;
  }

  focusTaskForm() {
    if (this.taskForm) {
      this.taskForm.nativeElement.focus();
    }
  }
}
