<template>
  <ui-loader v-if="store.getters.loading" />

  <div v-else>
    <h2 class="main__title">{{ isAuthorized === 'true' ? `Welcome ${props.admin ? 'Admin' : name}` : 'Users list' }}</h2>
    <div v-if="users.length" class="container-users">
      <div
        v-for="user in filteredUsers"
        :key="user.email"
        class="user-item"
      >

        <ui-user-info-items :user="user" />

        <div class="rating-block">
          <div>
            <ui-rating-stars :rating="user.rating" disable-hover/>
          </div>

          <ui-button
            v-if="isAuthorized === 'true'"
            label="Comments"
            @action="router.push({name: props.admin ? 'admin-comments' : 'users-comments', params: { userCommentId: user.id}})"
          />
          <ui-button
            v-else
            label="Comments"
            @action="router.push({name: 'users-comments', params: { userCommentId: user.id, userId: 'user' }})"
          />

        </div>
      </div>
    </div>
    <div v-else class="container-users">
      <h3>
        There are no users in users list.
        <a
          href="#"
          @click="router.push({name: 'register'})"
          class="users-list-link"
        >
          Sign up
        </a>
        and become first one!
      </h3>
    </div>
  </div>

</template>

<script lang="ts" setup>
import { ref as dbRef, get, child, DatabaseReference } from "firebase/database";
import { database } from '@/firebase.js';
import {onMounted, ref, defineProps, computed } from "vue";
import { useRouter, Router } from 'vue-router';
import { useLocalStorage } from '@vueuse/core';
import {UserRegist, PropsObject} from '@/interfaces';
import UiRatingStars from "@/components/UI/uiRatingStars.vue";
import UiButton from "@/components/UI/uiButton.vue";
import UiUserInfoItems from "@/components/UI/uiUserInfoItems.vue";
import UiLoader from "@/components/UI/uiLoader.vue";
import {useStore} from "vuex";
const store = useStore();

const router: Router = useRouter();
const props = defineProps<PropsObject>();

const isAuthorized = useLocalStorage<string>('authorized', 'false', {
  mergeDefaults: true
});

const users = ref<UserRegist[]>([]);
const authUser = ref<UserRegist>();

const filteredUsers = computed((): UserRegist[] => {
  return users.value.filter(el => !el.role);
})

const name = computed((): string => {
  return authUser.value ? `${authUser.value.surname} ${authUser.value.name}!`: ''
})
const fetchUsers = async (): Promise<void> => {
  store.commit('SET_LOADING', true);

  try {
    const db: DatabaseReference = dbRef(database);
    const snapshot = await get(child(db, `users/`));
    if (snapshot.exists()) {

      snapshot.forEach(childSnapshot => {
        const userId = childSnapshot.key;
        const userData = childSnapshot.val();

        users.value.push({id: userId, ...userData } as UserRegist);
      });

      store.commit('SET_LOADING', false);

    } else {
      console.info("No users found");
    }
  } catch (error) {
    console.error("Error in fetch request (get users list):", error);
  }
}
const getAuthUserInfo = async (): Promise<void> => {
  if (props.userId) {

    try {
      const userRef: DatabaseReference = dbRef(database, `users/${props.userId}`);
      const snapshot = await get(userRef);

      if (snapshot.exists()) {
        authUser.value = snapshot.val();
      }

    } catch (error) {
      console.error('Error in uploading auth user info', error);
    }
  }
}

onMounted(async (): Promise<void> => {
  await fetchUsers();
  await getAuthUserInfo();
})

</script>


<style scoped>
.main__title {
  margin-bottom: 20px;
  text-align: center;
}
.container-users {
  display: flex;
  justify-content: flex-start;
  align-items: stretch;
  flex-wrap: wrap;
  gap: 15px;
  width: 100%;
  padding: 20px 0;
  & > h3 {
    font-weight: 400;
  }
}
.user-item {
  flex-grow: 0;
  display: flex;
  justify-content: space-between;
  width: calc(25% - 14px);
  padding: 15px;
  border-radius: 10px;
  background: #d7d7d7;
  box-shadow: 1px 1px 10px white;
  transition: transform 0.3s ease-in-out 0s;
  &:hover {
    transform: perspective(100px) scale3D(1, 1, 1) translateZ(5px);
  }
}
.users-list-link {
  text-decoration: none;
  color: brown;
  font-size: 1rem;
  &:hover {
    text-decoration: underline;
  }
}

.rating-block {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  & > div span {
    font-size: 1.2rem;
  }
  &:deep > .custom-button:hover {
    box-shadow: 1px 1px 6px #424242;
  }
}
</style>
