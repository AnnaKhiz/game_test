<template>

  <div class="item-comments-container">
    <h2 class="main-title">User comments</h2>
    <div v-if="user" class="user-item">
      <div class="user-info">
        <p><span>Name:</span> {{user.name}}</p>
        <p><span>Surname:</span> {{user.surname}}</p>
        <p><span>Email:</span> {{user.email}}</p>
        <p><span>Rating:</span> {{user.rating || 0}}</p>
      </div>

      <ui-comment-form
        v-if="user.id && (isAuthorized === 'true' || props.admin)"
        :admin="props.admin"
        :rating-quantity="ratingQuantity"
        :user="user"
        :auth-user="authUser"
        @update-user-rating="user.rating = $event"
      />

    </div>

    <comments-list
      v-if="user.id"
      :userId="user.id"
      :admin="props.admin"
      :rating-quantity="ratingQuantity"
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
// import UiRatingStars from "@/components/UI/uiRatingStars.vue";
// import UiButton from "@/components/UI/uiButton.vue";
import CommentsList from "@/components/CommentsList.vue";
import UiCommentForm from "@/components/UI/uiCommentForm.vue";
// import {useStore} from "vuex";
// const store = useStore();


const isAuthorized = useLocalStorage<string>('authorized', 'false', {
  mergeDefaults: true
})


const props: PropsObject = defineProps<PropsObject>()
const authUser = ref<UserRegist>({
  name: '',
  surname: '',
  email: '',
  rating: 0
})
const user = ref<UserRegist>({
  name: '',
  surname: '',
  email: '',
  rating: 0
});

// const rating = ref<number>(user.value.rating || 0)
// const comments = ref<Array<Comment>>([]);
const ratingQuantity = ref<number>(5);
// const form = ref<Comment>({
//   rating: 0,
//   text: '',
//   date: '',
//   author: ''
// })


// const setRating = async (item: number): Promise<void> => {
//   rating.value = item;
//   form.value.rating = item;
// }


const getAuthorInfo = async () => {
  if (props.userId) {
    try {
      const userRef: DatabaseReference = dbRef(database, `users/${props.userId}`);
      const snapshot = await get(userRef);
      if (snapshot.exists()) {
        authUser.value = snapshot.val()
      }

      console.log(authUser.value.name)
    } catch (error) {
      console.log(error)
    }
  }

}
const getUserInfo = async () => {
  if (props.userCommentId) {
    console.log('got comment id', props.userCommentId)
    try {
      const userRef: DatabaseReference = dbRef(database, `users/${props.userCommentId}`);
      const snapshot = await get(userRef);
      if (snapshot.exists()) {
        const key: string = snapshot.key as string;
        const data = snapshot.val() as Omit<UserRegist, 'id'>;
        user.value = { ...data, id: key };
      }

    } catch (error) {
      console.log(error)
    }
  }

}



// const saveComment = async () => {
//   const data = new Date().toLocaleString();
//   form.value.date = data;
//   form.value.author = authUser.value.surname + ' ' + authUser.value.name
//   await addCommentRequest();
// }


// const addCommentRequest = async () => {
//
//   try {
//     const newCommentRef = push(dbRef(database, 'comments/'));
//     await set(newCommentRef, { ...form.value, userId: user.value.id });
//
//     const commentId = newCommentRef.key;
//     const userCommentsRef = dbRef(database, `users/${user.value.id}/comments/${commentId}`);
//     await set(userCommentsRef, true);
//
//     comments.value.unshift(form.value);
//
//     // await countUserRating();
//     resetFormData();
//
//   } catch (error) {
//     console.log(error)
//   }
// }

// const resetFormData = () => {
//   rating.value = 0;
//   form.value = {
//     rating: 0,
//     text: '',
//     date: '',
//     author: ''
//   }
// }



// const setComments = (comment: Array<Comment>) => {
//   comments.value = comment
// }
// watch(
//   comments.value,
//   (newVal, oldVal) => {
//
//   },
//   { deep: true } // Глубокое отслеживание изменений
// )


onMounted(async () => {
  if (props.userId) {
    await getAuthorInfo();
  }
  await getUserInfo();

})


</script>

<style scoped lang="scss">


//.comment-form {
//  &__container {
//    width: 80%;
//    padding: 10px;
//    background: #e8e8e8;
//    box-shadow: 1px 1px 6px #e8e8e8;
//    border-radius: 12px;
//  }
//  &__form {
//    width: 100%;
//    &:deep > .custom-button:hover {
//      box-shadow: 1px 1px 6px #424242;
//    }
//
//    & > textarea {
//      width: 100%;
//      resize: none;
//      margin-bottom: 30px;
//      padding: 10px;
//      border: none;
//      border-radius: 12px;
//      box-shadow: 1px 1px 3px gray;
//      &:focus {
//        outline: none;
//        box-shadow: 1px 1px 4px gray inset;
//      }
//    }
//    & > button {
//      width: fit-content;
//    }
//    & > label {
//      font-weight: 600;
//      font-size: 1rem;
//      margin-bottom: 5px;
//    }
//  }
//  &__label {
//    display: block;
//    margin-bottom: 5px;
//  }
//
//}

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
  & > .user-info {
    width: 20%;
    overflow: hidden;
    & > p {
      margin-bottom: 5px;
      & > span {
        font-weight: 600;
      }
    }
  }

}
//.rating-block {
//  display: flex;
//  margin-bottom: 10px;
//  align-items: center;
//  justify-content: space-between;
//  & > .rating-scores {
//    display: flex;
//    align-items: center;
//    justify-content: flex-start;
//    column-gap: 20px;
//    margin-bottom: 15px;
//  }
//  & > div h3 {
//    font-weight: 600;
//    font-size: 1rem;
//  }
//}

.label {
  font-size: 0.8rem;
  opacity: 0.7;

}
</style>
