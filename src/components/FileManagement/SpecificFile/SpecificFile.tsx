import { Form, Grid } from 'tabler-react';
import React from 'react';
import type { AttachedFile } from '../../../Task/types';
import { FileView } from '../OtherFilesList';

interface Props {
  type: 'Test Report' | 'Certificate';
  deleteFile: any;
  upload: any;
  files: AttachedFile[];
}

function SpecificFile(props: Props) {
  return (
    <div className="uploadedFiles">
      <Grid.Row>
        <Grid.Col width="6">
          <Form.Label className="formLabels">{props.type}</Form.Label>
          {props.files.length !== 0 ? (
            props.files.map((file: any) => (
              <p key={file.FILE_ID} className="pl-2">
                <FileView file={file} deleteFile={props.deleteFile} />
              </p>
            ))
          ) : (
            <FileView
              fileNamePlaceholder={`${props.type} is not uploaded yet`}
            ></FileView>
          )}
        </Grid.Col>
        <Grid.Col>
          <Form.Group>
            <Form.Label className="formLabels">Add {props.type}</Form.Label>
            <Form.FileInput
              onChange={(e: any) => props.upload(e, `${props.type}_`)}
            />
          </Form.Group>
        </Grid.Col>
      </Grid.Row>
    </div>
  );
}

export { SpecificFile };
