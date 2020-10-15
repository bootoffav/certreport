import qs from 'qs';
import { mainUrl, creatorId, webhookKey } from './B24';

/**
 * Remove link to the file from specified task
 * @param  {string} id task from which to detach file
 * @param  {string} attachmentId specified ID of file
 */
function detachFileFromTask(id: string, attachmentId: string) {
  fetch(
    `${mainUrl}/${creatorId}/${webhookKey}/task.item.deletefile?` +
      qs.stringify({
        TASK_ID: id,
        ATTACHMENT_ID: attachmentId,
      })
  );
}

/**
 * Get array of attached files.
 * @param {string} id TaskID
 * @returns {}
 */
function getAttachedFiles(id: string) {
  return fetch(
    `${mainUrl}/${creatorId}/${webhookKey}/task.item.getfiles?` +
      qs.stringify({ TASKID: id })
  )
    .then((r) => r.json())
    .then(({ result }: any) => result)
    .catch((e) => {
      console.log(e);
      return [];
    });
}

/**
 * Removes file from B24 disk permanently
 * @param  {string} ID of file in Bitrix file-system
 */
function removeFileFromDisk(id: string) {
  fetch(
    `${mainUrl}/${creatorId}/${webhookKey}/disk.file.delete?` +
      qs.stringify({ id })
  );
}

export { detachFileFromTask, getAttachedFiles, removeFileFromDisk };
