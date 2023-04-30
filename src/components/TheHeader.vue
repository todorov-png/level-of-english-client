<template>
  <header class="fixed top-0 right-0 left-0 z-5">
    <div class="container py-3 flex align-items-center justify-content-between">
      <router-link to="/">
        <img
          src="@/assets/img/logo.webp"
          alt="logo"
          class="w-3rem sm:w-4rem border-circle cursor-pointer"
        />
      </router-link>
      <h1 class="text-4xl sm:text-5xl lg:text-6xl font-semibold uppercase px-4">{{ titleName }}</h1>
      <Button
        rounded
        severity="info"
        aria-haspopup="true"
        aria-controls="user_menu"
        class="p-0 w-3rem sm:w-4rem h-3rem sm:h-4rem cursor-pointer flex align-items-center justify-content-center"
        @click="toggleUserMenu"
      >
        <i class="pi pi-user sm:text-2xl"></i>
      </Button>
      <Menu
        ref="user_menu"
        id="user_menu"
        class="p-0 mt-3 border-round-2xl overflow-hidden text-xl sm:text-2xl white-space-nowrap w-full sm:w-auto"
        :model="menuItems"
        :popup="true"
      ></Menu>
    </div>
  </header>
</template>

<script>
  import Menu from 'primevue/menu';
  import Button from 'primevue/button';
  import { mapActions } from 'vuex';

  export default {
    components: { Menu, Button },
    data() {
      return {
        menu: [],
      };
    },

    computed: {
      user() {
        return this.$store.state.user || {};
      },

      userPermissions() {
        return this.$store.state.user.permissions || {};
      },

      titleName() {
        switch (this.$route.name) {
          case 'home':
            return this.$t('HEADER.TITLE.HOME');
          case 'profile':
            return this.$t('HEADER.TITLE.PROFILE');
          case 'users':
            return this.$t('HEADER.TITLE.USERS');
          case 'teams':
            return this.$t('HEADER.TITLE.TEAMS');
          // case 'land':
          //   return this.$t('HEADER.TITLE.LAND');
          case 'roles':
            return this.$t('HEADER.TITLE.ROLES');
          default:
            return '404';
        }
      },

      menuItems() {
        const menuIconClass = ' pi pi-fw text-xl sm:text-2xl';
        const menu = [];
        const fullMenu = [
          {
            label: this.$t('HEADER.MENU.PROFILE'),
            icon: 'pi-user',
            to: '/profile',
          },
          {
            permissions: ['assignRole', 'assignTeam', 'createUser', 'deleteUser'],
            label: this.$t('HEADER.MENU.USERS'),
            icon: 'pi-users',
            to: '/users',
          },
          {
            permissions: ['createTeam', 'deleteTeam'],
            label: this.$t('HEADER.MENU.TEAMS'),
            icon: 'pi-globe',
            to: '/teams',
          },
          {
            permissions: ['createRole', 'deleteRole'],
            label: this.$t('HEADER.MENU.ROLES'),
            icon: 'pi-shield',
            to: '/roles',
          },
          { separator: true },
          {
            label: this.$t('HEADER.MENU.LOG_OUT'),
            icon: 'pi-sign-out',
            command: this.logoutUser,
          },
        ];
        fullMenu.forEach((menuItem) => {
          if (menuItem?.label) {
            menuItem.icon += menuIconClass;
            if (
              !menuItem.permissions ||
              menuItem.permissions.some((item) => this.userPermissions[item])
            ) {
              delete menuItem.permissions;
              menu.push(menuItem);
            }
          } else {
            menu.push(menuItem);
          }
        });
        return menu;
      },
    },

    methods: {
      ...mapActions(['logout']),

      async logoutUser() {
        const response = await this.logout();
        if (response.success) {
          this.$router.push({ name: 'login' });
        } else {
          this.$toast.add({
            severity: 'error',
            summary: this.$t('TOAST.SUMMARY.ERROR'),
            detail: response.messageError,
            life: 3000,
          });
        }
      },

      toggleUserMenu(event) {
        this.$refs.user_menu.toggle(event);
      },
    },
  };
</script>
