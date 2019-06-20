/**
 * @flow
 */

import KV from "./keyboardAvoidingView";
import SV from "./scrollView";

const init = (
  EVENT_TYPES: string[],
) => {
  return {
    KeyboardAvoidingView: (props) => (
      <KV
        {...props}
        customEvents={EVENT_TYPES}
      />
    ),
    ScrollView: (props) => (
      <SV
        {...props}
        customEvents={EVENT_TYPES}
      />
    ),
  };
}

export default init;