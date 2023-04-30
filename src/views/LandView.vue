<template>
  <div class="content">
    <h2>Info land</h2>
    <p>{{ dataLand }}</p>
    <div style="display: flex; align-items: center; justify-content: space-between">
      <div style="max-width: 49%; max-height: 500px; overflow: auto">
        <img style="width: 100%" :src="pathScreenshotsDesktop(dataLand._id)" alt="desktop" />
      </div>
      <div style="max-width: 49%; max-height: 500px; overflow: auto">
        <img style="width: 100%" :src="pathScreenshotsMobile(dataLand._id)" alt="mobile" />
      </div>
    </div>
  </div>
</template>

<script>
  import { mapGetters } from 'vuex';

  export default {
    name: 'LandView',
    async created() {
      this.dataLand = this.getLand;
      if (!Object.keys(this.dataLand).length) this.$router.push({ name: 'home' });
    },
    data() {
      return {
        dataLand: {},
      };
    },
    computed: {
      ...mapGetters(['getLand']),
      env() {
        return process.env;
      },
    },
    methods: {
      pathScreenshotsMobile(id) {
        return `${this.env.VUE_APP_SCREENSHOTS_URL}/${id}/mobile.webp`;
      },
      pathScreenshotsDesktop(id) {
        return `${this.env.VUE_APP_SCREENSHOTS_URL}/${id}/desktop.webp`;
      },
    },
  };
</script>

<style lang="scss" scoped>
  h2 {
    margin: 0 auto 20px;
    text-align: center;
    font-size: 30px;
    line-height: 130%;
  }
</style>
