chrome.action.onClicked.addListener(() => {
  chrome.cookies.get({
    name: 'token',
    url: 'https://arena.social',
  }, async (cookie) => {
    if (cookie) {
      const {
        value: token,
      } = cookie;

      const headers = new Headers();
      headers.set('Authorization', `Bearer ${token}`);
      headers.set('Content-Type', 'application/json');
      headers.set('Accept', 'application/json');
      const response = await fetch('https://api.starsarena.com/chat/conversations', {
        headers,
        method: 'GET',
      });

      const {
        groups
      } = await response.json();
      const groupIds = groups.map(({ id }) => id);
      for (const groupId of groupIds) {
        await fetch('https://api.starsarena.com/chat/message', {
          headers,
          method: 'POST',
          body: JSON.stringify({
            files: [],
            groupId,
            text: 'GM',
          }),
        });
      }
    }
  });
});
