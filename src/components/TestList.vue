<template>
  <DataTable
    v-model:filters="filters"
    :value="tests"
    :globalFilterFields="['name']"
    :rows="10"
    paginator
  >
    <template #empty>{{ $t('TESTS.TABLE.EMPTY') }}</template>
    <template #header>
      <div class="flex flex-wrap align-items-center justify-content-between">
        <div class="flex align-items-center gap-2">
          <span class="text-xl text-900 font-bold">{{ $t('TESTS.TABLE.TITLE') }}</span>
        </div>
        <div class="p-input-icon-left w-auto">
          <i class="pi pi-search" />
          <InputText
            v-model="filters['global'].value"
            class="max-w-12rem"
            :placeholder="$t('TESTS.TABLE.SEARCH')"
          />
        </div>
      </div>
    </template>
    <Column field="name" :header="$t('TESTS.COLUMN.NAME')" />
    <Column>
      <template #body="slotProps">
        <div class="flex align-items-center justify-content-end gap-2">
          <Button icon="pi pi-pencil" severity="info" rounded @click="openStateTest(slotProps)" />
          <Button
            icon="pi pi-trash"
            rounded
            raised
            severity="danger"
            @click="openPassageTest(slotProps)"
          />
        </div>
      </template>
    </Column>
  </DataTable>
</template>

<script>
  import DataTable from 'primevue/datatable';
  import Column from 'primevue/column';
  import Button from 'primevue/button';
  import InputText from 'primevue/inputtext';
  import { FilterMatchMode } from 'primevue/api';
  import { mapActions } from 'vuex';

  export default {
    components: {
      DataTable,
      InputText,
      Column,
      Button,
    },
    data() {
      return {
        filters: { global: { value: null, matchMode: FilterMatchMode.CONTAINS } },
      };
    },

    async created() {
      await this.getData();
    },

    computed: {
      tests() {
        return this.$store.state.tests || [];
      },
      env() {
        return process.env;
      },
    },

    methods: {
      ...mapActions(['getTests']),

      async getData() {
        const response = await this.getTests();
        if (!response.success) {
          this.$toast.add({
            severity: 'error',
            summary: this.$t('TOAST.SUMMARY.ERROR'),
            detail: response.messageError,
            life: 3000,
          });
        }
      },
    },
  };
</script>
