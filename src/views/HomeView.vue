<template>
  <NotActivated v-if="!isActivated" />
  <NotTeam v-else-if="!isTeam" />
  <ProductsList v-else />
</template>

<script>
  import ProductsList from '@/components/ProductsList.vue';
  import NotActivated from '@/components/NotActivated.vue';
  import NotTeam from '@/components/NotTeam.vue';

  export default {
    components: { ProductsList, NotActivated, NotTeam },

    computed: {
      isActivated() {
        return this.$store.state.user.isActivated || false;
      },

      isTeam() {
        return this.$store.state.user.isTeam || false;
      },
    },
  };
</script>

