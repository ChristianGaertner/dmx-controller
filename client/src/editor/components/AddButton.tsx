import * as React from "react";

export const AddButton: React.FunctionComponent<{
  onClick: () => void;
  label: string;
}> = ({ onClick, label }) => (
  <button
    onClick={onClick}
    className="px-6 py-2 mx-auto flex flex-row justify-center items-center tracking-wide rounded hover:bg-gray-900"
  >
    <svg viewBox="0 0 20 20" className="h-4 w-4 fill-current mr-2">
      <g stroke="none" strokeWidth="1" fillRule="evenodd">
        <g>
          <path d="M11,9 L11,5 L9,5 L9,9 L5,9 L5,11 L9,11 L9,15 L11,15 L11,11 L15,11 L15,9 L11,9 Z M10,20 C15.5228475,20 20,15.5228475 20,10 C20,4.4771525 15.5228475,0 10,0 C4.4771525,0 0,4.4771525 0,10 C0,15.5228475 4.4771525,20 10,20 Z M10,18 C14.418278,18 18,14.418278 18,10 C18,5.581722 14.418278,2 10,2 C5.581722,2 2,5.581722 2,10 C2,14.418278 5.581722,18 10,18 Z" />
        </g>
      </g>
    </svg>
    <span>{label}</span>
  </button>
);
