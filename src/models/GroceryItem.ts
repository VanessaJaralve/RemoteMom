export type GroceryItem = {
  id: string;
  itemName: string;
  category: string;
  isChecked: boolean;
  isRecurring: boolean;
  reminderTime?: string;
  reminderEnabled?: boolean;
};
