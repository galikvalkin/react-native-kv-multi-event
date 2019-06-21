/**
 * @flow
 */

export const transformToKeyboardEvent = (event: Object) => {
  if (!event) {
    return null;
  }
  const endCoordinates = {
    screenX: event.layout ? event.layout.x : 0,
    screenY: event.layout ? event.layout.y : 0,
    height: event.layout ? event.layout.height : 0,
    width: event.layout ? event.layout.width : 0,
  };

  return {
    endCoordinates,
    easing: "keyboard",
    duration: 250,
  };
};
