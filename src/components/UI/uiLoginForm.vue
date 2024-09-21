<template>
  <form action="" class="login-form">
    <label for="email" class="login-form__label">Email</label>
    <input
      v-model="form.email"
      type="text"
      placeholder="Enter email..."
    />

    <label for="password" class="login-form__label">Password</label>
    <input
      v-model="form.password"
      type="password"
      placeholder="Enter password..."
    />

    <button
      @click.prevent="logIn"
    >
      Log in
    </button>
  </form>

  <div class="info-message-block">
    <h4> {{ props.admin ? 'Wrong page, are you an admin?' : 'Don\'t have an account yet?' }}</h4>
    <p>Follow <a href="#" @click="router.push({name: 'register'})" class="login-form__link">this link</a> to get registered {{ props.admin ? 'as user' : ''}}</p>
  </div>

</template>

<script setup lang="ts">
import {defineProps, ref} from "vue";
import type { UserLogin, PropsObject } from '@/interfaces';
import {  useRouter, Router } from 'vue-router'
const router: Router = useRouter();
import { signInWithEmailAndPassword } from "firebase/auth";
import "firebase/database";
import { auth } from '@/firebase.js';
import { useLocalStorage } from '@vueuse/core';
const isAuthorized = useLocalStorage<string>('authorized', 'false', {
  mergeDefaults: true
})

const props = defineProps<PropsObject>();

const form = ref<UserLogin>({
  email: '',
  password: ''
})

const logIn = async () => {

  try {
    const userData = await signInWithEmailAndPassword(auth, form.value.email, form.value.password);

    isAuthorized.value = 'true'
    console.log('is ADMIN', props.admin)

    props.admin ? router.push({name: 'admin-users', params: { userId: userData.user.uid }}) : router.push({name: 'users-list-auth', params: { userId: userData.user.uid }})

  } catch (error) {
    console.error('Ошибка входа:', error);
  }
};

</script>

<style scoped lang="scss">
.login-form {
  max-width: 500px;
  margin: 0 auto 30px;
  text-align: left;
  &__label {
    display: block;
    margin-bottom: 5px;
  }
  & > input {
    display: block;
    margin-bottom: 15px;
    min-width: 100%;
    padding: 10px 15px;
    border-radius: 12px;
    border: none;
    box-shadow: 1px 1px 3px gray;

    &:focus {
      outline: none;
      box-shadow: 1px 1px 4px gray inset;
    }
    &:last-of-type {
      margin-bottom: 30px;
    }
  }
  &__link {
    text-decoration: none;
    color: brown;
    font-size: 1rem;
    &:hover {
      text-decoration: underline;
    }
  }
}
.info-message-block {
  width: fit-content;
  margin: auto;
}
</style>
