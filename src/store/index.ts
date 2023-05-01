import axios from 'axios';
import AuthService from '@/services/AuthService';
import UserService from '@/services/UserService';
import TestService from '@/services/TestService';
import { AuthResponse } from '@/models/response/AuthResponse';
import { createStore } from 'vuex';
import { IUser, IUpdateUser } from '@/models/IUser';
import { API_URL } from '@/http';
import { i18n } from '@/i18n';

export default createStore({
  state() {
    return {
      user: {} as IUser,
      isAuth: false as boolean,
      isLoading: false as boolean,
      tests: [] as Array<any>,
    };
  },
  // getters: {
  //   getUsername(state: any) {
  //     return state.user.username || '';
  //   },
  // },
  mutations: {
    setLoading(state: any, bool: boolean) {
      state.isLoading = bool;
    },

    setAuth(state: any, bool: boolean) {
      state.isAuth = bool;
    },

    setUser(state: any, user: IUser) {
      state.user = user;
    },

    setTests(state: any, tests: [any]) {
      state.tests = tests;
    },
  },

  actions: {
    async login({ commit }: any, userData: any) {
      try {
        const { email, password } = userData;
        const response = await AuthService.login(email, password);
        localStorage.setItem('token', response.data.accessToken);
        commit('setAuth', true);
        commit('setUser', response.data.user);
        return { success: true };
      } catch (e: any) {
        if (e.response?.data?.message) {
          return { success: false, messageError: e.response.data.message };
        }
        return { success: false, messageError: i18n.global.t('TOAST.DETAIL.SERVER_ERROR') };
      }
    },

    async registration({ commit }: any, userData: any) {
      try {
        const { username, email, password, repeatPassword } = userData;
        const response = await AuthService.registration(username, email, password, repeatPassword);
        localStorage.setItem('token', response.data.accessToken);
        commit('setAuth', true);
        commit('setUser', response.data.user);
        return { success: true };
      } catch (e: any) {
        if (e.response?.data?.message) {
          return { success: false, messageError: e.response.data.message };
        }
        return { success: false, messageError: i18n.global.t('TOAST.DETAIL.SERVER_ERROR') };
      }
    },

    async logout({ commit }: any) {
      try {
        await AuthService.logout();
        localStorage.removeItem('token');
        commit('setAuth', false);
        commit('setUser', {} as IUser);
        return { success: true };
      } catch (e: any) {
        if (e.response?.data?.message) {
          return { success: false, messageError: e.response.data.message };
        }
        return { success: false, messageError: i18n.global.t('TOAST.DETAIL.SERVER_ERROR') };
      }
    },

    async checkAuth({ commit }: any) {
      commit('setLoading', true);
      try {
        if (localStorage.getItem('token')) {
          const response = await axios.get<AuthResponse>(`${API_URL}/refresh`, {
            withCredentials: true,
          });
          localStorage.setItem('token', response.data.accessToken);
          commit('setAuth', true);
          commit('setUser', response.data.user);
          return true;
        }
        return false;
      } catch (e: any) {
        return false;
      } finally {
        commit('setLoading', false);
      }
    },

    checkPermissions({ state }: any, namePage: string) {
      const permissions = state.user.permissions || {};
      switch (namePage) {
        case 'users':
          return !!(
            permissions.assignRole ||
            permissions.assignTeam ||
            permissions.deleteUser ||
            permissions.createUser
          );
        case 'teams':
          return !!(permissions.createTeam || permissions.deleteTeam || permissions.assignTest);
        case 'roles':
          return !!(permissions.createRole || permissions.deleteRole);
        default:
          return true;
      }
    },

    async updateUser({ commit }: any, userData: IUpdateUser) {
      try {
        const response = await UserService.updateUser(userData);
        commit('setUser', response.data);
        return { success: true };
      } catch (e: any) {
        if (e.response?.data?.message) {
          return { success: false, messageError: e.response.data.message };
        }
        return { success: false, messageError: i18n.global.t('TOAST.DETAIL.SERVER_ERROR') };
      }
    },

    async getTests({ commit }: any) {
      try {
        commit('setLoading', true);
        const response = await TestService.getTests();
        commit('setLoading', false);
        commit('setTests', response.data);
        return { success: true };
      } catch (e: any) {
        if (e.response?.data?.message) {
          return { success: false, messageError: e.response.data.message };
        }
        return { success: false, messageError: i18n.global.t('TOAST.DETAIL.SERVER_ERROR') };
      }
    },
  },
});

