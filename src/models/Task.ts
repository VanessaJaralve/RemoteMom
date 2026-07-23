export type TaskLifeArea = 'work' | 'kid' | 'household' | 'self';

export type Task = {
  id: string;
  title: string;
  lifeArea: TaskLifeArea;
  dueDate?: string;
  isDone: boolean;
};
