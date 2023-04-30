<template>
  <div class="lands-container">
    <LandCard v-for="(lend, index) in lands" :key="index" :data="lend" />
  </div>
</template>

<script>
  import LandCard from '@/components/home/LandCard.vue';

  export default {
    components: { LandCard },
    props: {
      lands: {
        type: Array,
        required: true,
      },
    },
  };
</script>

<style lang="scss">
  .lands-container {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    justify-content: space-between;
    & > div {
      width: 30%;
      margin-bottom: 20px;
    }
  }
</style>
