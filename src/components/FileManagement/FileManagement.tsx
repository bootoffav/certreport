import qs from 'qs';
import { Dimmer } from 'tabler-react';
import { useEffect, useState } from 'react';
import * as B24 from 'B24/B24';
import { OtherFilesList } from './OtherFilesList';
import { UploadFile } from './UploadFile';
import type { AttachedFile } from 'Task/types';
import { SpecificFile } from './SpecificFile/SpecificFile';
import { getAttachedFiles } from 'B24/B24';
import { useParams } from 'react-router';

const creator_id = process.env.REACT_APP_B24_USER_ID;
const webhook_key = process.env.REACT_APP_B24_WEBHOOK_KEY;
const main_url = process.env.REACT_APP_B24_MAIN_URL;

const pullSpecificFiles = (
  files: AttachedFile[],
  type: 'Test Report' | 'Certificate'
) => {
  const specificFiles: AttachedFile[] = [];
  files = files.filter((file: AttachedFile) => {
    if (file.NAME.startsWith(type + '_')) {
      specificFiles.push(file);
      return false;
    }

    return true;
  });

  return [files, specificFiles];
};

function FileManagement() {
  const { taskId } = useParams<{ taskId?: string }>();
  let [files, setFiles] = useState<AttachedFile[]>([]);
  let testReportFiles;
  let certificateFiles;

  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    (async () => {
      if (!uploading && taskId) {
        let files = await getAttachedFiles(taskId);
        setFiles(files);
      }
    })();
  }, [taskId, uploading]);

  const upload = (e: any, filePrefix: string = '') => {
    setUploading(true);
    for (let file of e.target.files) {
      taskId &&
        B24.fileUpload(taskId, `${filePrefix}${file.name}`, file).then(() =>
          setUploading(false)
        );
    }
  };

  const renameFile = (id: string, newName: string) => {
    setUploading(true);
    fetch(
      `${main_url}/${creator_id}/${webhook_key}/disk.file.rename?` +
        qs.stringify({
          id,
          newName,
        })
    ).then(() => setUploading(false));
  };

  const deleteFile = (file: AttachedFile) => {
    setUploading(true);
    Promise.all([
      fetch(
        `${main_url}/${creator_id}/${webhook_key}/task.item.deletefile?` +
          qs.stringify({
            TASK_ID: taskId,
            ATTACHMENT_ID: file.ATTACHMENT_ID,
          })
      ),
      fetch(
        `${main_url}/${creator_id}/${webhook_key}/disk.file.delete?` +
          qs.stringify({ id: file.FILE_ID })
      ),
    ]).then(() => setUploading(false));
  };

  [files, testReportFiles] = pullSpecificFiles(files, 'Test Report');
  [files, certificateFiles] = pullSpecificFiles(files, 'Certificate');

  return !taskId ? (
    <>
      this pane manages files when it's in task editing mode, please save first
    </>
  ) : uploading ? (
    <Dimmer active loader></Dimmer>
  ) : (
    <>
      <SpecificFile
        type="Test Report"
        deleteFile={deleteFile}
        upload={upload}
        files={testReportFiles}
      />

      <SpecificFile
        type="Certificate"
        deleteFile={deleteFile}
        upload={upload}
        files={certificateFiles}
      />
      <OtherFilesList
        attachedFiles={files}
        deleteFile={deleteFile}
        renameFile={renameFile}
      />
      <UploadFile upload={upload} />
    </>
  );
}

export { FileManagement, pullSpecificFiles };
