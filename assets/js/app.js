import 'phoenix_html';
import { Presence, Socket } from 'phoenix';

let user = document.getElementById('User').innerText;
let socket = new Socket('/socket', { params: { user: user } });
socket.connect();

let presences = {};

let formatedTimestamp = Ts => {
  let date = new Date(Ts);
  return date.toLocaleString();
};

let listBy = (user, { metas: metas }) => {
  return {
    user: user,
    onlineAt: formatedTimestamp(metas[0].online_at),
  };
};

let userList = document.getElementById('UserList');
let render = presences => {
  userList.innerHTML = Presence.list(presences, listBy)
    .map(
      presence => `
            <li>
                ${presence.user}
                <br>
                <small>online since ${presence.onlineAt}</small>
            </li>
        `
    )
    .join('');
};

let room = socket.channel('room:lobby');
// Handle two events from our channel,
// the first is about the server which send informations
// on users who are dis/connected @ the first time we come
room.on('presence_state', state => {
  presences = Presence.syncState(presences, state);
  render(presences);
});

// the second is when we're on the application and new users are dis/connecting, we sync the diff
room.on('presence_diff', diff => {
  presences = Presence.syncDiff(presences, diff);
  render(presences);
});

room.join();
