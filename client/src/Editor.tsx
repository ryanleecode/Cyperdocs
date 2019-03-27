import Immutable from 'immutable';
import React from 'react';
import { Card } from 'react-bootstrap';
import withSheet, { WithSheet } from 'react-jss';
import { Operation, Value } from 'slate';
import { Editor as SlateEditor } from 'slate-react';
import { Theme } from './App';

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
}

const Editor = (props: EditorProps) => {
  const { value, onChange, classes, applyInset } = props;
  return (
    <Card className={applyInset ? classes.inset : undefined}>
      <Card.Body>
        <SlateEditor value={value} onChange={onChange} />
      </Card.Body>
    </Card>
  );
};

export default withSheet(styles)(Editor);
