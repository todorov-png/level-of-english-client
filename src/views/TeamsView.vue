<template>
  <div class="card p-fluid">
    <DataTable
      v-model:filters="filters"
      :value="teams"
      :loading="loading"
      :globalFilterFields="['name']"
      :rows="10"
      scrollable
      paginator
    >
      <template #empty>{{ $t('TEAMS.TABLE.EMPTY') }}</template>
      <template #loading>{{ $t('TEAMS.TABLE.LOADING') }}</template>
      <template #header>
        <div class="flex flex-wrap align-items-center justify-content-between">
          <div class="flex align-items-center gap-2">
            <span class="text-xl text-900 font-bold">{{ $t('TEAMS.TABLE.TITLE') }}</span>
            <Button
              v-if="userPermissions.createTeam"
              icon="pi pi-plus"
              rounded
              raised
              @click="openCreateModal"
            />
          </div>
          <div class="p-input-icon-left w-auto">
            <i class="pi pi-search" />
            <InputText
              v-model="filters['global'].value"
              class="max-w-12rem"
              :placeholder="$t('TEAMS.TABLE.SEARCH')"
            />
          </div>
        </div>
      </template>
      <Column field="name" :header="$t('TEAMS.COLUMN.NAME')" sortable />
      <Column field="members" :header="$t('TEAMS.COLUMN.MEMBERS')" sortable />
      <Column field="linkTg" :header="$t('TEAMS.COLUMN.LINK_IG')" />
      <Column>
        <template #body="slotProps">
          <div class="flex align-items-center justify-content-end gap-2">
            <Button
              v-if="userPermissions.createTeam"
              icon="pi pi-pencil"
              severity="info"
              rounded
              @click="openChangeModal(slotProps)"
            />
            <Button
              v-if="userPermissions.deleteTeam"
              icon="pi pi-trash"
              rounded
              raised
              severity="danger"
              @click="openDeleteModal(slotProps)"
            />
          </div>
        </template>
      </Column>
    </DataTable>

    <Dialog
      v-model:visible="createDialog"
      class="p-fluid w-full max-w-30rem"
      :header="$t('TEAMS.CREATE_TEAM.HEADER')"
      :modal="true"
    >
      <div class="field">
        <label for="create_name">{{ $t('TEAMS.CREATE_TEAM.NAME') }}</label>
        <InputText
          id="create_name"
          v-model.trim="newTeam.name"
          :class="{ 'p-invalid': submitted && !newTeam.name }"
        />
        <small class="p-error" v-if="submitted && !newTeam.name">
          {{ $t('TEAMS.CREATE_TEAM.EMPTY_NAME') }}
        </small>
      </div>
      <div class="field" v-if="userPermissions.assignTest">
        <label for="create-test">{{ $t('TEAMS.CREATE_TEAM.TEST.LABEL') }}</label>
        <MultiSelect
          id="create-test"
          v-model="selectedTests"
          :options="tests"
          :placeholder="$t('TEAMS.CREATE_TEAM.TEST.DROPDOWN')"
          optionLabel="name"
          class="w-full"
          filter
        />
      </div>
      <div class="field">
        <label for="create_link_tg" class="mb-3">{{ $t('TEAMS.CREATE_TEAM.LINK_TG') }}</label>
        <InputText id="create_link_tg" v-model.trim="newTeam.linkTg" />
      </div>
      <template #footer>
        <Button
          :label="$t('CONFIRM_MODAL.BUTTONS.CANCEL')"
          icon="pi pi-times"
          text
          @click="hideCreateModal"
        />
        <Button
          :label="$t('CONFIRM_MODAL.BUTTONS.CREATE')"
          icon="pi pi-check"
          text
          @click="createTeam"
        />
      </template>
    </Dialog>

    <Dialog
      v-model:visible="changeDialog"
      class="p-fluid w-full max-w-30rem"
      :header="$t('TEAMS.CHANGE_TEAM.HEADER')"
      :modal="true"
    >
      <div class="field">
        <label for="change_name">{{ $t('TEAMS.CHANGE_TEAM.NAME') }}</label>
        <InputText
          id="change_name"
          v-model.trim="selectTeam.name"
          :class="{ 'p-invalid': submitted && !selectTeam.name }"
        />
        <small class="p-error" v-if="submitted && !selectTeam.name">
          {{ $t('TEAMS.CHANGE_TEAM.EMPTY_NAME') }}
        </small>
      </div>
      <div class="field" v-if="userPermissions.assignTest">
        <label for="test">{{ $t('TEAMS.CHANGE_TEAM.TEST.LABEL') }}</label>
        <MultiSelect
          id="test"
          v-model="selectedTests"
          :options="tests"
          :placeholder="$t('TEAMS.CHANGE_TEAM.TEST.DROPDOWN')"
          optionLabel="name"
          class="w-full"
          filter
        />
      </div>
      <div class="field">
        <label for="change_link_tg" class="mb-3">{{ $t('TEAMS.CHANGE_TEAM.LINK_TG') }}</label>
        <InputText id="change_link_tg" v-model.trim="selectTeam.linkTg" />
      </div>
      <template #footer>
        <Button
          :label="$t('CONFIRM_MODAL.BUTTONS.CANCEL')"
          icon="pi pi-times"
          text
          @click="hideChangeModal"
        />
        <Button
          :label="$t('CONFIRM_MODAL.BUTTONS.UPDATE')"
          icon="pi pi-check"
          text
          @click="changeTeam"
        />
      </template>
    </Dialog>

    <Dialog
      v-model:visible="deleteDialog"
      class="p-fluid w-full max-w-30rem"
      :header="$t('TEAMS.DELETE_TEAM.HEADER')"
      :modal="true"
    >
      <div class="confirmation-content">
        <i class="pi pi-exclamation-triangle mr-3" style="font-size: 2rem" />
        <span
          v-if="selectTeam"
          v-html="$t('TEAMS.DELETE_TEAM.TEAM', { name: selectTeam.name })"
        ></span>
      </div>
      <template #footer>
        <Button
          :label="$t('CONFIRM_MODAL.BUTTONS.NO')"
          icon="pi pi-times"
          text
          @click="deleteDialog = false"
        />
        <Button
          :label="$t('CONFIRM_MODAL.BUTTONS.YES')"
          icon="pi pi-check"
          text
          @click="deleteTeam"
        />
      </template>
    </Dialog>
  </div>
