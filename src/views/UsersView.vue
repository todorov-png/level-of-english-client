<template>
  <div class="card p-fluid">
    <DataTable
      v-model:filters="filters"
      v-model="balanceFrozen"
      :value="users"
      :loading="loading"
      :globalFilterFields="[
        'username',
        'email',
        'registrationDate',
        'activationDate',
        'role.name',
        'team.name',
      ]"
      :rows="10"
      scrollable
      paginator
    >
      <template #empty>{{ $t('USERS.TABLE.EMPTY') }}</template>
      <template #loading>{{ $t('USERS.TABLE.LOADING') }}</template>
      <template #header>
        <div class="flex flex-wrap align-items-center justify-content-between">
          <div class="flex align-items-center gap-2">
            <span class="text-xl text-900 font-bold">{{ $t('USERS.TABLE.TITLE') }}</span>
            <Button
              v-if="userPermissions.createUser"
              icon="pi pi-plus"
              rounded
              raised
              @click="openNewUser"
            />
          </div>
          <div class="p-input-icon-left w-auto">
            <i class="pi pi-search" />
            <InputText
              v-model="filters['global'].value"
              class="max-w-12rem"
              :placeholder="$t('USERS.TABLE.SEARCH')"
            />
          </div>
        </div>
      </template>
      <Column field="username" :header="$t('USERS.COLUMN.USERNAME')" sortable frozen class="z-1" />
      <Column field="email" :header="$t('USERS.COLUMN.EMAIL')" sortable />
      <Column field="registrationDate" :header="$t('USERS.COLUMN.DATE_REGISTRATION')" sortable />
      <Column field="activationDate" :header="$t('USERS.COLUMN.DATE_ACTIVATION')" sortable />
      <Column field="role.name" :header="$t('USERS.COLUMN.ROLE')" sortable />
      <Column field="team.name" :header="$t('USERS.COLUMN.TEAM')" sortable />
      <Column>
        <template #body="slotProps">
          <div class="flex align-items-center justify-content-end gap-2">
            <Button
              v-if="userPermissions.assignRole || userPermissions.assignTeam"
              icon="pi pi-pencil"
              severity="info"
              rounded
              @click="openChangeModal(slotProps)"
            />
            <Button
              v-if="userPermissions.deleteUser"
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
      :header="$t('USERS.CREATE_USER.HEADER')"
      :modal="true"
    >
      <div class="field">
        <label for="username">{{ $t('USERS.CREATE_USER.USERNAME') }}</label>
        <InputText
          id="username"
          v-model.trim="user.username"
          :class="{ 'p-invalid': submitted && !user.username }"
        />
        <small class="p-error" v-if="submitted && !user.username">
          {{ $t('USERS.CREATE_USER.EMPTY_USERNAME') }}
        </small>
      </div>
      <div class="field">
        <label for="email">{{ $t('USERS.CREATE_USER.EMAIL') }}</label>
        <InputText
          id="email"
          type="email"
          v-model.trim="user.email"
          :class="{ 'p-invalid': submitted && !user.email }"
        />
        <small class="p-error" v-if="submitted && !user.email">
          {{ $t('USERS.CREATE_USER.EMPTY_EMAIL') }}
        </small>
      </div>
      <div class="field">
        <label for="password">{{ $t('USERS.CREATE_USER.PASSWORD') }}</label>
        <InputText
          id="password"
          type="password"
          v-model.trim="user.password"
          :class="{ 'p-invalid': submitted && !user.password }"
        />
        <small class="p-error" v-if="submitted && !user.password">
          {{ $t('USERS.CREATE_USER.EMPTY_PASSWORD') }}
        </small>
      </div>
      <div class="field" v-if="userPermissions.assignRole">
        <label for="role">{{ $t('USERS.CREATE_USER.ROLE.LABEL') }}</label>
        <Dropdown
          id="role"
          v-model="selectedRole"
          :options="roles"
          :placeholder="$t('USERS.CREATE_USER.ROLE.DROPDOWN')"
          optionLabel="name"
          class="w-full"
          filter
        />
      </div>
      <div class="field" v-if="userPermissions.assignTeam">
        <label for="team">{{ $t('USERS.CREATE_USER.TEAM.LABEL') }}</label>
        <Dropdown
          id="team"
          v-model="selectedTeam"
          :options="teams"
          :placeholder="$t('USERS.CREATE_USER.TEAM.DROPDOWN')"
          optionLabel="name"
          class="w-full"
          filter
        />
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
          @click="createUser"
        />
      </template>
    </Dialog>

    <Dialog
      v-model:visible="changeDialog"
      class="p-fluid w-full max-w-30rem"
      :header="$t('USERS.CHANGE_USER.HEADER')"
      :modal="true"
    >
      <div class="field">
        <label for="username">{{ $t('USERS.CHANGE_USER.USERNAME') }}</label>
        <InputText id="username" :placeholder="selectedUser.username" disabled />
      </div>
      <div class="field">
        <label for="email">{{ $t('USERS.CHANGE_USER.EMAIL') }}</label>
        <InputText id="email" :placeholder="selectedUser.email" disabled />
      </div>
      <div class="field" v-if="userPermissions.assignRole">
        <label for="role">{{ $t('USERS.CHANGE_USER.ROLE.LABEL') }}</label>
        <Dropdown
          id="role"
          v-model="selectedRole"
          :options="roles"
          :placeholder="$t('USERS.CHANGE_USER.ROLE.DROPDOWN')"
          optionLabel="name"
          class="w-full"
          filter
        />
      </div>
      <div class="field" v-if="userPermissions.assignTeam">
        <label for="team">{{ $t('USERS.CHANGE_USER.TEAM.LABEL') }}</label>
        <Dropdown
          id="team"
          v-model="selectedTeam"
          :options="teams"
          :placeholder="$t('USERS.CHANGE_USER.TEAM.DROPDOWN')"
          optionLabel="name"
          class="w-full"
          filter
        />
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
          @click="updateUser"
        />
      </template>
    </Dialog>

    <Dialog
      v-model:visible="deleteDialog"
      class="p-fluid w-full max-w-30rem"
      :header="$t('USERS.DELETE_USER.HEADER')"
      :modal="true"
    >
      <div class="confirmation-content">
        <i class="pi pi-exclamation-triangle mr-3" style="font-size: 2rem" />
        <span
          v-if="selectedUser"
          v-html="$t('USERS.DELETE_USER.USER', { name: selectedUser.username })"
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
          @click="deleteUser"
        />
      </template>
    </Dialog>
  </div>
