<template>
  <div class="item-comments-container">
    <div v-if="user" class="user-item">
      <div>
        <p>Name: {{user.name}}</p>
        <p>Surname: {{user.surname}}</p>
        <p>Email: {{user.email}}</p>
        <p>Rating: {{user.rating || 0}}</p>
      </div>

    </div>


    <div class="comment-form__container">
      <div class="rating-block">
        <div>
          <h3>Rate this user</h3>
          <span
            v-for="star in ratingQuantity"
            :key="star"
            :class="{'checked' : star <= rating}"
            @click="setRating(star)"
          >
          ★
        </span>
        </div>
      </div>
      <form action="" class="comment-form__form">
        <label for="text" class="comment-form__label">Comment</label>
        <textarea
          v-model="form.text"
          placeholder="Enter text here..."
          rows="5"
        />

        <button
          @click.prevent="saveComment"
        >
          Save comment
        </button>
      </form>
    </div>

    <div v-if="comments.length" class="comment-list__container">
      <h3>User comments</h3>

      <div v-for="(comment, index) in comments" :key="comment.rating + index" class="comment-list__content">
        <div class="comment-list__item">
          <p class="label">Author: {{ comment.author }}</p>
          <p class="label">{{ comment.date }}</p>
        </div>

        <p class="text">{{ comment.text }}</p>

      </div>
    </div>

  </div>

  <button @click="router.back()">Go back</button>
</template>

<script setup lang="ts">
import {defineProps, onMounted, ref, defineEmits} from 'vue';
import {Router, useRouter} from 'vue-router';
import {DatabaseReference, get, update, query, orderByChild, equalTo} from "firebase/database";
import {push, ref as dbRef, set} from "@firebase/database";
import {Comment, PropsObject, UserRegist, EmitUpdateRating } from "@/interfaces";
import {database} from "@/firebase";

const router: Router = useRouter();
const props: PropsObject = defineProps<PropsObject>()
console.log('props!!!!!!!', props)


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
  author: props.author
})
console.log(form.value)


const emit = defineEmits<{ updateRating: [EmitUpdateRating] }>()

const setRating = async (item: number): Promise<void> => {
  rating.value = item;
  // await updateRating(item, userId)
  form.value.rating = item
  // user.value.rating = item
  //emit('updateRating')
  // users.value[index].rating = item
}

const updateRating = async (item: number, userId: number): Promise<void> => {
  const userRef: DatabaseReference = dbRef(database, `users/${userId}`);
  try {
    await update(userRef, { rating: item });
  } catch (error) {
    console.log(error)
  }
}
const getAuthUserInfo = async () => {
  if (props.userCommentId) {
    try {
      const userRef: DatabaseReference = dbRef(database, `users/${props.userCommentId}`);
      const snapshot = await get(userRef);
      if (snapshot.exists()) {
        const key = snapshot.key;
        const data = snapshot.val();
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
    const commentsQuery = query(commentsRef, orderByChild('userId'), equalTo(user.value.id));
    const snapshot = await get(commentsQuery);

    if (snapshot.exists()) {
      const commentsData = snapshot.val();
      comments.value = Object.values(commentsData)
      return comments;
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
  await addCommentRequest();
}

const countUserRating = async () => {
  const comentsQuantity = comments.value.length;
  const scores = comments.value.reduce((acc, curValue) => curValue.rating + acc, 0 );

  const ratingAverage = Number((scores / comentsQuantity).toFixed(2));

  await updateRating(ratingAverage, user.value.id);

  user.value.rating = ratingAverage;

  emit('updateRating', { rating: +ratingAverage, id: user.value.id as string })
}

const addCommentRequest = async () => {

  try {
    const newCommentRef = push(dbRef(database, 'comments/'));
    await set(newCommentRef, { ...form.value, userId: user.value.id });

    const commentId = newCommentRef.key;
    const userCommentsRef = dbRef(database, `users/${user.value.id}/comments/${commentId}`);
    await set(userCommentsRef, true);

    comments.value.push(form.value)

    resetFormData();

    await countUserRating();

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
    author: props.author
  }
}

onMounted(async () => {
  await getAuthUserInfo()
  await getUserComments()
})

</script>

<style scoped lang="scss">
.comment-list {
  &__container {
    padding: 10px;
    & > h3 {
      margin-bottom: 10px;
    }
  }
  &__content {
    padding: 10px;
    border-radius: 8px;
    background-color: #f7fafa;
    margin-bottom: 10px;
    & > p.text {
      font-size: 1rem;
    }
  }
  &__item {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;

    & > p.label {
      font-size: 0.8rem;
      opacity: 0.7;
      margin-bottom: 5px;
    }

  }
  &__info {

  }
}

.comment-form {
  &__container {
    padding: 10px;
    background-color: antiquewhite;
    border-radius: 12px;
    margin-bottom: 20px;
  }

  &__form {
    width: 100%;

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
  }
  &__label {
    display: block;
    margin-bottom: 5px;
  }

}

.item-comments-container {
  max-width: 1000px;
  margin: auto;
  border: 1px solid black;
  padding: 10px;
}
.user-item {
  margin: 0 auto 20px;
  flex-grow: 0;
  display: flex;
  justify-content: space-between;
  width: 100%;

}
.rating-block {
  display: flex;
  margin-bottom: 10px;
  align-items: center;
  justify-content: space-between;
  & > div span {
    cursor: pointer;
    font-size: 1.2rem;
    &.checked {
      color: red;
    }
    &:hover {
      color: red;
    }
  }
  & > div h3 {
    font-weight: 400;
    font-size: 1rem;
    margin-bottom: 5px;
  }
}
</style>
