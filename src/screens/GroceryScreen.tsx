import React, { useMemo, useState } from 'react';
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View
} from 'react-native';

import { LIFE_AREA_COLORS, SURFACE_COLORS } from '../constants/colors';
import type { GroceryItem } from '../models/GroceryItem';

const INITIAL_GROCERY_ITEMS: GroceryItem[] = [
  {
    id: 'grocery-1',
    itemName: 'Bread',
    category: 'bakery',
    isChecked: false,
    isRecurring: true
  },
  {
    id: 'grocery-2',
    itemName: 'Milk',
    category: 'dairy',
    isChecked: false,
    isRecurring: true
  },
  {
    id: 'grocery-3',
    itemName: 'Apples',
    category: 'produce',
    isChecked: false,
    isRecurring: false
  }
];

type GrocerySection = {
  category: string;
  items: GroceryItem[];
};

function normalizeCategory(category: string) {
  return category.trim().toLowerCase();
}

function groupItemsByCategory(items: GroceryItem[]): GrocerySection[] {
  const groupedItems = items.reduce<Record<string, GroceryItem[]>>((groups, item) => {
    const category = normalizeCategory(item.category);
    return {
      ...groups,
      [category]: [...(groups[category] ?? []), item]
    };
  }, {});

  return Object.keys(groupedItems)
    .sort((leftCategory, rightCategory) => leftCategory.localeCompare(rightCategory))
    .map((category) => ({
      category,
      items: groupedItems[category].sort((leftItem, rightItem) =>
        leftItem.itemName.localeCompare(rightItem.itemName)
      )
    }));
}

