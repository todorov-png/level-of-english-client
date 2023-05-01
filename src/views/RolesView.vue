<template>
  <div class="card p-fluid">
    <DataTable
      v-model:filters="filters"
      v-model:editingRows="editingRows"
      v-model:selection="selectedRoles"
      v-model="balanceFrozen"
      :rows="10"
      :value="roles"
      :loading="loading"
      :globalFilterFields="['name']"
      editMode="row"
      dataKey="name"
      scrollable
      paginator
      @row-edit-save="onRowEditSave"
    >
      <template #empty>{{ $t('ROLES.TABLE.EMPTY') }}</template>
      <template #loading>{{ $t('ROLES.TABLE.LOADING') }}</template>
      <template #header>
        <div class="flex flex-wrap align-items-center justify-content-between">
          <div class="flex align-items-center gap-2">
            <span class="text-xl text-900 font-bold">{{ $t('ROLES.TABLE.TITLE') }}</span>
            <Button
              v-if="userPermissions.createRole"
              icon="pi pi-plus"
              rounded
              raised
              @click="openNewRole"
            />
            <Button
              v-if="userPermissions.deleteRole"
              icon="pi pi-trash"
              rounded
              raised
              severity="danger"
              @click="confirmDeleteSelected"
              :disabled="!selectedRoles || !selectedRoles.length"
            />
          </div>
          <div class="p-input-icon-left w-auto">
            <i class="pi pi-search" />
            <InputText
              v-model="filters['global'].value"
              class="max-w-12rem"
              :placeholder="$t('ROLES.TABLE.SEARCH')"
            />
          </div>
        </div>
      </template>
      <Column
        v-if="userPermissions.deleteRole"
        selectionMode="multiple"
        frozen
        style="width: 3rem"
        :exportable="false"
        class="z-1"
      />
      <Column field="name" :header="$t('ROLES.PERMISSIONS.NAME')" sortable frozen class="z-1">
        <template #editor="{ data, field }">
          <InputText v-model="data[field]" />
        </template>
      </Column>
      <Column field="createTeam" :header="$t('ROLES.PERMISSIONS.CREATE_TEAM')">
        <template #editor="{ data, field }">
          <Checkbox v-model="data[field]" :binary="true" />
        </template>
      </Column>
      <Column field="assignTeam" :header="$t('ROLES.PERMISSIONS.ASSIGN_TEAM')">
        <template #editor="{ data, field }">
          <Checkbox v-model="data[field]" :binary="true" />
        </template>
      </Column>
      <Column field="deleteTeam" :header="$t('ROLES.PERMISSIONS.DELETE_TEAM')">
        <template #editor="{ data, field }">
          <Checkbox v-model="data[field]" :binary="true" />
        </template>
      </Column>
      <Column field="createRole" :header="$t('ROLES.PERMISSIONS.CREATE_ROLE')">
        <template #editor="{ data, field }">
          <Checkbox v-model="data[field]" :binary="true" />
        </template>
      </Column>
      <Column field="assignRole" :header="$t('ROLES.PERMISSIONS.ASSIGN_ROLE')">
        <template #editor="{ data, field }">
          <Checkbox v-model="data[field]" :binary="true" />
        </template>
      </Column>
      <Column field="deleteRole" :header="$t('ROLES.PERMISSIONS.DELETE_ROLE')">
        <template #editor="{ data, field }">
          <Checkbox v-model="data[field]" :binary="true" />
        </template>
      </Column>
      <Column field="createUser" :header="$t('ROLES.PERMISSIONS.CREATE_USER')">
        <template #editor="{ data, field }">
          <Checkbox v-model="data[field]" :binary="true" />
        </template>
      </Column>
      <Column field="deleteUser" :header="$t('ROLES.PERMISSIONS.DELETE_USER')">
        <template #editor="{ data, field }">
          <Checkbox v-model="data[field]" :binary="true" />
        </template>
      </Column>
      <Column field="assignTest" :header="$t('ROLES.PERMISSIONS.ASSIGN_TEST')">
        <template #editor="{ data, field }">
          <Checkbox v-model="data[field]" :binary="true" />
        </template>
      </Column>
      <Column
        v-if="userPermissions.createRole"
        :rowEditor="true"
        style="width: 10%; min-width: 8rem"
        headerStyle="justify-content: center;"
        bodyStyle="text-align: center;"
      />
    </DataTable>

    <Dialog
      v-model:visible="createDialog"
      class="p-fluid w-full max-w-30rem"
      :header="$t('ROLES.CREATE_ROLE.HEADER')"
      :modal="true"
    >
      <div class="field">
        <label for="name">{{ $t('ROLES.CREATE_ROLE.NAME') }}</label>
        <InputText
          id="name"
          v-model.trim="role.name"
          :class="{ 'p-invalid': submitted && !role.name }"
        />
        <small class="p-error" v-if="submitted && !role.name">
          {{ $t('ROLES.CREATE_ROLE.EMPTY_NAME') }}
        </small>
      </div>
      <div class="field">
        <label class="mb-3">{{ $t('ROLES.CREATE_ROLE.PERMISSIONS') }}</label>
        <div class="formgrid grid">
          <div v-for="(item, index) in permissions" :key="index" class="field-checkbox col-6">
            <Checkbox :inputId="item" v-model="role[item]" :binary="true" />
            <label :for="item">{{ item }}</label>
          </div>
        </div>
      </div>
      <template #footer>
        <Button
          :label="$t('CONFIRM_MODAL.BUTTONS.CANCEL')"
          icon="pi pi-times"
          text
          @click="createDialog = false"
        />
        <Button
          :label="$t('CONFIRM_MODAL.BUTTONS.CREATE')"
          icon="pi pi-check"
          text
          @click="createRole"
        />
      </template>
    </Dialog>

    <Dialog
      v-model:visible="deleteRoleDialog"
      class="p-fluid w-full max-w-30rem"
      :header="$t('ROLES.DELETE_ROLE.HEADER')"
      :modal="true"
    >
      <div class="confirmation-content">
        <i class="pi pi-exclamation-triangle mr-3" style="font-size: 2rem" />
        <span
          v-if="selectedRoles[0]"
          v-html="$t('ROLES.DELETE_ROLE.ROLE', { name: selectedRoles[0].name })"
        ></span>
      </div>
      <template #footer>
        <Button
          icon="pi pi-times"
          text
          :label="$t('CONFIRM_MODAL.BUTTONS.NO')"
          @click="deleteRoleDialog = false"
        />
        <Button
          :label="$t('CONFIRM_MODAL.BUTTONS.YES')"
          icon="pi pi-check"
          text
          @click="deleteRole"
        />
      </template>
    </Dialog>

    <Dialog
      v-model:visible="deleteRolesDialog"
      class="p-fluid w-full max-w-30rem"
      :header="$t('ROLES.DELETE_ROLE.HEADER')"
      :modal="true"
    >
      <div class="confirmation-content">
        <i class="pi pi-exclamation-triangle mr-3" style="font-size: 2rem" />
        <span v-if="role">{{ $t('ROLES.DELETE_ROLE.ROLES') }}</span>
      </div>
      <template #footer>
        <Button
          :label="$t('CONFIRM_MODAL.BUTTONS.NO')"
          icon="pi pi-times"
          text
          @click="deleteRolesDialog = false"
        />
        <Button
          :label="$t('CONFIRM_MODAL.BUTTONS.YES')"
          icon="pi pi-check"
          text
          @click="deleteSelectedRoles"
        />
      </template>
    </Dialog>
  </div>
