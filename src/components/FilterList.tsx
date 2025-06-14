import React from 'react';
import { ScrollView, TouchableOpacity, Text, StyleSheet, View } from 'react-native';

interface Filter {
  id: string;
  name: string;
  color: string;
}

interface FilterListProps {
  filters: Filter[];
  selectedFilter: string | null;
  onPreview: (filterId: string) => void;
  onApply: () => void;
  isProcessing: boolean;
}

const FilterList: React.FC<FilterListProps> = ({
  filters,
  selectedFilter,
  onPreview,
  onApply,
  isProcessing,
}) => {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.filtersList}
    >
      {filters.map((filter) => (
        <View key={filter.id} style={styles.filterWrapper}>
          <TouchableOpacity
            style={[
              styles.filterOption,
              { backgroundColor: filter.color },
              selectedFilter === filter.id && styles.selectedFilterOption,
            ]}
            onPress={() => onPreview(filter.id)}
            disabled={isProcessing}
          >
            <Text style={styles.filterName}>{filter.name}</Text>
          </TouchableOpacity>
          {selectedFilter === filter.id && (
            <TouchableOpacity
              style={styles.applyButton}
              onPress={onApply}
              disabled={isProcessing}
            >
              <Text style={styles.applyButtonText}>Áp dụng</Text>
            </TouchableOpacity>
          )}
        </View>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  filtersList: {
    paddingHorizontal: 10,
    paddingVertical: 10,
  },
  filterWrapper: {
    alignItems: 'center',
    marginHorizontal: 8,
  },
  filterOption: {
    width: 80,
    height: 80,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  selectedFilterOption: {
    borderColor: '#FF9BBD',
  },
  filterName: {
    fontSize: 14,
    fontWeight: '500',
    textAlign: 'center',
    color: '#000000',
  },
  applyButton: {
    marginTop: 5,
    backgroundColor: '#FF99CC',
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 5,
  },
  applyButtonText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: 'bold',
  },
});

export default FilterList;