</template>

<script>
  import TeamService from '@/services/TeamService';
  import TestService from '@/services/TestService';
  import Button from 'primevue/button';
  import Dialog from 'primevue/dialog';
  import DataTable from 'primevue/datatable';
  import Column from 'primevue/column';
  import InputText from 'primevue/inputtext';
  import MultiSelect from 'primevue/multiselect';
  import { FilterMatchMode } from 'primevue/api';
  import { showCatchMessage } from '@/helpers/showCatch.js';

  export default {
    components: { DataTable, Column, InputText, Button, MultiSelect, Dialog },
    data() {
      return {
        submitted: false,
        createDialog: false,
        changeDialog: false,
        deleteDialog: false,
        loading: false,
        filters: { global: { value: null, matchMode: FilterMatchMode.CONTAINS } },
        selectTeamIndex: null,
        selectTeam: {},
        selectedTests: null,
        tests: [],
        newTeam: {},
        teams: [],
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
          const responseTests = await TestService.getList();
          this.tests = responseTests.data || [];
          const responseTeam = await TeamService.getAll();
          const teams = responseTeam.data || [];
          this.teams = teams.reverse().map((team) => {
            if (!team.linkTg) {
              team.linkTg = '------';
            }
            return team;
          });
        } catch (e) {
          showCatchMessage.call(this, e);
        } finally {
          this.loading = false;
        }
      },

      openCreateModal() {
        this.submitted = false;
        this.selectedTests = null;
        this.newTeam = {};
        this.createDialog = true;
      },

      hideCreateModal() {
        this.createDialog = false;
      },

      async createTeam() {
        if (this.newTeam.name?.trim()) {
          try {
            this.newTeam.tests = this.selectedTests.map((item) => item._id);
            const response = await TeamService.create(this.newTeam);
            this.$toast.add({
              severity: 'success',
              summary: this.$t('TOAST.SUMMARY.SUCCESSFUL'),
              detail: this.$t('TEAMS.CREATE_TEAM.SUCCESSFUL'),
              life: 3000,
            });
            this.newTeam._id = response.data._id;
            this.newTeam.name = this.newTeam.name.toLowerCase();
            this.newTeam.members = 0;
            this.teams.unshift(this.newTeam);
            this.hideCreateModal();
          } catch (e) {
            showCatchMessage.call(this, e);
          }
        } else {
          this.submitted = true;
        }
      },

      openChangeModal(event) {
        const data = JSON.parse(JSON.stringify(event.data));
        if (data.linkTg === '------') data.linkTg = '';
        this.submitted = false;
        this.selectTeam = data;
        this.selectedTests = this.tests.filter((item) => data.tests.includes(item._id))
        this.selectTeamIndex = event.index;
        this.changeDialog = true;
      },

      hideChangeModal() {
        this.changeDialog = false;
      },

      async changeTeam() {
        if (this.selectTeam.name?.trim()) {
          try {
            this.selectTeam.tests = this.selectedTests.map((item) => item._id);
            await TeamService.update(this.selectTeam);
            this.$toast.add({
              severity: 'success',
              summary: this.$t('TOAST.SUMMARY.SUCCESSFUL'),
              detail: this.$t('TEAMS.CHANGE_TEAM.SUCCESSFUL'),
              life: 3000,
            });
            const data = this.selectTeam;
            if (!data.linkTg) data.linkTg = '------';
            this.selectTeam.name = this.selectTeam.name.toLowerCase();
            this.teams[this.selectTeamIndex] = data;
            this.hideChangeModal();
          } catch (e) {
            showCatchMessage.call(this, e);
          }
        } else {
          this.submitted = true;
        }
      },

      openDeleteModal(event) {
        this.selectTeam = event.data;
        this.selectTeamIndex = event.index;
        this.deleteDialog = true;
      },

      hideDeleteModal() {
        this.deleteDialog = false;
      },

      async deleteTeam() {
        try {
          await TeamService.delete({ team: this.selectTeam._id });
          this.$toast.add({
            severity: 'success',
            summary: this.$t('TOAST.SUMMARY.SUCCESSFUL'),
            detail: this.$t('TEAMS.DELETE_TEAM.SUCCESSFUL'),
            life: 3000,
          });
          this.teams.splice(this.selectTeamIndex, 1);
          this.hideDeleteModal();
        } catch (e) {
          showCatchMessage.call(this, e);
        }
      },
    },
  };
</script>

