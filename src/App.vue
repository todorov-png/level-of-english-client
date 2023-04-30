<template>
  <div
    class="absolute top-0 bottom-0 left-0 right-0 flex-wrap align-content-center z-5 opacity-90 bg-primary-reverse"
    :class="isLoading ? 'flex' : 'hidden'"
  >
    <ProgressSpinner strokeWidth="5" />
  </div>
  <ConfirmPopup class="m-auto w-max max-w-30rem h-content-max top-0 right-0 bottom-0 left-0" />
  <Toast />
  <RouterView />
</template>

<script>
  import Toast from 'primevue/toast';
  import ConfirmPopup from 'primevue/confirmpopup';
  import ProgressSpinner from 'primevue/progressspinner';

  export default {
    components: { ConfirmPopup, Toast, ProgressSpinner },

    created() {
      document.body.scrollTop = 0;
      window.addEventListener('resize', this.onResize, true);
      window.addEventListener('touchmove', this.onResize, true);
      this.onResize();
    },

    unmounted() {
      window.removeEventListener('resize', this.onResize, true);
      window.removeEventListener('touchmove', this.onResize, true);
    },

    computed: {
      isLoading() {
        return this.$store.state.isLoading;
      },
    },

    methods: {
      onResize() {
        const vh = window.innerHeight * 0.01;
        document.documentElement.style.setProperty('--vh', `${vh}px`);
      },
    },
  };
</script>
