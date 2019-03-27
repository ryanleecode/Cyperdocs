interface RIEInputProps {
  value: string;
  className?: string;
  change?: (event: any) => void;
  classLoading?: string;
  propName?: string;
  isDisabled: boolean;
}

export class RIEInput extends React.Component<RIEInputProps> {
  constructor(...args: any[]);
  forceUpdate(callback: any): void;
  setState(partialState: any, callback: any): void;
}
export namespace RIEInput {
  namespace propTypes {
    function afterFinish(
      p0: any,
      p1: any,
      p2: any,
      p3: any,
      p4: any,
      p5: any,
    ): any;
    namespace afterFinish {
      function isRequired(
        p0: any,
        p1: any,
        p2: any,
        p3: any,
        p4: any,
        p5: any,
      ): any;
    }
    function afterStart(
      p0: any,
      p1: any,
      p2: any,
      p3: any,
      p4: any,
      p5: any,
    ): any;
    namespace afterStart {
      function isRequired(
        p0: any,
        p1: any,
        p2: any,
        p3: any,
        p4: any,
        p5: any,
      ): any;
    }
    function beforeFinish(
      p0: any,
      p1: any,
      p2: any,
      p3: any,
      p4: any,
      p5: any,
    ): any;
    namespace beforeFinish {
      function isRequired(
        p0: any,
        p1: any,
        p2: any,
        p3: any,
        p4: any,
        p5: any,
      ): any;
    }
    function beforeStart(
      p0: any,
      p1: any,
      p2: any,
      p3: any,
      p4: any,
      p5: any,
    ): any;
    namespace beforeStart {
      function isRequired(
        p0: any,
        p1: any,
        p2: any,
        p3: any,
        p4: any,
        p5: any,
      ): any;
    }
    function change(p0: any, p1: any, p2: any, p3: any, p4: any, p5: any): any;
    function classDisabled(
      p0: any,
      p1: any,
      p2: any,
      p3: any,
      p4: any,
      p5: any,
    ): any;
    namespace classDisabled {
      function isRequired(
        p0: any,
        p1: any,
        p2: any,
        p3: any,
        p4: any,
        p5: any,
      ): any;
    }
    function classEditing(
      p0: any,
      p1: any,
      p2: any,
      p3: any,
      p4: any,
      p5: any,
    ): any;
    namespace classEditing {
      function isRequired(
        p0: any,
        p1: any,
        p2: any,
        p3: any,
        p4: any,
        p5: any,
      ): any;
    }
    function classInvalid(
      p0: any,
      p1: any,
      p2: any,
      p3: any,
      p4: any,
      p5: any,
    ): any;
    namespace classInvalid {
      function isRequired(
        p0: any,
        p1: any,
        p2: any,
        p3: any,
        p4: any,
        p5: any,
      ): any;
    }
    function classLoading(
      p0: any,
      p1: any,
      p2: any,
      p3: any,
      p4: any,
      p5: any,
    ): any;
    namespace classLoading {
      function isRequired(
        p0: any,
        p1: any,
        p2: any,
        p3: any,
        p4: any,
        p5: any,
      ): any;
    }
    function className(
      p0: any,
      p1: any,
      p2: any,
      p3: any,
      p4: any,
      p5: any,
    ): any;
    namespace className {
      function isRequired(
        p0: any,
        p1: any,
        p2: any,
        p3: any,
        p4: any,
        p5: any,
      ): any;
    }
    function defaultProps(
      p0: any,
      p1: any,
      p2: any,
      p3: any,
      p4: any,
      p5: any,
    ): any;
    namespace defaultProps {
      function isRequired(
        p0: any,
        p1: any,
        p2: any,
        p3: any,
        p4: any,
        p5: any,
      ): any;
    }
    function editProps(
      p0: any,
      p1: any,
      p2: any,
      p3: any,
      p4: any,
      p5: any,
    ): any;
    namespace editProps {
      function isRequired(
        p0: any,
        p1: any,
        p2: any,
        p3: any,
        p4: any,
        p5: any,
      ): any;
    }
    function handleValidationFail(
      p0: any,
      p1: any,
      p2: any,
      p3: any,
      p4: any,
      p5: any,
    ): any;
    namespace handleValidationFail {
      function isRequired(
        p0: any,
        p1: any,
        p2: any,
        p3: any,
        p4: any,
        p5: any,
      ): any;
    }
    function isDisabled(
      p0: any,
      p1: any,
      p2: any,
      p3: any,
      p4: any,
      p5: any,
    ): any;
    namespace isDisabled {
      function isRequired(
        p0: any,
        p1: any,
        p2: any,
        p3: any,
        p4: any,
        p5: any,
      ): any;
    }
    function propName(
      p0: any,
      p1: any,
      p2: any,
      p3: any,
      p4: any,
      p5: any,
    ): any;
    function shouldBlockWhileLoading(
      p0: any,
      p1: any,
      p2: any,
      p3: any,
      p4: any,
      p5: any,
    ): any;
    namespace shouldBlockWhileLoading {
      function isRequired(
        p0: any,
        p1: any,
        p2: any,
        p3: any,
        p4: any,
        p5: any,
      ): any;
    }
    function shouldRemainWhileInvalid(
      p0: any,
      p1: any,
      p2: any,
      p3: any,
      p4: any,
      p5: any,
    ): any;
    namespace shouldRemainWhileInvalid {
      function isRequired(
        p0: any,
        p1: any,
        p2: any,
        p3: any,
        p4: any,
        p5: any,
      ): any;
    }
    function validate(
      p0: any,
      p1: any,
      p2: any,
      p3: any,
      p4: any,
      p5: any,
    ): any;
    namespace validate {
      function isRequired(
        p0: any,
        p1: any,
        p2: any,
        p3: any,
        p4: any,
        p5: any,
      ): any;
    }
    function value(p0: any, p1: any, p2: any, p3: any, p4: any, p5: any): any;
  }
}
export class RIENumber {
  constructor(props: any);
  forceUpdate(callback: any): void;
  setState(partialState: any, callback: any): void;
}
export namespace RIENumber {
  namespace propTypes {
    function format(p0: any, p1: any, p2: any, p3: any, p4: any, p5: any): any;
    namespace format {
      function isRequired(
        p0: any,
        p1: any,
        p2: any,
        p3: any,
        p4: any,
        p5: any,
      ): any;
    }
  }
}
export class RIESelect {
  constructor(...args: any[]);
  forceUpdate(callback: any): void;
  setState(partialState: any, callback: any): void;
}
export namespace RIESelect {
  namespace propTypes {
    function options(p0: any, p1: any, p2: any, p3: any, p4: any, p5: any): any;
  }
}
export class RIETags {
  constructor(props: any);
  forceUpdate(callback: any): void;
  setState(partialState: any, callback: any): void;
}
export namespace RIETags {
  namespace propTyes {
    function blurDelay(
      p0: any,
      p1: any,
      p2: any,
      p3: any,
      p4: any,
      p5: any,
    ): any;
    namespace blurDelay {
      function isRequired(
        p0: any,
        p1: any,
        p2: any,
        p3: any,
        p4: any,
        p5: any,
      ): any;
    }
    function elementClass(
      p0: any,
      p1: any,
      p2: any,
      p3: any,
      p4: any,
      p5: any,
    ): any;
    namespace elementClass {
      function isRequired(
        p0: any,
        p1: any,
        p2: any,
        p3: any,
        p4: any,
        p5: any,
      ): any;
    }
    function maxTags(p0: any, p1: any, p2: any, p3: any, p4: any, p5: any): any;
    namespace maxTags {
      function isRequired(
        p0: any,
        p1: any,
        p2: any,
        p3: any,
        p4: any,
        p5: any,
      ): any;
    }
    function minTags(p0: any, p1: any, p2: any, p3: any, p4: any, p5: any): any;
    namespace minTags {
      function isRequired(
        p0: any,
        p1: any,
        p2: any,
        p3: any,
        p4: any,
        p5: any,
      ): any;
    }
    function placeholder(
      p0: any,
      p1: any,
      p2: any,
      p3: any,
      p4: any,
      p5: any,
    ): any;
    namespace placeholder {
      function isRequired(
        p0: any,
        p1: any,
        p2: any,
        p3: any,
        p4: any,
        p5: any,
      ): any;
    }
    function separator(
      p0: any,
      p1: any,
      p2: any,
      p3: any,
      p4: any,
      p5: any,
    ): any;
    namespace separator {
      function isRequired(
        p0: any,
        p1: any,
        p2: any,
        p3: any,
        p4: any,
        p5: any,
      ): any;
    }
    function value(p0: any, p1: any, p2: any, p3: any, p4: any, p5: any): any;
  }
  namespace propTypes {
    function afterFinish(
      p0: any,
      p1: any,
      p2: any,
      p3: any,
      p4: any,
      p5: any,
    ): any;
    namespace afterFinish {
      function isRequired(
        p0: any,
        p1: any,
        p2: any,
        p3: any,
        p4: any,
        p5: any,
      ): any;
    }
    function afterStart(
      p0: any,
      p1: any,
      p2: any,
      p3: any,
      p4: any,
      p5: any,
    ): any;
    namespace afterStart {
      function isRequired(
        p0: any,
        p1: any,
        p2: any,
        p3: any,
        p4: any,
        p5: any,
      ): any;
    }
    function beforeFinish(
      p0: any,
      p1: any,
      p2: any,
      p3: any,
      p4: any,
      p5: any,
    ): any;
    namespace beforeFinish {
      function isRequired(
        p0: any,
        p1: any,
        p2: any,
        p3: any,
        p4: any,
        p5: any,
      ): any;
    }
    function beforeStart(
      p0: any,
      p1: any,
      p2: any,
      p3: any,
      p4: any,
      p5: any,
    ): any;
    namespace beforeStart {
      function isRequired(
        p0: any,
        p1: any,
        p2: any,
        p3: any,
        p4: any,
        p5: any,
      ): any;
    }
    function change(p0: any, p1: any, p2: any, p3: any, p4: any, p5: any): any;
    function classDisabled(
      p0: any,
      p1: any,
      p2: any,
      p3: any,
      p4: any,
      p5: any,
    ): any;
    namespace classDisabled {
      function isRequired(
        p0: any,
        p1: any,
        p2: any,
        p3: any,
        p4: any,
        p5: any,
      ): any;
    }
    function classEditing(
      p0: any,
      p1: any,
      p2: any,
      p3: any,
      p4: any,
      p5: any,
    ): any;
    namespace classEditing {
      function isRequired(
        p0: any,
        p1: any,
        p2: any,
        p3: any,
        p4: any,
        p5: any,
      ): any;
    }
    function classInvalid(
      p0: any,
      p1: any,
      p2: any,
      p3: any,
      p4: any,
      p5: any,
    ): any;
    namespace classInvalid {
      function isRequired(
        p0: any,
        p1: any,
        p2: any,
        p3: any,
        p4: any,
        p5: any,
      ): any;
    }
    function classLoading(
      p0: any,
      p1: any,
      p2: any,
      p3: any,
      p4: any,
      p5: any,
    ): any;
    namespace classLoading {
      function isRequired(
        p0: any,
        p1: any,
        p2: any,
        p3: any,
        p4: any,
        p5: any,
      ): any;
    }
    function className(
      p0: any,
      p1: any,
      p2: any,
      p3: any,
      p4: any,
      p5: any,
    ): any;
    namespace className {
      function isRequired(
        p0: any,
        p1: any,
        p2: any,
        p3: any,
        p4: any,
        p5: any,
      ): any;
    }
    function defaultProps(
      p0: any,
      p1: any,
      p2: any,
      p3: any,
      p4: any,
      p5: any,
    ): any;
    namespace defaultProps {
      function isRequired(
        p0: any,
        p1: any,
        p2: any,
        p3: any,
        p4: any,
        p5: any,
      ): any;
    }
    function editProps(
      p0: any,
      p1: any,
      p2: any,
      p3: any,
      p4: any,
      p5: any,
    ): any;
    namespace editProps {
      function isRequired(
        p0: any,
        p1: any,
        p2: any,
        p3: any,
        p4: any,
        p5: any,
      ): any;
    }
    function handleValidationFail(
      p0: any,
      p1: any,
      p2: any,
      p3: any,
      p4: any,
      p5: any,
    ): any;
    namespace handleValidationFail {
      function isRequired(
        p0: any,
        p1: any,
        p2: any,
        p3: any,
        p4: any,
        p5: any,
      ): any;
    }
    function isDisabled(
      p0: any,
      p1: any,
      p2: any,
      p3: any,
      p4: any,
      p5: any,
    ): any;
    namespace isDisabled {
      function isRequired(
        p0: any,
        p1: any,
        p2: any,
        p3: any,
        p4: any,
        p5: any,
      ): any;
    }
    function propName(
      p0: any,
      p1: any,
      p2: any,
      p3: any,
      p4: any,
      p5: any,
    ): any;
    function shouldBlockWhileLoading(
      p0: any,
      p1: any,
      p2: any,
      p3: any,
      p4: any,
      p5: any,
    ): any;
    namespace shouldBlockWhileLoading {
      function isRequired(
        p0: any,
        p1: any,
        p2: any,
        p3: any,
        p4: any,
        p5: any,
      ): any;
    }
    function shouldRemainWhileInvalid(
      p0: any,
      p1: any,
      p2: any,
      p3: any,
      p4: any,
      p5: any,
    ): any;
    namespace shouldRemainWhileInvalid {
      function isRequired(
        p0: any,
        p1: any,
        p2: any,
        p3: any,
        p4: any,
        p5: any,
      ): any;
    }
    function validate(
      p0: any,
      p1: any,
      p2: any,
      p3: any,
      p4: any,
      p5: any,
    ): any;
    namespace validate {
      function isRequired(
        p0: any,
        p1: any,
        p2: any,
        p3: any,
        p4: any,
        p5: any,
      ): any;
    }
    function value(p0: any, p1: any, p2: any, p3: any, p4: any, p5: any): any;
  }
}
export class RIETextArea {
  constructor(...args: any[]);
  forceUpdate(callback: any): void;
  setState(partialState: any, callback: any): void;
}
export namespace RIETextArea {
  namespace propTypes {
    function afterFinish(
      p0: any,
      p1: any,
      p2: any,
      p3: any,
      p4: any,
      p5: any,
    ): any;
    namespace afterFinish {
      function isRequired(
        p0: any,
        p1: any,
        p2: any,
        p3: any,
        p4: any,
        p5: any,
      ): any;
    }
    function afterStart(
      p0: any,
      p1: any,
      p2: any,
      p3: any,
      p4: any,
      p5: any,
    ): any;
    namespace afterStart {
      function isRequired(
        p0: any,
        p1: any,
        p2: any,
        p3: any,
        p4: any,
        p5: any,
      ): any;
    }
    function beforeFinish(
      p0: any,
      p1: any,
      p2: any,
      p3: any,
      p4: any,
      p5: any,
    ): any;
    namespace beforeFinish {
      function isRequired(
        p0: any,
        p1: any,
        p2: any,
        p3: any,
        p4: any,
        p5: any,
      ): any;
    }
    function beforeStart(
      p0: any,
      p1: any,
      p2: any,
      p3: any,
      p4: any,
      p5: any,
    ): any;
    namespace beforeStart {
      function isRequired(
        p0: any,
        p1: any,
        p2: any,
        p3: any,
        p4: any,
        p5: any,
      ): any;
    }
    function change(p0: any, p1: any, p2: any, p3: any, p4: any, p5: any): any;
    function classDisabled(
      p0: any,
      p1: any,
      p2: any,
      p3: any,
      p4: any,
      p5: any,
    ): any;
    namespace classDisabled {
      function isRequired(
        p0: any,
        p1: any,
        p2: any,
        p3: any,
        p4: any,
        p5: any,
      ): any;
    }
    function classEditing(
      p0: any,
      p1: any,
      p2: any,
      p3: any,
      p4: any,
      p5: any,
    ): any;
    namespace classEditing {
      function isRequired(
        p0: any,
        p1: any,
        p2: any,
        p3: any,
        p4: any,
        p5: any,
      ): any;
    }
    function classInvalid(
      p0: any,
      p1: any,
      p2: any,
      p3: any,
      p4: any,
      p5: any,
    ): any;
    namespace classInvalid {
      function isRequired(
        p0: any,
        p1: any,
        p2: any,
        p3: any,
        p4: any,
        p5: any,
      ): any;
    }
    function classLoading(
      p0: any,
      p1: any,
      p2: any,
      p3: any,
      p4: any,
      p5: any,
    ): any;
    namespace classLoading {
      function isRequired(
        p0: any,
        p1: any,
        p2: any,
        p3: any,
        p4: any,
        p5: any,
      ): any;
    }
    function className(
      p0: any,
      p1: any,
      p2: any,
      p3: any,
      p4: any,
      p5: any,
    ): any;
    namespace className {
      function isRequired(
        p0: any,
        p1: any,
        p2: any,
        p3: any,
        p4: any,
        p5: any,
      ): any;
    }
    function defaultProps(
      p0: any,
      p1: any,
      p2: any,
      p3: any,
      p4: any,
      p5: any,
    ): any;
    namespace defaultProps {
      function isRequired(
        p0: any,
        p1: any,
        p2: any,
        p3: any,
        p4: any,
        p5: any,
      ): any;
    }
    function editProps(
      p0: any,
      p1: any,
      p2: any,
      p3: any,
      p4: any,
      p5: any,
    ): any;
    namespace editProps {
      function isRequired(
        p0: any,
        p1: any,
        p2: any,
        p3: any,
        p4: any,
        p5: any,
      ): any;
    }
    function handleValidationFail(
      p0: any,
      p1: any,
      p2: any,
      p3: any,
      p4: any,
      p5: any,
    ): any;
    namespace handleValidationFail {
      function isRequired(
        p0: any,
        p1: any,
        p2: any,
        p3: any,
        p4: any,
        p5: any,
      ): any;
    }
    function isDisabled(
      p0: any,
      p1: any,
      p2: any,
      p3: any,
      p4: any,
      p5: any,
    ): any;
    namespace isDisabled {
      function isRequired(
        p0: any,
        p1: any,
        p2: any,
        p3: any,
        p4: any,
        p5: any,
      ): any;
    }
    function propName(
      p0: any,
      p1: any,
      p2: any,
      p3: any,
      p4: any,
      p5: any,
    ): any;
    function shouldBlockWhileLoading(
      p0: any,
      p1: any,
      p2: any,
      p3: any,
      p4: any,
      p5: any,
    ): any;
    namespace shouldBlockWhileLoading {
      function isRequired(
        p0: any,
        p1: any,
        p2: any,
        p3: any,
        p4: any,
        p5: any,
      ): any;
    }
    function shouldRemainWhileInvalid(
      p0: any,
      p1: any,
      p2: any,
      p3: any,
      p4: any,
      p5: any,
    ): any;
    namespace shouldRemainWhileInvalid {
      function isRequired(
        p0: any,
        p1: any,
        p2: any,
        p3: any,
        p4: any,
        p5: any,
      ): any;
    }
    function validate(
      p0: any,
      p1: any,
      p2: any,
      p3: any,
      p4: any,
      p5: any,
    ): any;
    namespace validate {
      function isRequired(
        p0: any,
        p1: any,
        p2: any,
        p3: any,
        p4: any,
        p5: any,
      ): any;
    }
    function value(p0: any, p1: any, p2: any, p3: any, p4: any, p5: any): any;
  }
}

interface RIEToggleProps {
  value: any;
  className?: string;
  change?: (event: any) => void;
  textTrue?: string;
  textFalse?: string;
  classLoading?: string;
  propName?: string;
  isDisabled: boolean;
}

export class RIEToggle extends React.Component<RIEToggleProps> {
  constructor(...args: any[]);
  forceUpdate(callback: any): void;
  setState(partialState: any, callback: any): void;
}
export namespace RIEToggle {
  namespace propTypes {
    function textFalse(
      p0: any,
      p1: any,
      p2: any,
      p3: any,
      p4: any,
      p5: any,
    ): any;
    namespace textFalse {
      function isRequired(
        p0: any,
        p1: any,
        p2: any,
        p3: any,
        p4: any,
        p5: any,
      ): any;
    }
    function textTrue(
      p0: any,
      p1: any,
      p2: any,
      p3: any,
      p4: any,
      p5: any,
    ): any;
    namespace textTrue {
      function isRequired(
        p0: any,
        p1: any,
        p2: any,
        p3: any,
        p4: any,
        p5: any,
      ): any;
    }
  }
}
