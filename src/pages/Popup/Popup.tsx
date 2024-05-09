import React, { useState } from 'react';
import './Popup.scss';

export default function Popup() {
  const [message, setMessage] = useState<string>('');

  const actionHandler: React.FormEventHandler<HTMLFormElement> = (event) => {
    event.preventDefault();

    const messageToSend = message;
    setMessage('');
    chrome.cookies.get(
      {
        name: 'token',
        url: 'https://arena.social',
      },
      async (cookie) => {
        if (cookie) {
          const { value: token } = cookie;

          const headers = new Headers();
          headers.set('Authorization', `Bearer ${token}`);
          headers.set('Content-Type', 'application/json');
          headers.set('Accept', 'application/json');
          const response = await fetch(
            'https://api.starsarena.com/chat/conversations',
            {
              headers,
              method: 'GET',
            }
          );

          const { groups } = await response.json();
          const groupIds = (groups as { id: string }[]).map(({ id }) => id);
          for (const groupId of groupIds) {
            await fetch('https://api.starsarena.com/chat/message', {
              headers,
              method: 'POST',
              body: JSON.stringify({
                files: [],
                groupId,
                text: messageToSend,
              }),
            });
          }
        }
      }
    );
  };

  const messageHandler: React.ChangeEventHandler<HTMLInputElement> = (
    event
  ) => {
    setMessage(event.target.value);
  };

  const placeholder = 'Message for all chats';

  return (
    <main className="freeman-regular h-screen w-screen border-[0.3rem] border-white bg-[#020202]">
      <div className="flex h-full w-full flex-col items-center justify-center">
        <div className="flex h-full w-3/4 flex-col items-start justify-center">
          <div className="text-gray basis-[30%] text-[3rem]">
            The Arena Easy Message
          </div>
          <form
            className="form__group flex w-full basis-[40%] flex-col"
            onSubmit={actionHandler}
          >
            <input
              className="form__field"
              type="text"
              name="message"
              placeholder={placeholder}
              value={message}
              onChange={messageHandler}
              required
            />
            <label htmlFor="message" className="form__label">
              {placeholder}
            </label>
            <button
              className="text-gray mt-[2rem] self-end text-[3rem]"
              type="submit"
            >
              SEND TO EVERYONE
            </button>
          </form>
        </div>
      </div>
    </main>
  );
}
