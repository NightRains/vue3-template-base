<template>
  <div>
    <h2>{{ props.title }}</h2>
    <div>username: {{ state.lowerCaseUsername }}</div>
    <input type="text" v-model="state.username" placeholder="username" />
    <br />
    <input type="password" v-model="state.password" placeholder="password" />
    <br />
    <button @click="login">Submit</button>
    <p>Values: {{ `${state.username} ${state.password}` }}</p>
  </div>
</template>
<script>
import { computed, onMounted, reactive } from 'vue'
export default {
  props: {
    title: {
      type: String,
      default: 'Default Title',
    },
  },
  setup(props, { emit, slots, attrs }) {
    const state = reactive({
      username: '',
      password: '',
      lowerCaseUsername: computed(() => state.username.toLowerCase()),
    })

    onMounted(() => {
      console.log('onMounted')
      console.log('context', emit, slots, attrs)
    })

    const login = () => {
      emit('login', {
        username: state.username,
        password: state.password,
      })
    }

    return {
      props,
      state,
      login,
    }
  },
}
</script>