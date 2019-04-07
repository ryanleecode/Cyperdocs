import React from 'react';

export interface LoadingOverlayProps {
  active: boolean;
  spinner?: true | React.ReactNode;
  text?: React.ReactNode;
  fadeSpeed?: number;
  onClick?: () => void;
  className?: string;
  classNamePrefix?: string;
}

export default class LoadingOverlay extends React.Component<
  LoadingOverlayProps
> {
  static defaultProps: {
    classNamePrefix: string;
    fadeSpeed: number;
    styles: {};
  };
  constructor(props: LoadingOverlayProps);
  componentDidMount(): void;
  componentDidUpdate(prevProps: any): void;
  forceUpdate(callback: any): void;
  render(): any;
  setState(partialState: any, callback: any): void;
}