</template>

<script>
  import RoleService from '@/services/RoleService';
  import DataTable from 'primevue/datatable';
  import Column from 'primevue/column';
  import InputText from 'primevue/inputtext';
  import Checkbox from 'primevue/checkbox';
  import Button from 'primevue/button';
  import Dialog from 'primevue/dialog';
  import { FilterMatchMode } from 'primevue/api';
  import { showCatchMessage } from '@/helpers/showCatch.js';

  export default {
    components: { DataTable, Column, InputText, Checkbox, Button, Dialog },
    data() {
      return {
        editingRows: [],
        selectedRoles: null,
        submitted: false,
        balanceFrozen: false,
        createDialog: false,
        deleteRoleDialog: false,
        deleteRolesDialog: false,
        role: {},
        loading: false,
        filters: { global: { value: null, matchMode: FilterMatchMode.CONTAINS } },
        permissions: [
          'createTeam',
          'assignTeam',
          'deleteTeam',
          'createRole',
          'assignRole',
          'deleteRole',
          'createUser',
          'deleteUser',
          'assignTest'
        ],
        roles: [],
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
          const response = await RoleService.fetchRoles();
          const roles = response.data || [];
          this.roles.push(...roles.reverse().map((role) => this.formattingRole(role)));
        } catch (e) {
          showCatchMessage.call(this, e);
        } finally {
          this.loading = false;
        }
      },

      formattingRole(role) {
        const data = { _id: role._id, name: role.name.toLowerCase() };
        this.permissions.forEach(
          (permission) =>
            (data[permission] = (role.permissions && role.permissions[permission]) || false)
        );
        return data;
      },

      openNewRole() {
        this.role = {};
        this.submitted = false;
        this.createDialog = true;
      },

      async createRole() {
        if (this.role.name?.trim()) {
          const data = { name: this.role.name.toLowerCase(), permissions: {} };
          this.permissions.forEach((item) =>
            this.role[item] ? (data.permissions[item] = true) : null
          );
          try {
            const response = await RoleService.createRole(data);
            this.$toast.add({
              severity: 'success',
              summary: this.$t('TOAST.SUMMARY.SUCCESSFUL'),
              detail: this.$t('ROLES.CREATE_ROLE.SUCCESSFUL'),
              life: 3000,
            });
            data._id = response.data._id;
            this.roles.unshift(this.formattingRole(data));
            this.createDialog = false;
            this.role = {};
          } catch (e) {
            showCatchMessage.call(this, e);
          }
        } else {
          this.submitted = true;
        }
      },

      confirmDeleteSelected() {
        this.selectedRoles.length === 1
          ? (this.deleteRoleDialog = true)
          : (this.deleteRolesDialog = true);
      },

      async deleteRole() {
        try {
          const roleID = this.selectedRoles[0]._id;
          await RoleService.deleteRole({ role: roleID });
          this.$toast.add({
            severity: 'success',
            summary: this.$t('TOAST.SUMMARY.SUCCESSFUL'),
            detail: this.$t('ROLES.DELETE_ROLE.ONE'),
            life: 3000,
          });
          this.roles = this.roles.filter((val) => !this.selectedRoles.includes(val));
          this.selectedRoles = [];
        } catch (e) {
          showCatchMessage.call(this, e);
        } finally {
          this.deleteRoleDialog = false;
        }
      },

      async deleteSelectedRoles() {
        try {
          const arrayID = this.selectedRoles.map((item) => item._id);
          await RoleService.deleteRoles({ roles: arrayID });
          this.$toast.add({
            severity: 'success',
            summary: this.$t('TOAST.SUMMARY.SUCCESSFUL'),
            detail: this.$t('ROLES.DELETE_ROLE.MANU'),
            life: 3000,
          });
          this.roles = this.roles.filter((val) => !this.selectedRoles.includes(val));
          this.selectedRoles = [];
        } catch (e) {
          showCatchMessage.call(this, e);
        } finally {
          this.deleteRolesDialog = false;
        }
      },

      async onRowEditSave(event) {
        const { newData, index } = event;
        newData.name = newData.name.toLowerCase();
        const newDataFormat = { _id: newData._id, name: newData.name, permissions: {} };
        this.permissions.forEach((permission) =>
          newData[permission] ? (newDataFormat.permissions[permission] = true) : null
        );
        try {
          await RoleService.updateRole(newDataFormat);
          this.$toast.add({
            severity: 'success',
            summary: this.$t('TOAST.SUMMARY.SUCCESSFUL'),
            detail: this.$t('ROLES.UPDATE_ROLE.SUCCESSFUL'),
            life: 3000,
          });
          this.roles[index] = newData;
        } catch (e) {
          showCatchMessage.call(this, e);
        }
      },
    },
  };
</script>

