import { PropsComment } from "@/interfaces/PropsComment";
import { UserRegist } from "@/interfaces/UserRegist";

export interface PropsCommentForm extends PropsComment {
  authUser: UserRegist;
  user: UserRegist;
}
