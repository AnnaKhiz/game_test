<template>
  <form action="" class="registration-form">
    <label for="name" class="registration-form__label">Name</label>
    <input
      v-model="form.name"
      type="text"
      placeholder="Enter name..."
      @input="message = ''"
    />

    <label for="surname" class="registration-form__label">Surname</label>
    <input
      v-model="form.surname"
      type="text"
      placeholder="Enter surname..."
      @input="message = ''"
    />

    <label for="email" class="registration-form__label">Email</label>
    <input
      v-model="form.email"
      type="text"
      placeholder="Enter email..."
      @input="message = ''"
    />

    <label for="password" class="registration-form__label">Password</label>
    <input
      v-model="form.password"
      type="password"
      placeholder="Enter password..."
      @error="form.password !== form.passwordConfirm"
      @input="errorHandler"
      :class="{ 'error': form.password !== form.passwordConfirm || disabled }"
    />

    <label for="password-confirm" class="registration-form__label">Confirm password</label>
    <input
      v-model="form.passwordConfirm"
      type="password"
      placeholder="Enter password again..."
      @error="form.password !== form.passwordConfirm"
      @input="errorHandler"
      :class="{ 'error': form.password !== form.passwordConfirm || disabled}"
    />

    <p class="info-message " :class="isAuthorized === 'false' ? 'error' : 'success'">{{ infoMessage }}</p>

    <ui-button
      label="Sign in"
      @action="submitForm"
      :disabled="form.password !== form.passwordConfirm || disabled || !validateForm()"
    />

  </form>
</template>

<script setup lang="ts">

import {onMounted, ref, computed} from "vue";
import {  useRouter, Router } from 'vue-router';
import type { UserRegist } from '@/interfaces';
import { createUserWithEmailAndPassword } from "firebase/auth"
import { set, ref as dbRef } from "firebase/database";
import { useLocalStorage } from '@vueuse/core';
import "firebase/database";
import { database, auth } from '@/firebase.js';
import UiButton from "@/components/UI/uiButton.vue";


const router: Router = useRouter();

const isAuthorized = useLocalStorage<string>('authorized', 'false', {
  mergeDefaults: true
})


const message = ref<string>('');
const form = ref<UserRegist>({
  name: '',
  surname: '',
  email: '',
  password: '',
  passwordConfirm: ''
});

const disabled = computed(() => {
  const regex = /^\S*$/;
  const password = form.value.password as string
  const passwordConfirm = form.value.passwordConfirm as string;

  return !regex.test(password) || !regex.test(passwordConfirm);
})

const infoMessage = computed(() => disabled.value ? 'Field \'Password\' or \'Confirm password\' contain spaces!' : message.value)

const errorHandler = () => {
  form.value.password !== form.value.passwordConfirm ? message.value = 'Passwords are not equal or contain spaces!' : message.value = ''
}

const validateForm = () => {
  return Object.values(form.value).every(el => el && el.toString().trim().replaceAll(' ', '') !== '');
}


const submitForm = async () => {

  if (!validateForm() && disabled) {
    return
  }

  try {
    const userCredential = await createUserWithEmailAndPassword(auth, form.value.email, form.value.password as string);
    const user = userCredential.user;

    const newUserRef = dbRef(database, 'users/' + user.uid);
    const { name, surname, email } = form.value;
    const newUserData = {  name, surname, email, rating: 0 };

    await set(newUserRef, newUserData);
    isAuthorized.value = 'true';
    form.value = {
      name: '',
      surname: '',
      email: '',
      password: '',
      passwordConfirm: ''
    }

    message.value = 'User successfully added.';


    setTimeout(() => {
      message.value = '';

      router.push({name: 'users-list-auth', params: { userId: user.uid }});
    }, 1000)

  } catch (error: unknown) {
    isAuthorized.value = 'false';
    if (error instanceof Error) {
      if (error.message.includes('auth/invalid-email')) {
        message.value = 'Registration error! Invalid email format!';
      }
      if (error.message.includes('auth/weak-password')) {
        message.value = 'Registration error! Password length should be at least 6 symbols!';
      }
    }
  }
onMounted(() => {
  message.value = ''
})
}

</script>

<style scoped lang="scss">

.registration-form {
  position: relative;
  max-width: 500px;
  margin: auto;
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
    &.error {
      box-shadow: 1px 1px 3px red;
    }
    &:focus {
      outline: none;
    }
    &:last-of-type {
      margin-bottom: 40px;
    }
  }
  &__action {
    display: flex;
    justify-content: flex-start;
    align-items: center;
    gap: 15px;
    & > button {
      display: inline;
    }
  }
  &:deep > .custom-button:hover {
    box-shadow: 1px 1px 6px #424242;
  }
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
