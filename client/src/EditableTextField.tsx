import React, { useState } from 'react';
import { RIEInput } from 'riek';

export interface EditableTextFieldProps {
  defaultText?: string;
  className?: string;
}

const EditableTextField = ({
  defaultText,
  className,
}: EditableTextFieldProps) => {
  const [text, setText] = useState<string>(defaultText ? defaultText : '');

  return (
    <RIEInput
      value={text}
      className={className}
      change={({ text: newText }: { text: string }) => {
        setText(newText);
      }}
      propName="text"
      isDisabled={false}
    />
  );
};

export default EditableTextField;
