<template>
  <div class="comment-list__container" v-if="store.getters.commentsList.length">
    <h3>User comments</h3>
    <div v-for="(comment, index) in store.getters.commentsList" :key="comment.commentId" class="comment-list__content">
      <div class="comment-list__item comment">
        <div class="comment-list__title">
          <p class="label">Author: {{ comment.author }}</p>
          <ui-rating-stars :rating-quantity="props.ratingQuantity" :rating="comment.rating" class="stars" disable-hover/>
        </div>

        <p class="text">{{ comment.text }}</p>
      </div>
      <div class="comment-list__item action">
        <p class="label">{{ comment.date }}</p>
        <ui-button
          v-if="props.admin"
          label="Delete"
          @click.prevent="deleteComment(comment, index as number)"
        />

      </div>

    </div>
  </div>
  <div v-else class="comment-list__container" >
    <h3>This user doesn't have eny comments yet.</h3>
  </div>
</template>

<script setup lang="ts">

import UiButton from "@/components/UI/uiButton.vue";
import UiRatingStars from "@/components/UI/uiRatingStars.vue";
import {Comment, PropsComment} from "@/interfaces";
import {ref as dbRef} from "@firebase/database";
import {database} from "@/firebase";
import { equalTo, get, orderByChild, query,  DatabaseReference, update, remove} from "firebase/database";
import {onMounted, defineProps, defineEmits } from "vue";
import {useStore} from "vuex";
const store = useStore();

const props = defineProps<PropsComment>()
const emit = defineEmits<{
  (event: 'updateUserRating', payload: number): void
}>()

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
    await updateRating(0, props.userId );
    store.commit('UPDATE_RATING', 0);
    emit('updateUserRating', 0);
    return;
  }

  const commentsQuantity = store.getters.commentsList.length;
  const currentCommentsArray = [...store.getters.commentsList];
  const scores = currentCommentsArray.reduce((acc: number, curValue: Comment) => curValue.rating + acc, 0 );
  const ratingAverage = Number((scores / commentsQuantity).toFixed(2));

  await updateRating(ratingAverage, props.userId );
  store.commit('UPDATE_RATING', ratingAverage)

  emit('updateUserRating', ratingAverage);



}
const deleteComment = async (comment: Comment, index: number) => {

  try {
    const commentRef = dbRef(database, `comments/${comment.commentId}`);
    const userCommentRef: DatabaseReference = dbRef(database, `users/${comment.userId}/comments/${comment.commentId}`);
    await remove(commentRef);
    await remove(userCommentRef);

    store.commit('DELETE_COMMENT', index);
    await countUserRating();

  } catch (error) {
    console.log(error)
  }
}

const getUserComments = async () => {
  try {
    const commentsRef = dbRef(database, '/comments')

    const commentsQuery = query(commentsRef, orderByChild('userId'), equalTo(props.userId));
    const snapshot = await get(commentsQuery);

    const comments: Array<Comment> = [];
    if (snapshot.exists()) {
      snapshot.forEach(childSnapshot => {
        const commentId = childSnapshot.key;
        const commentsData = childSnapshot.val();
        comments.unshift({ commentId: commentId, ...commentsData } as Comment)
      })

      store.commit('UPDATE_COMMENTS_LIST', comments);
      await countUserRating();

    } else {
      store.commit('RESET_COMMENTS_LIST')

      await countUserRating();
      return null;
    }
  } catch (error) {
    console.error('Error fetching comments:', error);
  }
}

onMounted (async () => {
  await getUserComments();
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
</style>
