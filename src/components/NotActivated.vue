<template>
  <div class="h-full flex align-items-center justify-content-center">
    <Card class="max-w-30rem text-center">
      <template #header>
        <img class="w-11rem h-11rem pt-4 px-4 mx-auto" alt="email" :src="PathEmailSvg" />
      </template>
      <template #title>
        <h2 class="text-4xl">{{ $t('NOT_ACTIVATED.TITLE') }}</h2>
      </template>
      <template #subtitle>
        <h3 class="text-2xl">{{ $t('NOT_ACTIVATED.SUBTITLE') }}</h3>
      </template>
      <template #content>
        <p class="text-xl">{{ $t('NOT_ACTIVATED.CONTENT') }}</p>
      </template>
      <template #footer>
        <Button
          icon="pi pi-send"
          :label="$t('NOT_ACTIVATED.BUTTON')"
          @click="confirmSendEmail($event)"
        ></Button>
      </template>
    </Card>
  </div>
</template>

<script>
  import Card from 'primevue/card';
  import Button from 'primevue/button';
  import EmailSvg from '@/assets/img/svg/email.svg';
  import UserService from '@/services/UserService';

  export default {
    components: { Card, Button },

    data() {
      return {
        PathEmailSvg: EmailSvg,
      };
    },

    methods: {
      async sendNewActivationCode() {
        try {
          await UserService.sendActivationCode();
          this.$toast.add({
            severity: 'success',
            summary: this.$t('NOT_ACTIVATED.TOAST_SEND_CODE.SUMMARY'),
            detail: this.$t('NOT_ACTIVATED.TOAST_SEND_CODE.DETAIL'),
            life: 3000,
          });
        } catch (e) {
          let messageError = this.$t('TOAST.DETAIL.SERVER_ERROR');
          if (e.response?.data?.message) {
            messageError = e.response.data.message;
          }
          this.$toast.add({
            severity: 'error',
            summary: this.$t('TOAST.SUMMARY.ERROR'),
            detail: messageError,
            life: 3000,
          });
        }
      },

      confirmSendEmail(event) {
        this.$confirm.require({
          target: event.currentTarget,
          message: this.$t('NOT_ACTIVATED.CONFIRM'),
          icon: 'pi pi-exclamation-triangle',
          accept: this.sendNewActivationCode,
        });
      },
    },
  };
</script>
