<template>
  <Fieldset class="w-full max-w-27rem mb-8">
    <template #legend>
      <div class="flex align-items-center text-primary">
        <span class="pi pi-user mr-2"></span>
        <span class="font-bold text-lg">{{ $t('AUTH.LOGIN') }}</span>
      </div>
    </template>
    <div class="p-inputgroup mb-2">
      <span class="p-inputgroup-addon">
        <i class="pi pi-at"></i>
      </span>
      <InputText v-model="email" name="email" type="email" :placeholder="$t('AUTH.EMAIL')" />
    </div>
    <div class="p-inputgroup mb-3">
      <span class="p-inputgroup-addon">
        <i class="pi pi-key"></i>
      </span>
      <Password
        v-model="password"
        name="password"
        type="password"
        class="flex"
        :placeholder="$t('AUTH.PASSWORD')"
        :feedback="false"
        toggleMask
      />
    </div>
    <Button
      type="button"
      class="w-full mb-3"
      icon="pi pi-sign-in"
      :label="$t('AUTH.BUTTONS.SING_IN')"
      :loading="loadingSubmit"
      @click="submitForm"
    />
    <router-link :to="{ name: 'register' }" custom v-slot="{ navigate }">
      <Button
        class="w-full"
        severity="secondary"
        role="link"
        outlined
        icon="pi pi-user-plus"
        :label="$t('AUTH.BUTTONS.REGISTRATION')"
        @click="navigate"
      />
    </router-link>
  </Fieldset>
</template>

<script>
  import Fieldset from 'primevue/fieldset';
  import InputText from 'primevue/inputtext';
  import Password from 'primevue/password';
  import Button from 'primevue/button';
  import { mapActions } from 'vuex';

  export default {
    components: {
      Fieldset,
      InputText,
      Password,
      Button,
    },
    data() {
      return {
        email: '',
        password: '',
        loadingSubmit: false,
      };
    },
    methods: {
      ...mapActions(['login']),

      async submitForm() {
        this.loadingSubmit = true;
        const response = await this.login({
          email: this.email,
          password: this.password,
        });
        if (response.success) {
          this.$router.push({ name: 'home' });
        } else {
          this.$toast.add({
            severity: 'error',
            summary: this.$t('TOAST.SUMMARY.ERROR'),
            detail: response.messageError,
            life: 3000,
          });
        }
        this.loadingSubmit = false;
      },
    },
  };
</script>
