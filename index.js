/**
 * @flow
 */

/* REACT */
import * as React from "react";

import KV from "./keyboardAvoidingView";
import SV from "./scrollView";

const init = (
  EVENT_TYPES: string[],
) => {
  return {
    KeyboardAvoidingView: React.forwardRef((props, ref) => (
      <KV
        {...props}
        ref={ref}
        customEvents={EVENT_TYPES}
      />
    )),
    ScrollView: React.forwardRef((props, ref) => (
      <SV
        {...props}
        ref={ref}
        customEvents={EVENT_TYPES}
      />
    )),
  };
}

export * from "./helpers";

export default init;