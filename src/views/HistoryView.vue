<template>
  <div class="card p-fluid">
    <DataTable
      v-model:filters="filters"
      :rows="10"
      :value="history"
      :loading="loading"
      :globalFilterFields="['name', 'attempts', 'scoreMax']"
      editMode="row"
      dataKey="name"
      paginator
    >
      <template #empty>{{ $t('HISTORY.TABLE.EMPTY') }}</template>
      <template #loading>{{ $t('HISTORY.TABLE.LOADING') }}</template>
      <template #header>
        <div class="flex flex-wrap align-items-center justify-content-between">
          <div class="flex align-items-center gap-2">
            <span class="text-xl text-900 font-bold">{{ $t('HISTORY.TABLE.TITLE') }}</span>
          </div>
          <div class="p-input-icon-left w-auto">
            <i class="pi pi-search" />
            <InputText
              v-model="filters['global'].value"
              class="max-w-12rem"
              :placeholder="$t('HISTORY.TABLE.SEARCH')"
            />
          </div>
        </div>
      </template>
      <Column field="name" :header="$t('HISTORY.COLUMN.NAME')" />
      <Column field="attempts" :header="$t('HISTORY.COLUMN.ATTEMPTS')" />
      <Column field="gpa" :header="$t('HISTORY.COLUMN.GPA')" />
      <Column field="scoreMax" :header="$t('HISTORY.COLUMN.SCORE_MAX')" />
    </DataTable>
  </div>
</template>

<script>
  import HistoryService from '@/services/HistoryService';
  import DataTable from 'primevue/datatable';
  import Column from 'primevue/column';
  import InputText from 'primevue/inputtext';
  import { FilterMatchMode } from 'primevue/api';
  import { showCatchMessage } from '@/helpers/showCatch.js';

  export default {
    components: { DataTable, Column, InputText },
    data() {
      return {
        loading: false,
        filters: { global: { value: null, matchMode: FilterMatchMode.CONTAINS } },
        history: [],
      };
    },

    async created() {
      await this.getData();
    },

    computed: {
      userPermissions() {
        return this.$store.state.user.permissions || {};
      },
    },

    methods: {
      async getData() {
        this.loading = true;
        try {
          const response = await HistoryService.getAll();
          const data = {};
          response.data.forEach((item) => {
            const id = item.test._id;
            data[id] ? null : (data[id] = {});
            data[id].name = item.test.name;
            data[id].attempts ? (data[id].attempts += 1) : (data[id].attempts = 1);
            data[id].sum
              ? (data[id].sum += item.correctAnswers)
              : (data[id].sum = item.correctAnswers);
            data[id].scoreMax
              ? data[id].scoreMax < item.correctAnswers
                ? (data[id].scoreMax = item.correctAnswers)
                : null
              : (data[id].scoreMax = item.correctAnswers);
          });
          for (var key in data) {
            data[key].gpa = (data[key].sum / data[key].attempts).toFixed(2);
            this.history.push(data[key]);
          }
        } catch (e) {
          showCatchMessage.call(this, e);
        } finally {
          this.loading = false;
        }
      },
    },
  };
</script>

