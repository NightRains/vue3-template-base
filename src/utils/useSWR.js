/**
 * 使用SWR Hooks在Vue3中实现高效的数据加载和缓存
 * 自定义hooks useSWR.js
 */
// 引入 vue3 响应式数据工具包
import { reactive, toRefs, watchEffect } from 'vue'
import { get as idbGet, set as idbSet } from 'idb-keyval'

const defaultOptions = {
  refreshInterval: 0, // 缓存刷新的时间间隔，默认不自动刷新
  ttl: Infinity // 缓存的有效时间，默认为永久有效
}

/**
 * 定义一个 useSWR 函数，接收三个参数
 * @param {String} key 用于区分不同数据的关键字
 * @param {Function} fetcher 用于获取数据的函数
 * @param {Object} options 用于配置 SWR 行为的选项对象
 */
export default function useSWR(key, fetcher, options = {}) {
  // 使用 reactive 函数创建响应式数据对象
  const state = reactive({
    data: null, // 存储返回的数据
    error: null, // 存储请求发生的错误
    isLoading: false // 是否正在请求数据
  })

  // 合并默认选项和传入的选项
  const { refreshInterval, ttl } = Object.assign({}, defaultOptions, options)

  // 定义一个 fetch 函数，用于获取数据
  async function fetch() {
    state.isLoading = true // 数据正在加载中，设置 isLoading 属性为 true
    try {
      const data = await fetcher()
      state.data = data // 将获取额数据存储在 data 属性中
      state.error = null // 请求成功，将 error 属性设置为 null
      idbSet(key, { data, timestamp: Date.now() }) // 将获取到的数据存储在 IndexedDB 数据库中
    } catch (error) {
      console.error(error);
      state.error = error
    } finally {
      state.isLoading = false // 数据请求成功/失败，设置 isLoading 属性为 false
    }
  }

  // 定义一个 fetchIfNeeded 函数，用于检查是否需要重新获取数据
  async function fetchIfNeeded() {
    // 从 IndexedDB 中获取缓存数据
    const cachedData = await idbGet(key)
    // 如果存在缓存数据，并且缓存未过期，则直接使用缓存数据
    if (cachedData && (Date.now() - cachedData.timestamp < ttl)) {
      state.data = cachedData.data
      return
    }
    // 如果不存在缓存数据或者缓存已过期，则重新获取数据
    await fetch()
  }

  // 使用 watchEffect 监听 state 数据对象的变化
  watchEffect(() => {
    fetchIfNeeded() // 执行 fetchIfNeeded 函数，检查是否需要重新获取数据
    // 如果设置了缓存刷新时间，则使用 setInterval 定时器自动刷新缓存
    if (refreshInterval > 0) {
      const intervalId = setInterval(fetchIfNeeded, refreshInterval);
      // 返回一个函数，用于在组件销毁前清楚定时器
      return () => clearInterval(intervalId)
    }
  })

  // 使用 toRefs 函数响应
  return toRefs(state)
}
