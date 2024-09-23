import {PropsComment} from "@/interfaces/PropsComment";
import {Comment} from "@/interfaces/Comment";

export interface MainState {
  ratingQuantity: number;
  comment: PropsComment;
  commentsList: Array<Comment>;
  userRating: number;
}
