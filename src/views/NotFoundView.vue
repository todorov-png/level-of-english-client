<template>
  <div class="main-container container flex align-items-center justify-content-center">
    <div class="not-found scalein animation-duration-400">
      <h1 class="not-found__title mb-4">{{ $t('PAGE_NOT_FOUND.TITLE') }}</h1>
      <h2 class="not-found__subtitle mb-4">{{ $t('PAGE_NOT_FOUND.SUBTITLE') }}</h2>
      <router-link :to="{ name: 'home' }" custom v-slot="{ navigate }">
        <Button
          role="link"
          size="large"
          rounded
          raised
          icon="pi pi-home"
          :label="$t('PAGE_NOT_FOUND.BUTTON')"
          @click="navigate"
        />
      </router-link>
    </div>
  </div>
</template>

<script>
  import Button from 'primevue/button';

  export default { components: { Button } };
</script>