</template>

<script>
  import UserService from '@/services/UserService';
  import RoleService from '@/services/RoleService';
  import TeamService from '@/services/TeamService';
  import Button from 'primevue/button';
  import Dialog from 'primevue/dialog';
  import Column from 'primevue/column';
  import DataTable from 'primevue/datatable';
  import InputText from 'primevue/inputtext';
  import Dropdown from 'primevue/dropdown';
  import { FilterMatchMode } from 'primevue/api';
  import { showCatchMessage } from '@/helpers/showCatch.js';
  import { formatDate } from '@/helpers/formatDate.js';

  export default {
    components: { DataTable, Column, InputText, Button, Dialog, Dropdown },
    data() {
      return {
        balanceFrozen: false,
        loading: false,
        filters: { global: { value: null, matchMode: FilterMatchMode.CONTAINS } },
        users: [],
        user: {},
        submitted: false,
        createDialog: false,
        changeDialog: false,
        deleteDialog: false,
        selectedUser: null,
        selectedRole: null,
        selectedTeam: null,
        selectedUserIndex: null,
        roles: [{ name: '------', _id: null }],
        teams: [{ name: '------', _id: null }],
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
          if (this.userPermissions.assignRole) {
            const responseRoles = await RoleService.fetchRolesList();
            const roles = responseRoles.data || [];
            this.roles.push(...roles);
          }

          if (this.userPermissions.assignTeam) {
            const responseTeams = await TeamService.fetchTeamsList();
            const teams = responseTeams.data || [];
            this.teams.push(...teams);
          }

          const responseUsers = await UserService.fetchUsers();
          const users = responseUsers.data || [];
          this.users.push(...users.reverse().map((user) => this.formattingUser(user)));
        } catch (e) {
          showCatchMessage.call(this, e);
        } finally {
          this.loading = false;
        }
      },

      formattingUser(user) {
        user.registrationDate = user.registrationDate
          ? formatDate(user.registrationDate)
          : '------';
        user.activationDate = user.activationDate ? formatDate(user.activationDate) : '------';
        user.role ? null : (user.role = { name: '------', _id: null });
        user.team ? null : (user.team = { name: '------', _id: null });
        return user;
      },

      openNewUser() {
        this.user = {};
        this.selectedRole = this.roles[0];
        this.selectedTeam = this.teams[0];
        this.submitted = false;
        this.createDialog = true;
      },

      async createUser() {
        if (this.user.username?.trim() && this.user.email?.trim() && this.user.password?.trim()) {
          const data = {
            username: this.user.username.toLowerCase(),
            email: this.user.email.toLowerCase(),
            password: this.user.password,
            role: this.selectedRole._id,
            team: this.selectedTeam._id,
          };
          try {
            const response = await UserService.createUser(data);
            this.$toast.add({
              severity: 'success',
              summary: this.$t('TOAST.SUMMARY.SUCCESSFUL'),
              detail: this.$t('USERS.CREATE_USER.SUCCESSFUL'),
              life: 3000,
            });
            this.users.unshift(
              this.formattingUser({
                _id: response.data._id,
                username: data.username,
                email: data.email,
                activationDate: response.data.date,
                registrationDate: response.data.date,
                role: this.selectedRole,
                team: this.selectedTeam,
              })
            );
            this.createDialog = false;
            this.user = {};
          } catch (e) {
            showCatchMessage.call(this, e);
          }
        } else {
          this.submitted = true;
        }
      },

      openChangeModal(event) {
        this.changeDialog = true;
        this.selectedUser = event.data;
        this.selectedUserIndex = event.index;
        this.selectedRole = event.data.role;
        this.selectedTeam = event.data.team;
      },

      hideChangeModal() {
        this.changeDialog = false;
      },

      async updateUser() {
        const data = {
          userId: this.selectedUser._id,
          roleId: this.selectedRole._id,
          teamId: this.selectedTeam._id,
        };
        try {
          const response = await UserService.editUser(data);
          this.$toast.add({
            severity: 'success',
            summary: this.$t('TOAST.SUMMARY.SUCCESSFUL'),
            detail: this.$t('USERS.CHANGE_USER.SUCCESSFUL'),
            life: 3000,
          });
          this.users[this.selectedUserIndex] = response.data;
          this.hideChangeModal();
        } catch (e) {
          showCatchMessage.call(this, e);
        }
      },

      openDeleteModal(event) {
        this.selectedUser = event.data;
        this.selectedUserIndex = event.index;
        this.deleteDialog = true;
      },

      hideDeleteModal() {
        this.deleteDialog = false;
      },

      async deleteUser() {
        try {
          await UserService.deleteUser({ user: this.selectedUser._id });
          this.$toast.add({
            severity: 'success',
            summary: this.$t('TOAST.SUMMARY.SUCCESSFUL'),
            detail: this.$t('USERS.DELETE_USER.SUCCESSFUL'),
            life: 3000,
          });
          this.users.splice(this.selectedUserIndex, 1);
          this.hideDeleteModal();
        } catch (e) {
          showCatchMessage.call(this, e);
        }
      },
    },
  };
</script>

