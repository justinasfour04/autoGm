import { MessageEvents, Messages } from '../../types';
import { sleep } from '../../utils';

const PAGE_SIZE = 25;

chrome.runtime.onMessage.addListener((message: Messages) => {
  const {
    event,
    payload,
  } = message;
  switch (event) {
    case MessageEvents.SEND_MESSAGES_TO_CHAT: {
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

            let page = 0;
            let totalPages = 0;
            let groupIds: string[] = [];
            do {
              const response = await fetch(
                `https://api.starsarena.com/chat/conversations?page=${++page}&pageSze=${PAGE_SIZE}`,
                {
                  headers,
                  method: 'GET',
                }
              );
    
              const {
                groups,
                numberOfPages,
              } = await response.json();
              totalPages = numberOfPages;
              (groups as { id: string }[]).reduce((ids, { id }) => {
                ids.push(id);
                return ids;
              }, groupIds);
            } while (totalPages - page > 0);

            for (const groupId of groupIds) {
              await fetch('https://api.starsarena.com/chat/message', {
                headers,
                method: 'POST',
                body: JSON.stringify({
                  files: [],
                  groupId,
                  text: payload,
                }),
              });
              await sleep(100);
            }
          }
        }
      );
    }
  }
});
