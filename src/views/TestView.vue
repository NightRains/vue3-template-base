<template>
  <h1>{{ props.parentTitle }}</h1>
  <hr />
  <Test title="调用 Test 组件" @login="onLogin"></Test>
</template>
<script>
import { watch } from 'vue'
import Test from '../components/Test.vue'
export default {
  components: { Test },
  props: {
    parentTitle: {
      type: String,
      default: 'Default Parent Title',
    },
  },
  setup(props) {
    watch(
      props,
      (old, val) => {
        console.log('props', old, val)
      },
      {
        immediate: true,
        deep: true,
      }
    )

    const onLogin = (params) => {
      console.log('onLogin params', params)
    }

    return {
      props,
      onLogin,
    }
  },
}
</script>