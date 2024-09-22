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

      <div v-if="isAuthorized === 'true' || props.admin" class="comment-form__container">
        <div class="rating-block">
          <div class="rating-scores">
            <h3>Rate this user</h3>
            <ui-rating-stars :rating="rating" :ratingQuantity="ratingQuantity" @set-rating="setRating"/>
          </div>
        </div>
        <form action="" class="comment-form__form">
          <label for="text" class="comment-form__label">Comment</label>
          <textarea
            v-model="form.text"
            placeholder="Enter text here..."
            rows="5"
          />

          <ui-button
            label="Save comment"
            @click="saveComment"
          />
        </form>
      </div>

    </div>




    <div v-if="comments.length" class="comment-list__container">
      <h3>User comments</h3>

      <div v-for="(comment, index) in comments" :key="comment.rating + index" class="comment-list__content">
        <div class="comment-list__item comment">
          <div class="comment-list__title">
            <p class="label">Author: {{ comment.author }}</p>
            <ui-rating-stars :rating-quantity="ratingQuantity" :rating="comment.rating" class="stars" disable-hover/>
          </div>

          <p class="text">{{ comment.text }}</p>
        </div>
        <div class="comment-list__item action">
          <p class="label">{{ comment.date }}</p>
          <ui-button
            v-if="props.admin"
            label="Delete"
            @click.prevent="deleteComment(comment, index)"
          />
        </div>

      </div>
    </div>

  </div>
</template>

<script setup lang="ts">
import {defineProps, onMounted, ref} from 'vue';

import {DatabaseReference, get, update, query, orderByChild, equalTo, remove} from "firebase/database";
import {push, ref as dbRef, set} from "@firebase/database";
import {Comment, PropsObject, UserRegist } from "@/interfaces";
import {database} from "@/firebase";
import {useLocalStorage} from "@vueuse/core";
import UiRatingStars from "@/components/UI/uiRatingStars.vue";
import UiButton from "@/components/UI/uiButton.vue";

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

const rating = ref<number>(user.value.rating || 0)
const comments = ref<Array<Comment>>([]);
const ratingQuantity = ref<number>(5);
const form = ref<Comment>({
  rating: 0,
  text: '',
  date: '',
  author: ''
})


// const emit = defineEmits<{ updateRating: [EmitUpdateRating] }>()

// const isAdminRoute = computed(() => {
//   return router.currentRoute.value.path.match(/^\/admin/)
// })

const setRating = async (item: number): Promise<void> => {
  rating.value = item;
  form.value.rating = item;
}

const updateRating = async (item: number, userId: string): Promise<void> => {

  const userRef: DatabaseReference = dbRef(database, `users/${userId}`);
  try {
    await update(userRef, { rating: item });
  } catch (error) {
    console.log(error)
  }
}

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

const getUserComments = async () => {
  try {
    const commentsRef = dbRef(database, '/comments')
    const commentsQuery = query(commentsRef, orderByChild('userId'), equalTo(user.value.id as string));
    const snapshot = await get(commentsQuery);

    if (snapshot.exists()) {
      snapshot.forEach(childSnapshot => {
        const commentId = childSnapshot.key;
        const commentsData = childSnapshot.val();
        comments.value.push({commentId: commentId, ...commentsData} as Comment);
      })

    } else {
      console.log('No comments found for this user.');
      return null;
    }
  } catch (error) {
    console.error('Error fetching comments:', error);
  }
}

const saveComment = async () => {
  const data = new Date().toLocaleString();
  form.value.date = data;
  form.value.author = authUser.value.surname + ' ' + authUser.value.name
  await addCommentRequest();
}

const countUserRating = async () => {
  if (!comments.value.length) {
    user.value.rating = 0;
    return
  }

  const commentsQuantity = comments.value.length;
  console.log('comentsQuantity', commentsQuantity)
  const scores = comments.value.reduce((acc, curValue) => curValue.rating + acc, 0 );
  const ratingAverage = Number((scores / commentsQuantity).toFixed(2));

  await updateRating(ratingAverage, user.value.id as string );

  user.value.rating = ratingAverage;
}

const addCommentRequest = async () => {

  try {
    const newCommentRef = push(dbRef(database, 'comments/'));
    await set(newCommentRef, { ...form.value, userId: user.value.id });

    const commentId = newCommentRef.key;
    const userCommentsRef = dbRef(database, `users/${user.value.id}/comments/${commentId}`);
    await set(userCommentsRef, true);

    comments.value.push(form.value)
    await countUserRating();
    resetFormData();

  } catch (error) {
    console.log(error)
  }
}

const resetFormData = () => {
  rating.value = 0;
  form.value = {
    rating: 0,
    text: '',
    date: '',
    author: ''
  }
}

const deleteComment = async (comment: Comment, index: number) => {
  console.log('comment', comment)

  try {
    const commentRef = dbRef(database, `comments/${comment.commentId}`);
    const userCommentRef: DatabaseReference = dbRef(database, `users/${comment.userId}/comments/${comment.commentId}`);
    await remove(commentRef);
    await remove(userCommentRef);

    comments.value.splice(index, 1);

    await countUserRating();

  } catch (error) {
    console.log(error)
  }
}

onMounted(async () => {
  if (props.userId) {
    await getAuthorInfo()
  }
  await getUserInfo()
  await getUserComments()

})


</script>

<style scoped lang="scss">
.comment-list {
  &__container {
    & > h3 {
      margin-bottom: 10px;
    }
  }
  &__content {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    padding: 10px;
    border-radius: 8px;
    background-color: transparent;
    box-shadow: 1px 1px 6px rgba(66, 66, 66, 0.71);
    margin-bottom: 10px;
    & > p.text {
      font-size: 1rem;
    }
  }
  &__item {
    &.comment {
      max-width: 70%;
      overflow: hidden;
    }
    &.action {
      display: flex;
      flex-direction: column;
      align-items: flex-end;
      gap: 15px;
      &:deep > .custom-button:hover {
        box-shadow: 1px 1px 6px #424242;
      }
    }

  }
  &__title {
    display: flex;
    align-items: center;
    justify-content: flex-start;
    gap: 10px;
    margin-bottom: 15px;
    &:deep > div > .rating-stars {
      font-size: 0.7rem;
      cursor: auto;
    }

  }
}

.comment-form {
  &__container {
    width: 80%;
    padding: 10px;
    background: #e8e8e8;
    box-shadow: 1px 1px 6px #e8e8e8;
    border-radius: 12px;
  }
  &__form {
    width: 100%;
    &:deep > .custom-button:hover {
      box-shadow: 1px 1px 6px #424242;
    }

    & > textarea {
      width: 100%;
      resize: none;
      margin-bottom: 30px;
      padding: 10px;
      border: none;
      border-radius: 12px;
      box-shadow: 1px 1px 3px gray;
      &:focus {
        outline: none;
        box-shadow: 1px 1px 4px gray inset;
      }
    }
    & > button {
      width: fit-content;
    }
    & > label {
      font-weight: 600;
      font-size: 1rem;
      margin-bottom: 5px;
    }
  }
  &__label {
    display: block;
    margin-bottom: 5px;
  }

}

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
.rating-block {
  display: flex;
  margin-bottom: 10px;
  align-items: center;
  justify-content: space-between;
  & > .rating-scores {
    display: flex;
    align-items: center;
    justify-content: flex-start;
    column-gap: 20px;
    margin-bottom: 15px;
  }
  & > div h3 {
    font-weight: 600;
    font-size: 1rem;
  }

}

.label {
  font-size: 0.8rem;
  opacity: 0.7;

}
</style>
