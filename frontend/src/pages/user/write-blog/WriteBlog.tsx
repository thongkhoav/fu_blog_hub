import { ButtonTitle } from "~/utils/constants/buttonTitle";
import "./write-blog.scss";

interface Props {
  mode?: ButtonTitle.CREATE | ButtonTitle.EDIT;
}

export default function WriteBlog({ mode = ButtonTitle.CREATE }: Props) {
  return (
    <div>
      <h2 className="text-green-600">Write Blog</h2>
      <button>{mode}</button>
    </div>
  );
}
