<template>
  <TheHeader />
  <div class="main-container container mt-5">
    <RouterView />
  </div>
</template>

<script>
  import TheHeader from '@/components/TheHeader.vue';

  export default {
    components: { TheHeader },
  };
</script>
