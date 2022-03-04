import dayjs from 'dayjs';
import qs from 'qs';
import { mainUrl, creatorId, webhookKey } from './B24';

type addEventprops = {
  date: dayjs.ConfigType;
  description: string;
  name: string;
  section: 680 | 682; // Certificate expiration dates | Certificate acquision dates
};

function addEvent({ date, description, name, section }: addEventprops) {
  return fetch(
    `${mainUrl}/${creatorId}/${webhookKey}/calendar.event.add?` +
      qs.stringify({
        type: 'user',
        ownerId: creatorId,
        section,
        name,
        description, // b24 link
        from: date,
        to: date,
        skipTime: 'Y',
      })
  );
}

function deleteEvent(id: number) {
  return fetch(
    `${mainUrl}/${creatorId}/${webhookKey}/calendar.event.delete?` +
      qs.stringify({
        type: 'user',
        ownerId: creatorId,
        id,
      })
  );
}
export { addEvent, deleteEvent };
