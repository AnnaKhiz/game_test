import {createStore} from "vuex";
import {PropsComment, Comment} from "@/interfaces";

interface State {
  ratingQuantity: number;
  comment: PropsComment;
  commentsList: Array<Comment>;
  userRating: number;
}

export enum MutationTypes {
  SET_COMMENT = 'SET_COMMENT',
  UPDATE_COMMENTS_LIST = 'UPDATE_COMMENTS_LIST',
  UNSHIFT_COMMENTS_LIST = 'UNSHIFT_COMMENTS_LIST',
  DELETE_COMMENT = 'DELETE_COMMENT',
  UPDATE_RATING = 'UPDATE_RATING',
  RESET_COMMENT_FORM = 'RESET_COMMENT_FORM',
  RESET_COMMENTS_LIST = 'RESET_COMMENTS_LIST',
  SET_RATING = 'SET_RATING'
}

export const store = createStore({
  state: () => (<State>{
    userRating: 0,
    ratingQuantity: 5,
    comment: {},
    commentsList: [{
      rating: 0,
      text: '',
      author: '',
      date: '',
    }]
  }),
  getters: {
    comment(state: State): PropsComment {
      return state.comment
    },
    commentsList(state: State): Array<Comment> {
      return state.commentsList
    },
    ratingQuantity(state: State): number {
      return state.ratingQuantity
    },
    userRating(state: State): number {
      return state.userRating
    },

  },
  mutations: {
    [MutationTypes.SET_RATING](state: State, payload: number): void {
      state.userRating = payload
    },
    [MutationTypes.SET_COMMENT](state: State, payload: PropsComment): void {
      state.comment = payload;
    },
    [MutationTypes.UPDATE_COMMENTS_LIST](state: State, payload: [Comment]): void {
      state.commentsList = payload

    },
    [MutationTypes.UNSHIFT_COMMENTS_LIST](state: State, payload: Comment): void {
      // @ts-ignore
      state.commentsList.unshift(payload)
    },
    [MutationTypes.DELETE_COMMENT](state: State, payload: number): void {
      state.commentsList.splice(payload, 1)
    },
   [MutationTypes.UPDATE_RATING] (state: State, payload: number): void {
      state.userRating = payload
    },
    [MutationTypes.RESET_COMMENT_FORM](state: State): void {
      state.comment = {
        ratingQuantity: 0,
        admin: false,
        userId: ''
      }
    },
    [MutationTypes.RESET_COMMENTS_LIST](state: State): void {
      state.commentsList = [{
        rating: 0,
        text: '',
        author: '',
        date: '',
      }]
    },


  },
  // actions: {
  //   async updateRatingFetch ({ commit }: AugmentedActionContext, payload): Promise<void> {
  //
  //     const userRef: DatabaseReference = dbRef(database, `users/${payload.userId}`);
  //     try {
  //       await update(userRef, { rating: payload.item });
  //
  //     } catch (error) {
  //       console.log(error)
  //     }
  //   },
  //   async countUserRating({ commit , dispatch}: AugmentedActionContext, payload): Promise<void> {
  //     if (!store.getters.commentsList.length) {
  //       commit(MutationTypes.UPDATE_RATING as any, 0)
  //
  //       return;
  //     }
  //
  //     const commentsQuantity = store.getters.commentsList.length;
  //     const currentCommentsArray = [...store.getters.commentsList];
  //     const scores = currentCommentsArray.reduce((acc: number, curValue: Comment) => curValue.rating + acc, 0 );
  //     const ratingAverage = Number((scores / commentsQuantity).toFixed(2));
  //
  //     await dispatch("updateRatingFetch", payload)
  //     // await updateRating({item: ratingAverage, userId: props.userId });
  //
  //     commit(MutationTypes.UPDATE_RATING as any, ratingAverage)
  //
  //   }
  // }
})




