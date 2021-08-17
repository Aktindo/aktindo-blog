import React from "react";

export interface DividerProps {}

const Divider: React.FC<DividerProps> = () => {
  return (
    <div className="border-t-2 border-gray-200 dark:border-gray-600 my-4 mx-5"></div>
  );
};

export { Divider };
