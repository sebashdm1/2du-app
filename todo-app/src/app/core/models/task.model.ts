export interface Task {
  id: string;
  title: string;
  completed: boolean;
  categoryId: string | null;
  createdAt: number;
  dueDate?: string;
  priority?: 'high' | 'medium' | 'low';
  description?: string;
  reminderLabel?: string;
}
