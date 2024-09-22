import {PropsComment} from "@/interfaces";

interface State {
  ratingQuantity: number;
  comment: PropsComment;
  commentsList: [PropsComment]
}
export const mainStore = {
  namespaced: true,
  state: () => (<State>{
    ratingQuantity: 5,
    comment: {},
    commentsList: [{
      ratingQuantity: 0,
      admin: false,
      userId: ''
    }]

  }),
  getters: {
    comment(state: State): PropsComment {
      return state.comment
    },
    commentsList(state: State): [PropsComment] {
      return state.commentsList
    },
    ratingQuantity(state: State): number {
      return state.ratingQuantity
    }

  },
  mutations: {
    setComment(state: State, payload: PropsComment): void {
      state.comment = payload
    },
    updateCommensList(state: State, payload: [PropsComment]): void {
      state.commentsList = payload
    },
    updateRating(state: State, payload: number): void {
      state.ratingQuantity = payload
    },
    resetCommentForm(state: State): void {
      state.comment = {
        ratingQuantity: 0,
        admin: false,
        userId: ''
      }
    },
    resetCommentsList(state: State): void {
      state.commentsList = [{
        ratingQuantity: 0,
        admin: false,
        userId: ''
      }]
    }

  }
}
