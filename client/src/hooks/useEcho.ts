import { useEffect, useRef } from 'react';
import echo from '../utils/echo';

type ChannelType = 'public' | 'private' | 'presence';

export const useEcho = <T>(
  channelName: string,
  eventName: string,
  callback: (data: T) => void,
  type: ChannelType = 'public'
) => {
  // Use a ref for the callback to prevent the useEffect from 
  // re-running every time the parent component re-renders.
  const callbackRef = useRef(callback);

  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  useEffect(() => {
    // Determine the channel type
    let channel;
    if (type === 'private') {
      channel = echo.private(channelName);
    } else if (type === 'presence') {
      channel = echo.join(channelName);
    } else {
      channel = echo.channel(channelName);
    }

    channel.listen(eventName, (data: T) => {
      callbackRef.current(data);
    });

    // Stop listening and leave the channel
    return () => {
      channel.stopListening(eventName);
      echo.leave(channelName);
    };
  }, [channelName, eventName, type]);
};