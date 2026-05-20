<template>
  <div class="table-container">
    <div class="table-header">
      <div class="table-search">
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Search..."
          @input="filterData"
        />
      </div>
      <div class="table-actions">
        <slot name="actions"></slot>
      </div>
    </div>
    <div class="table-wrapper">
      <table>
        <thead>
          <tr>
            <th
              v-for="column in columns"
              :key="column.key"
              @click="sortBy(column.key)"
            >
              {{ column.label }}
              <span v-if="sortColumn === column.key" class="sort-icon">
                {{ sortDirection === 'asc' ? '↑' : '↓' }}
              </span>
            </th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="row in filteredData" :key="row.id">
            <td v-for="column in columns" :key="column.key">
              <slot :name="`cell-${column.key}`" :row="row">
                {{ row[column.key] }}
              </slot>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <div v-if="filteredData.length === 0" class="table-empty">
      No data found.
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, computed } from 'vue'

export default defineComponent({
  name: 'Table',
  props: {
    columns: {
      type: Array as () => { key: string; label: string }[],
      required: true,
    },
    data: {
      type: Array as () => any[],
      required: true,
    },
  },
  setup(props) {
    const searchQuery = ref('')
    const sortColumn = ref('')
    const sortDirection = ref<'asc' | 'desc'>('asc')

    const filteredData = computed(() => {
      let result = [...props.data]

      // Search
      if (searchQuery.value) {
        const query = searchQuery.value.toLowerCase()
        result = result.filter(row =>
          props.columns.some(column =>
            String(row[column.key]).toLowerCase().includes(query)
          )
        )
      }

      // Sort
      if (sortColumn.value) {
        result.sort((a, b) => {
          const aValue = a[sortColumn.value]
          const bValue = b[sortColumn.value]
          if (aValue < bValue) return sortDirection.value === 'asc' ? -1 : 1
          if (aValue > bValue) return sortDirection.value === 'asc' ? 1 : -1
          return 0
        })
      }

      return result
    })

    const sortBy = (column: string) => {
      if (sortColumn.value === column) {
        sortDirection.value = sortDirection.value === 'asc' ? 'desc' : 'asc'
      } else {
        sortColumn.value = column
        sortDirection.value = 'asc'
      }
    }

    const filterData = () => {
      // Triggered by search input
    }

    return {
      searchQuery,
      sortColumn,
      sortDirection,
      filteredData,
      sortBy,
      filterData,
    }
  },
})
</script>

<style scoped>
.table-container {
  background: rgba(248, 244, 230, 0.7);
  backdrop-filter: blur(10px);
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  border: 1px solid rgba(224, 224, 224, 0.3);
}

.table-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.table-search input {
  padding: 0.5rem 1rem;
  border: 1px solid #E0E0E0;
  border-radius: 6px;
  font-family: 'Inter', sans-serif;
  font-size: 1rem;
  width: 300px;
}

.table-wrapper {
  overflow-x: auto;
}

table {
  width: 100%;
  border-collapse: collapse;
}

th, td {
  padding: 1rem;
  text-align: left;
  border-bottom: 1px solid #E0E0E0;
}

th {
  font-weight: 600;
  color: #2A5C8A;
  cursor: pointer;
  user-select: none;
}

th:hover {
  background-color: rgba(42, 92, 138, 0.1);
}

.sort-icon {
  margin-left: 0.5rem;
}

tr:hover {
  background-color: rgba(42, 92, 138, 0.05);
}

.table-empty {
  text-align: center;
  padding: 2rem;
  color: #666;
}
</style>