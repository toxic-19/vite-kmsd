<script setup lang="ts">
import { requestLogin, requestUserInfo } from '@/api/user'
import { onMounted, ref } from 'vue'
import { User } from '@/api/user/type.ts'
const userInfo = ref<User>()
onMounted(async () => {
  const {
    data: { token },
  } = await requestLogin({ username: 'admin', password: '111111' })
  localStorage.setItem('token', token)
  requestUserInfo().then((res) => {
    userInfo.value = res.data
    console.log(userInfo.value)
  })
})
</script>

<template>
  <div class="app-container">
    <router-view></router-view>
    <!--<div>{{ userInfo }}</div>-->
    <!--<SvgIcon name="wode"></SvgIcon>-->
  </div>
</template>

<style scoped lang="scss">
h1 {
  font-size: 16px;
}
</style>
