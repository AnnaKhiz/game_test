<template>
  <form action="" class="registration-form">
    <code>{{form}}</code>
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
    />

    <label for="password-confirm" class="registration-form__label">Confirm password</label>
    <input
      v-model="form.passwordConfirm"
      type="password"
      placeholder="Enter password again..."
    />

    <button
      class="registration-form__button"
      @click.prevent="submitForm"
    >
      Submit
    </button>

  </form>
</template>

<script setup lang="ts">
import {ref} from "vue";
import type { User } from '@/interfaces';
import { set, ref as dbRef, push } from "firebase/database";
import "firebase/database";
import { database } from '@/firebase.js'

const form = ref<User>({
  name: '',
  surname: '',
  email: '',
  password: '',
  passwordConfirm: ''
});


const submitForm = async () => {
  console.log(form.value)
  const newUsersRef = dbRef(database, 'users/');
  try {
    const usersRef = push(newUsersRef);
    await set(usersRef, form.value);
    console.log('Пользователи успешно добавлены');
  } catch (error) {
    console.error('Ошибка при добавлении пользователей:', error);
  }
}


</script>

<style scoped lang="scss">

.registration-form {
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
    &:focus {
      outline: none;
    }
    &:last-of-type {
      margin-bottom: 30px;
    }
  }
  &__button {
    display: block;
    width: 200px;
    padding: 10px 15px;
    border-radius: 12px;
    border: none;
  }
}
</style>
