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

    <p class="info-message " :class="isAuthorized === 'false' ? 'error' : 'success'">{{ infoMessage }}</p>

    <ui-button
      label="Log in"
      @action="logIn"
      :disabled="!validateForm()"
    />
  </form>

  <div class="info-message-block">
    <h4> {{ props.admin ? 'Wrong page, are you an admin?' : 'Don\'t have an account yet?' }}</h4>
    <p>Follow <a href="#" @click="router.push({name: 'register'})" class="login-form__link">this link</a> to get registered {{ props.admin ? 'as user' : ''}}</p>
  </div>

</template>

<script setup lang="ts">
import {defineProps, onUnmounted, ref} from "vue";
import type { UserLogin, PropsObject } from '@/interfaces';
import {  useRouter, Router } from 'vue-router';
import { signInWithEmailAndPassword } from "firebase/auth";
import "firebase/database";
import { auth } from '@/firebase.js';
import { useLocalStorage } from '@vueuse/core';
import UiButton from "@/components/UI/uiButton.vue";

const router: Router = useRouter();
let timeoutId: ReturnType<typeof setTimeout>;
const infoMessage = ref<string>('');
const props = defineProps<PropsObject>();
const form = ref<UserLogin>({
  email: '',
  password: ''
});

const isAuthorized = useLocalStorage<string>('authorized', 'false', {
  mergeDefaults: true
});

const validateForm = (): boolean => {
  return Object.values(form.value).every(el => el && el.toString().trim().replaceAll(' ', '') !== '');
}

const logIn = async (): Promise<void> => {

  try {
    const userData = await signInWithEmailAndPassword(auth, form.value.email, form.value.password);
    isAuthorized.value = 'true';

    infoMessage.value = 'You logged in successfully!';

    timeoutId = setTimeout(() => {
      infoMessage.value = '';
      router.push({ name: props.admin ? 'admin-users' : 'users-list-auth', params: { userId: userData.user.uid } })
    }, 1000);

  } catch (error: unknown) {
    isAuthorized.value = 'false';

    if (error instanceof Error) {
      if (error.message.includes('auth/invalid-email')) {
        infoMessage.value = 'Invalid email format!';
      }

      if (error.message.includes('auth/invalid-credential')) {
        infoMessage.value = props.admin ? 'Admin data not found!' : `User not found!`;
      }
    }
  }
};

onUnmounted((): void => clearTimeout(timeoutId));

</script>

<style scoped lang="scss">
.login-form {
  position: relative;
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
      margin-bottom: 40px;
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
  &:deep > .custom-button:hover {
    box-shadow: 1px 1px 6px #424242;
  }
}
.info-message-block {
  width: fit-content;
  margin: auto;
}

.info-message {
  position: absolute;
  bottom: 45px;
  left: 0;
  font-size: 0.9rem;
  &.error {
    color: red;
  }
  &.success {
    color: green;
  }
}
</style>
