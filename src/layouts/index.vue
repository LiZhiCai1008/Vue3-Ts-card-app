<template>
  <div class="page">
    <router-view v-slot="{ Component }">
      <keep-alive :max="3" :exclude="['Record', 'Redirect', 'Recharge', 'Bind', 'User']">
        <component :is="Component" />
      </keep-alive>
    </router-view>
  </div>
</template>