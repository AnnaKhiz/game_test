<template>
  <div class="container-users">
    <div v-for="user in users" :key="user.email" class="user-item">
      <div>
        <p>Name: {{user.name}}</p>
        <p>Surname: {{user.surname}}</p>
        <p>Email: {{user.email}}</p>
        <p>Rating: {{user.rating || 0}}</p>
      </div>


      <div>
        <button>Comments</button>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import {onMounted, ref} from "vue";
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
    } else {
      console.log("No data");
    }
  } catch (error) {
    console.error("Error in fetch request (get users list:", error);
  }
}

onMounted(async () => {
  await fetchUsers()
})


</script>


<style scoped>
.container-users {

  width: 100%;
  padding: 20px 0;
}
.user-item {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 15px;
  padding: 10px;
  border: 1px solid black;
}
</style>
