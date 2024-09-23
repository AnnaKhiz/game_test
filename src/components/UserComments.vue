<template>
  <div class="item-comments-container">
    <h2 class="main-title">User comments</h2>
    <div v-if="user" class="user-item">
      <ui-user-info-items :user="user" />

      <ui-comment-form
        v-if="user.id && (isAuthorized === 'true' || props.admin)"
        :admin="props.admin"
        :user="user"
        :auth-user="authUser"
        @update-user-rating="user.rating = $event"
      />
    </div>

    <comments-list
      v-if="user.id"
      :userId="user.id"
      :admin="props.admin"
      @update-user-rating="user.rating = $event"
    />

  </div>
</template>

<script setup lang="ts">
import {defineProps, onMounted, ref} from 'vue';
import {DatabaseReference, get} from "firebase/database";
import {ref as dbRef} from "@firebase/database";
import { PropsObject, UserRegist } from "@/interfaces";
import {database} from "@/firebase";
import {useLocalStorage} from "@vueuse/core";
import CommentsList from "@/components/CommentsList.vue";
import UiCommentForm from "@/components/UI/uiCommentForm.vue";
import UiUserInfoItems from "@/components/UI/uiUserInfoItems.vue";
import {useStore} from "vuex";


const store = useStore();
const props: PropsObject = defineProps<PropsObject>();

const isAuthorized = useLocalStorage<string>('authorized', 'false', {
  mergeDefaults: true
})

const authUser = ref<UserRegist>({
  name: '',
  surname: '',
  email: '',
  rating: 0
});

const user = ref<UserRegist>({
  name: '',
  surname: '',
  email: '',
  rating: 0
});

const getAuthorInfo = async (): Promise<void> => {
  store.commit('SET_LOADING', true);

  if (props.userId) {
    try {
      const userRef: DatabaseReference = dbRef(database, `users/${props.userId}`);
      const snapshot = await get(userRef);

      if (snapshot.exists()) {
        authUser.value = snapshot.val()
      }

      store.commit('SET_LOADING', false);
    } catch (error) {
      console.error('Error in getting author info', error);
    }
  }
}
const getUserInfo = async (): Promise<void> => {
  store.commit('SET_LOADING', true);

  if (props.userCommentId) {
    try {
      const userRef: DatabaseReference = dbRef(database, `users/${props.userCommentId}`);
      const snapshot = await get(userRef);

      if (snapshot.exists()) {
        const key: string = snapshot.key as string;
        const data: Omit<UserRegist, 'id'> = snapshot.val();
        user.value = { ...data, id: key };
      }

      store.commit('SET_LOADING', false);

    } catch (error) {
      console.error('Error in getting user info:', error);
    }
  }
}

onMounted(async (): Promise<void> => {
  if (props.userId) {
    await getAuthorInfo();
  }
  await getUserInfo();
})

</script>

<style scoped lang="scss">

.item-comments-container {
  max-width: 1200px;
  margin: auto;
  & > .main-title {
    margin-bottom: 20px;
    text-align: center;
  }
  &:deep > .custom-button {
    margin-bottom: 15px;
    &:hover {
      box-shadow: 1px 1px 6px #424242;
    }
  }
  &:deep + .custom-button:hover {
    box-shadow: 1px 1px 6px #424242;
  }
}
.user-item {
  margin: 0 auto 20px;
  flex-grow: 0;
  display: flex;
  justify-content: space-between;
  width: 100%;
  padding: 15px;
  border-radius: 10px;
  background: #d7d7d7;
  box-shadow: 1px 1px 10px white;
  &:deep > .user-info {
    width: 20%;
  }
}

.label {
  font-size: 0.8rem;
  opacity: 0.7;
}
</style>
