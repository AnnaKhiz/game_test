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
    />

    <label for="password-confirm" class="registration-form__label">Confirm password</label>
    <input
      v-model="form.passwordConfirm"
      type="password"
      placeholder="Enter password again..."
    />

    <button
      @click.prevent="submitForm"
    >
      Sign in
    </button>

  </form>
</template>

<script setup lang="ts">
import {ref} from "vue";
import type { UserRegist } from '@/interfaces';
import { createUserWithEmailAndPassword } from "firebase/auth"
import { set, ref as dbRef } from "firebase/database";
import "firebase/database";
import { database, auth } from '@/firebase.js';
// import bcrypt from 'bcryptjs';


const form = ref<UserRegist>({
  name: '',
  surname: '',
  email: '',
  password: '',
  passwordConfirm: ''
});

// const hashedPassword = ref<string | null>(null);

// const hashPassword = async () => {
//   try {
//     const saltRounds = 10;
//     hashedPassword.value = await bcrypt.hash(form.value.password, saltRounds);
//   } catch (error) {
//     console.error('Error hashing password:', error);
//   }
// };

const submitForm = async () => {
  // await hashPassword();

  console.log(form.value)
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, form.value.email, form.value.password);
    const user = userCredential.user;

    const newUserRef = dbRef(database, 'users/' + user.uid);
    const { name, surname, email } = form.value;
    const newUserData = {  name, surname, email};

    await set(newUserRef, newUserData);
    console.log('User successfully added:', user);
  } catch (error) {
    console.error('Error adding user:', error.message);
  }
  // try {
  //   const userCredential = await createUserWithEmailAndPassword(auth, form.value.email, form.value.password);
  //   const user = userCredential.user;
  //   const newUsersRef = dbRef(database, 'users/' + user.uid);
  //
  //   // const usersRef = push(newUsersRef);
  //   await set(newUsersRef, form.value);
  //   console.log('Пользователи успешно добавлены');
  // } catch (error) {
  //   console.error('Ошибка при добавлении пользователей:', error);
  // }
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
}

</style>
