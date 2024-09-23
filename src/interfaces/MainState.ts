import {PropsComment} from "@/interfaces/PropsComment";
import {Comment} from "@/interfaces/Comment";

export interface MainState {
  loading: boolean;
  ratingQuantity: number;
  comment: PropsComment;
  commentsList: Array<Comment>;
  userRating: number;
  isAuthorized: boolean;
}
