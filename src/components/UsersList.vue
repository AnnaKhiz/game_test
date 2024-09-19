<template>
  <div>

    <div v-for="user in users" :key="user.email" style="margin-bottom: 15px; border: 1px solid black">
      <p>Name: {{user.name}}</p>
      <p>Surname: {{user.surname}}</p>
      <p>Email: {{user.email}}</p>
    </div>
  </div>
</template>

<script lang="ts" setup>
import {ref} from "vue";
import type { User } from '@/interfaces';
import { ref as dbRef, get, child } from "firebase/database";
import "firebase/database";
import { database } from '@/firebase.js'
const users = ref<User[] | null>(null);

const fetchUsers = async () => {
  try {
    const db = dbRef(database);
    const snapshot = await get(child(db, `users/`));
    if (snapshot.exists()) {
      users.value = Object.values(snapshot.val()) as User[];
      console.log('Данные пользователей:', users.value);
    } else {
      console.log("Нет данных");
    }
  } catch (error) {
    console.error("Ошибка при получении данных:", error);
  }
}

fetchUsers()

</script>


<style scoped>

</style>
