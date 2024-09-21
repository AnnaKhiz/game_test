<template>
  <form action="" class="registration-form">
    <label for="name" class="registration-form__label">Name</label>
    <input
      v-model="form.name"
      type="text"
      placeholder="Enter name..."
    />

    <label for="surname" class="registration-form__label">Surname</label>
    <input
      v-model="form.surname"
      type="text"
      placeholder="Enter surname..."
    />

    <label for="email" class="registration-form__label">Email</label>
    <input
      v-model="form.email"
      type="text"
      placeholder="Enter email..."
    />

    <label for="password" class="registration-form__label">Password</label>
    <input
      v-model="form.password"
      type="password"
      placeholder="Enter password..."
      @error="form.password !== form.passwordConfirm"
      @input="errorHandler"
      :class="{ 'error': form.password !== form.passwordConfirm}"
    />

    <label for="password-confirm" class="registration-form__label">Confirm password</label>
    <input
      v-model="form.passwordConfirm"
      type="password"
      placeholder="Enter password again..."
      @error="form.password !== form.passwordConfirm"
      @input="errorHandler"
      :class="{ 'error': form.password !== form.passwordConfirm}"
    />

    <p class="info-message " :class="isAuthorized === 'false' ? 'error' : 'success'">{{ infoMessage }}</p>

    <button @click.prevent="submitForm" :disabled="form.password !== form.passwordConfirm">Sign in</button>

  </form>
</template>

<script setup lang="ts">
import {onMounted, ref} from "vue";
import {  useRouter, Router } from 'vue-router';
import type { UserRegist } from '@/interfaces';
import { createUserWithEmailAndPassword } from "firebase/auth"
import { set, ref as dbRef } from "firebase/database";
import { useLocalStorage } from '@vueuse/core';
import "firebase/database";
import { database, auth } from '@/firebase.js';

const router: Router = useRouter();

const isAuthorized = useLocalStorage<string>('authorized', 'false', {
  mergeDefaults: true
})


const infoMessage = ref<string>('');
const form = ref<UserRegist>({
  name: '',
  surname: '',
  email: '',
  password: '',
  passwordConfirm: ''
});

const errorHandler = () => {
  form.value.password !== form.value.passwordConfirm ? infoMessage.value = 'Passwords are not equal!' : infoMessage.value = ''
}

const validateForm = () => {
  const { name, surname, email, password, passwordConfirm } = form.value;

  if (!name || !surname || !email || !password || !passwordConfirm ) {
    infoMessage.value = 'Fill all empty fields!';
    return false
  } else {
    return true;
  }
}

const submitForm = async () => {

  if (!validateForm()) {
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

    infoMessage.value = 'User successfully added.';


    setTimeout(() => {
      infoMessage.value = '';

      router.push({name: 'users-list-auth', params: { userId: user.uid }});
    }, 1000)

  } catch (error: unknown) {
    isAuthorized.value = 'false';
    if (error instanceof Error) {
      if (error.message.includes('auth/invalid-email')) {
        infoMessage.value = 'Registration error! Invalid email format!';
      }
      if (error.message.includes('auth/weak-password')) {
        infoMessage.value = 'Registration error! Password length should be at least 6 symbols!';
      }
    }
  }
onMounted(() => {
  infoMessage.value = ''
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
      //border: 1px solid red;
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
