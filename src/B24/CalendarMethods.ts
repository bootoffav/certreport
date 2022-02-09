import dayjs from 'dayjs';
import qs from 'qs';
import { mainUrl, creatorId, webhookKey } from './B24';

type addExpirationDateprops = {
  expirationDate: dayjs.ConfigType;
  description: string;
  name: string;
};

function addExpirationDate({
  expirationDate,
  description,
  name,
}: addExpirationDateprops) {
  return fetch(
    `${mainUrl}/${creatorId}/${webhookKey}/calendar.event.add?` +
      qs.stringify({
        type: 'user',
        ownerId: creatorId,
        name: `Expiration of ${name}`,
        description, // b24 link
        from: expirationDate, // expiration date
        to: expirationDate, // expiration date
        skipTime: 'Y',
        section: 680,
        color: '#9cbe1c', // to be determined
        text_color: '#283033', // to be determined
        accessibility: 'free',
        // attendees: [5, 19, 3524], // Butov Aleksei, Vitaly Aliev, Ira Danilova
        importance: 'normal',
        is_meeting: 'N',
        private_event: 'N',
        remind: [{ type: 'day', count: 20 }],
      })
  );
}

function deleteExpirationDate(id: number) {
  fetch(
    `${mainUrl}/${creatorId}/${webhookKey}/calendar.event.delete?` +
      qs.stringify({
        type: 'user',
        ownerId: creatorId,
        id,
      })
  );
}
export { addExpirationDate, deleteExpirationDate };