export function GroceryScreen() {
  const [items, setItems] = useState<GroceryItem[]>(INITIAL_GROCERY_ITEMS);
  const [itemName, setItemName] = useState('');
  const [category, setCategory] = useState('');
  const [isRecurring, setIsRecurring] = useState(false);

  const grocerySections = useMemo(() => groupItemsByCategory(items), [items]);
  const remainingCount = useMemo(
    () => items.filter((item) => !item.isChecked).length,
    [items]
  );

  const addItem = () => {
    const trimmedItemName = itemName.trim();
    const trimmedCategory = normalizeCategory(category);

    if (!trimmedItemName || !trimmedCategory) {
      return;
    }

    const groceryItem: GroceryItem = {
      id: `grocery-${Date.now()}`,
      itemName: trimmedItemName,
      category: trimmedCategory,
      isChecked: false,
      isRecurring
    };

    setItems((currentItems) => [...currentItems, groceryItem]);
    setItemName('');
    setCategory('');
    setIsRecurring(false);
  };

  const toggleChecked = (itemId: string) => {
    setItems((currentItems) =>
      currentItems.map((item) =>
        item.id === itemId ? { ...item, isChecked: !item.isChecked } : item
      )
    );
  };

  return (
    <ScrollView
      contentContainerStyle={styles.content}
      style={styles.container}
    >
      <View style={styles.header}>
        <Text style={styles.eyebrow}>Household</Text>
        <Text style={styles.title}>Grocery List</Text>
        <Text style={styles.summary}>
          {remainingCount} unchecked {remainingCount === 1 ? 'item' : 'items'}
        </Text>
      </View>

      <View style={styles.form}>
        <TextInput
          accessibilityLabel="Grocery item name"
          onChangeText={setItemName}
          placeholder="Item name"
          style={styles.input}
          value={itemName}
        />
        <TextInput
          accessibilityLabel="Grocery category"
          onChangeText={setCategory}
          placeholder="Category or aisle"
          style={styles.input}
          value={category}
        />
        <Pressable
          accessibilityLabel="Mark item recurring"
          accessibilityRole="checkbox"
          accessibilityState={{ checked: isRecurring }}
          onPress={() => setIsRecurring((currentValue) => !currentValue)}
          style={[styles.recurringToggle, isRecurring && styles.recurringToggleActive]}
        >
          <Text
            style={[
              styles.recurringToggleText,
              isRecurring && styles.recurringToggleTextActive
            ]}
          >
            {isRecurring ? 'Recurring item' : 'Make recurring'}
          </Text>
        </Pressable>
        <Pressable
          accessibilityRole="button"
          onPress={addItem}
          style={styles.addButton}
        >
          <Text style={styles.addButtonText}>Add Grocery Item</Text>
        </Pressable>
      </View>

      <View style={styles.sections}>
        {grocerySections.map((section) => (
          <View key={section.category} style={styles.section}>
            <Text style={styles.sectionTitle}>{section.category}</Text>
            <View style={styles.itemList}>
              {section.items.map((item) => (
                <View key={item.id} style={styles.itemRow}>
                  <Pressable
                    accessibilityLabel={`${item.isChecked ? 'Uncheck' : 'Check'} ${item.itemName}`}
                    accessibilityRole="checkbox"
                    accessibilityState={{ checked: item.isChecked }}
                    onPress={() => toggleChecked(item.id)}
                    style={[styles.checkbox, item.isChecked && styles.checkboxChecked]}
                  >
                    <Text style={styles.checkboxText}>{item.isChecked ? '✓' : ''}</Text>
                  </Pressable>

                  <View style={styles.itemBody}>
                    <Text style={[styles.itemName, item.isChecked && styles.itemNameChecked]}>
                      {item.itemName}
                    </Text>
                    <View style={styles.itemMeta}>
                      {item.isRecurring ? (
                        <View style={styles.recurringBadge}>
                          <Text style={styles.recurringBadgeText}>Recurring</Text>
                        </View>
                      ) : null}
                      {item.isChecked ? <Text style={styles.checkedText}>Checked</Text> : null}
                    </View>
                  </View>
                </View>
              ))}
            </View>
          </View>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  addButton: {
    alignItems: 'center',
    backgroundColor: LIFE_AREA_COLORS.household,
    borderRadius: 6,
    paddingHorizontal: 14,
    paddingVertical: 12
  },
  addButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700'
  },
  checkbox: {
    alignItems: 'center',
    borderColor: SURFACE_COLORS.muted,
    borderRadius: 4,
    borderWidth: 2,
    height: 26,
    justifyContent: 'center',
    width: 26
  },
  checkboxChecked: {
    backgroundColor: LIFE_AREA_COLORS.household,
    borderColor: LIFE_AREA_COLORS.household
  },
  checkboxText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '800',
    lineHeight: 18
  },
  checkedText: {
    color: LIFE_AREA_COLORS.health,
    fontSize: 13,
    fontWeight: '700'
  },
  container: {
    backgroundColor: SURFACE_COLORS.background,
    flex: 1
  },
  content: {
    gap: 18,
    paddingHorizontal: 20,
    paddingVertical: 24
  },
  eyebrow: {
    color: LIFE_AREA_COLORS.household,
    fontSize: 13,
    fontWeight: '700',
    letterSpacing: 0,
    textTransform: 'uppercase'
  },
  form: {
    gap: 12
  },
  header: {
    gap: 6
  },
  input: {
    backgroundColor: SURFACE_COLORS.card,
    borderColor: SURFACE_COLORS.border,
    borderRadius: 6,
    borderWidth: 1,
    color: SURFACE_COLORS.text,
    fontSize: 16,
    paddingHorizontal: 12,
    paddingVertical: 12
  },
  itemBody: {
    flex: 1,
    gap: 6
  },
  itemList: {
    gap: 8
  },
  itemMeta: {
    alignItems: 'center',
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8
  },
  itemName: {
    color: SURFACE_COLORS.text,
    fontSize: 16,
    fontWeight: '700'
  },
  itemNameChecked: {
    color: SURFACE_COLORS.muted,
    textDecorationLine: 'line-through'
  },
  itemRow: {
    alignItems: 'flex-start',
    backgroundColor: SURFACE_COLORS.card,
    borderColor: SURFACE_COLORS.border,
    borderRadius: 8,
    borderWidth: 1,
    flexDirection: 'row',
    gap: 12,
    padding: 12
  },
  recurringBadge: {
    backgroundColor: LIFE_AREA_COLORS.health,
    borderRadius: 5,
    paddingHorizontal: 8,
    paddingVertical: 3
  },
  recurringBadgeText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0,
    textTransform: 'uppercase'
  },
  recurringToggle: {
    alignItems: 'center',
    backgroundColor: SURFACE_COLORS.card,
    borderColor: LIFE_AREA_COLORS.household,
    borderRadius: 6,
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 10
  },
  recurringToggleActive: {
    backgroundColor: LIFE_AREA_COLORS.household
  },
  recurringToggleText: {
    color: LIFE_AREA_COLORS.household,
    fontSize: 14,
    fontWeight: '700'
  },
  recurringToggleTextActive: {
    color: '#FFFFFF'
  },
  section: {
    gap: 8
  },
  sectionTitle: {
    color: SURFACE_COLORS.text,
    fontSize: 15,
    fontWeight: '800',
    letterSpacing: 0,
    textTransform: 'lowercase'
  },
  sections: {
    gap: 16
  },
  summary: {
    color: SURFACE_COLORS.muted,
    fontSize: 15
  },
  title: {
    color: SURFACE_COLORS.text,
    fontSize: 28,
    fontWeight: '700',
    letterSpacing: 0
  }
});
