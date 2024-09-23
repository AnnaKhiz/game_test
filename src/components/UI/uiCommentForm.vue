<template>
  <div class="comment-form__container">
    <div class="rating-block">
      <div class="rating-scores">
        <h3>Rate this user</h3>
        <ui-rating-stars :rating="form.rating" :ratingQuantity="props.ratingQuantity" @set-rating="setRating"/>
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
        :disabled="!validateForm()"
      />
    </form>
  </div>
</template>

<script setup lang="ts">

import UiButton from "@/components/UI/uiButton.vue";
import UiRatingStars from "@/components/UI/uiRatingStars.vue";
import {defineEmits, defineProps, ref} from "vue";
import {Comment, PropsComment, UserRegist} from "@/interfaces";
import {push, ref as dbRef, set} from "@firebase/database";
import {database} from "@/firebase";
import {useStore} from "vuex";
import {DatabaseReference, update} from "firebase/database";
const store = useStore();

const emit = defineEmits<{
  (event: 'updateUserRating', payload: number): void

}>()

interface PropsCommentForm extends PropsComment {
  authUser: UserRegist;
  user: UserRegist;
}

const form = ref<Comment>({
  rating: 0,
  text: '',
  date: '',
  author: ''
})

const validateForm = () => {
  const validFormData = {rating: form.value.rating, text: form.value.text}
  return Object.values(validFormData).every(el => el && el.toString().trim().replaceAll(' ', '') !== '');
}

const props = defineProps<PropsCommentForm>();
const rating = ref<number>(props.user.rating || 0)

const setRating = async (item: number): Promise<void> => {
  rating.value = item;
  form.value.rating = item;
}

const saveComment = async () => {
  const data = new Date().toLocaleString();
  form.value.date = data;
  form.value.author = props.authUser.surname + ' ' + props.authUser.name
  await addCommentRequest();
}

const addCommentRequest = async () => {
  try {
    const newCommentRef = push(dbRef(database, 'comments/'));
    const commentId = newCommentRef.key as string;

    await set(newCommentRef, { ...form.value, userId: props.user.id, commentId: commentId });

    const userCommentsRef = dbRef(database, `users/${props.user.id}/comments`);
    await update(userCommentsRef, {
      [commentId]: true
    });

    store.commit('UNSHIFT_COMMENTS_LIST', { ...form.value, commentId });

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


const updateRating = async (item: number, userId: string): Promise<void> => {

  const userRef: DatabaseReference = dbRef(database, `users/${userId}`);
  try {
    await update(userRef, { rating: item });
  } catch (error) {
    console.log(error)
  }
}

const countUserRating = async () => {

  if (!store.getters.commentsList.length) {
    store.commit('UPDATE_RATING', 0)
    emit('updateUserRating', 0);
    return;
  }

  const commentsQuantity = store.getters.commentsList.length;
  const currentCommentsArray = [...store.getters.commentsList];
  const scores = currentCommentsArray.reduce((acc: number, curValue: Comment) => curValue.rating + acc, 0 );
  const ratingAverage = Number((scores / commentsQuantity).toFixed(2));


  store.commit('UPDATE_RATING', ratingAverage)
  emit('updateUserRating', ratingAverage);

  await updateRating(ratingAverage, props.user.id as string);
}

</script>



<style scoped lang="scss">
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

</style>
