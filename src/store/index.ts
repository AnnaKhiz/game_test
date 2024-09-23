import { createStore } from "vuex";
import { MainState, PropsComment, Comment } from "@/interfaces";
import { MutationTypes } from "@/enums";

export const store = createStore({
  state: () => (<MainState>{
    loading: false,
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
    loading(state: MainState): boolean {
      return state.loading;
    },
    comment(state: MainState): PropsComment {
      return state.comment;
    },
    commentsList(state: MainState): Array<Comment> {
      return state.commentsList;
    },
    ratingQuantity(state: MainState): number {
      return state.ratingQuantity;
    },
    userRating(state: MainState): number {
      return state.userRating;
    },

  },
  mutations: {
    [MutationTypes.SET_LOADING](state: MainState, payload: boolean): void {
      state.loading = payload;
    },
    [MutationTypes.SET_RATING](state: MainState, payload: number): void {
      state.userRating = payload;
    },
    [MutationTypes.SET_COMMENT](state: MainState, payload: PropsComment): void {
      state.comment = payload;
    },
    [MutationTypes.UPDATE_COMMENTS_LIST](state: MainState, payload: [Comment]): void {
      state.commentsList = payload;
    },
    [MutationTypes.UNSHIFT_COMMENTS_LIST](state: MainState, payload: Comment): void {
      state.commentsList.unshift(payload);
    },
    [MutationTypes.DELETE_COMMENT](state: MainState, payload: number): void {
      state.commentsList.splice(payload, 1);
    },
   [MutationTypes.UPDATE_RATING] (state: MainState, payload: number): void {
      state.userRating = payload;
    },
    [MutationTypes.RESET_COMMENT_FORM](state: MainState): void {
      state.comment = {
        ratingQuantity: 0,
        admin: false,
        userId: ''
      }
    },
    [MutationTypes.RESET_COMMENTS_LIST](state: MainState): void {
      state.commentsList = [];
    },
  },
})




