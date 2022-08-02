import React, {FC, ReactNode} from "react";

export const ImageColumn: FC = (props) => <div className="flex items-center justify-center xl:w-[500px]">
  {props.children}
</div>
