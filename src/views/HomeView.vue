<template>
  <NotActivated v-if="!isActivated" />
  <NotTeam v-else-if="!isTeam" />
  <TestList v-else />
</template>

<script>
  import TestList from '@/components/TestList.vue';
  import NotActivated from '@/components/NotActivated.vue';
  import NotTeam from '@/components/NotTeam.vue';

  export default {
    components: { TestList, NotActivated, NotTeam },

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

