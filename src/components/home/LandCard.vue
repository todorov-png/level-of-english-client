<template>
  <div @click="goToLandPage(data.nameTask)" class="land-card">
    <h4 class="land-card__title">{{ data.nameTask }}</h4>
    <div class="land-card__img">
      <img :src="pathScreenshotsDesktop(data._id)" alt="desktop" />
    </div>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        role: 'admin',
      };
    },
    props: {
      data: {
        type: Object,
        required: true,
      },
    },
    computed: {
      env() {
        return process.env;
      },
    },
    methods: {
      async goToLandPage(nameTask) {
        await this.fetchLand(nameTask);
        this.$router.push({ name: 'land' });
      },
      pathScreenshotsDesktop(id) {
        return `${this.env.VUE_APP_SCREENSHOTS_URL}/${id}/desktop.webp`;
      },
    },
  };
</script>
