<template>
  <div>Test SWR</div>
  <div>
    <div v-if="isLoading">Loading...</div>
    <div v-if="error">Error: {{ error.message }}</div>
    <ul v-if="data">
      <li v-for="item in data" :key="item.id">{{ item.title }}</li>
    </ul>
  </div>
</template>
<script>
import useSWR from '@/utils/useSWR'
import axios from 'axios'
export default {
  setup() {
    const { data, error, isLoading } = useSWR(
      'todos',
      async () => {
        const response = await axios.get(
          'https://jsonplaceholder.typicode.com/todos'
        )
        return response.data
      },
      { refreshInterval: 5000 }
    )
    return { data, error, isLoading }
  },
}
</script>