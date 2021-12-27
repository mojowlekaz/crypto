import { reaction, makeAutoObservable } from 'mobx';

export class Workflow {
  taskMap: { [key: string]: (workflow: Workflow) => void } = {};
  task = {
    previous: '',
    next: ''
  };

  constructor(args: Partial<Workflow>) {
    Object.assign(this, args);
    makeAutoObservable(this);
    this.monitor();
  }

  run(name: string) {
    this.task.previous = this.task.next;
    this.task.next = name;
  }

  monitor() {
    reaction(
      () => this.task.next,
      async (nextTaskName) => {
        const task = this.taskMap[nextTaskName];
        if (task) {
          await task(this);
        }
      }
    );
  }
}
