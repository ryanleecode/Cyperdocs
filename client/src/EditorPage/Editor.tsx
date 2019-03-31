import { Theme } from '@/App';
import classnames from 'classnames';
import Immutable from 'immutable';
import React from 'react';
import { Card } from 'react-bootstrap';
import withSheet, { WithSheet } from 'react-jss';
import { Operation, Value } from 'slate';
import { Editor as SlateEditor } from 'slate-react';

const styles = (theme: typeof Theme) => ({
  inset: {
    marginLeft: '20%',
    marginRight: '20%',
    backgroundColor: theme.foregroundColor,
  },
});

export interface EditorProps extends WithSheet<typeof styles> {
  value: Value;
  onChange: (change: {
    operations: Immutable.List<Operation>;
    value: Value;
  }) => any;
  applyInset?: boolean;
  className?: string;
}

const Editor = (props: EditorProps) => {
  const { value, onChange, classes, applyInset, className } = props;

  const insetClassName = applyInset ? classes.inset : undefined;
  const editorClassName = classnames(className, insetClassName);
  return (
    <Card className={editorClassName}>
      <Card.Body>
        <SlateEditor value={value} onChange={onChange} />
      </Card.Body>
    </Card>
  );
};

export default withSheet(styles)(Editor);
