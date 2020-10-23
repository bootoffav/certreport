import qs from 'qs';
import { Dimmer } from 'tabler-react';
import { useEffect, useState } from 'react';
import * as B24 from '../../B24/B24';
import { UploadedFilesList } from './UploadedFilesList';
import { UploadFile } from './UploadFile';

const creator_id = process.env.REACT_APP_B24_USER_ID;
const webhook_key = process.env.REACT_APP_B24_WEBHOOK_KEY;
const main_url = process.env.REACT_APP_B24_MAIN_URL;

function FileManagement(props: {
  taskId: string | undefined;
  attachedFiles: any;
  updateAttachedFiles: () => void;
}) {
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    setUploading(false);
  }, [props.attachedFiles]);

  const upload = (e: any) => {
    setUploading(true);
    for (let file of e.target.files) {
      const reader = new FileReader();
      reader.readAsBinaryString(file);
      reader.onload = () =>
        // @ts-ignore
        B24.fileUpload(props.taskId, file.name, reader.result).then(
          props.updateAttachedFiles
        );
    }
  };

  const deleteFile = (file: any) => {
    setUploading(true);
    Promise.all([
      fetch(
        `${main_url}/${creator_id}/${webhook_key}/task.item.deletefile?` +
          qs.stringify({
            TASK_ID: props.taskId,
            ATTACHMENT_ID: file.ATTACHMENT_ID,
          })
      ),
      fetch(
        `${main_url}/${creator_id}/${webhook_key}/disk.file.delete?` +
          qs.stringify({ id: file.FILE_ID })
      ),
    ]).then(props.updateAttachedFiles);
  };

  return uploading ? (
    <Dimmer active loader></Dimmer>
  ) : (
    <>
      <UploadedFilesList
        attachedFiles={props.attachedFiles}
        deleteFile={deleteFile}
      />
      <UploadFile upload={upload} />
    </>
  );
}

export { FileManagement };
