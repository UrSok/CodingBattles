import { ProFormText, ProFormTextArea } from '@ant-design/pro-form';
import { Form, Typography } from 'antd';
import useFormInstance from 'antd/lib/form/hooks/useFormInstance';
import CardSection from 'app/components/CardSection';
import MultiTagSelect from 'app/pages/Challenges/components/MultiTagSelect';
import React, { useRef } from 'react'
import { FormFields } from '../../types';
import MarkdownDescriptionEditor, {
  MarkdownEditorRef,
} from '../MarkdownDescriptionEditor';

// TODO: Not used yet

export default function GeneralInformationSection() {
  const form = useFormInstance();


  const markdownEditorRef = useRef<MarkdownEditorRef>();

  
   /*const handleMarkdownInputChanged = (value: string | undefined) => {
    saveStateEnableDecorated();
    formRef.current?.setFields([
      {
        name: FormFields.descriptionMarkdown,
        errors: value ? [] : ['Description is required'],
        value: value,
      }
    ]);
  }


   if (!value || value.length === 0) {
      formRef.setFields([
        {
          name: SaveFields.descriptionMarkdown,
          errors: ['Description is required'],
          value: undefined,
        },
      ]);
      return;
    }

    formRef.setFields([
      {
        name: SaveFields.descriptionMarkdown,
        errors: [],
        value: 'nice',
      },
    ]);*/
  
  return (
    <CardSection title="General Information">
      <Typography.Text strong>Title</Typography.Text>
      <ProFormText
        name={FormFields.name}
        placeholder="Name"
        rules={[
          {
            required: true,
            message: 'Name is required',
          },
        ]}
        allowClear={false}
      />
      <Typography.Text strong>Tags</Typography.Text>
      <MultiTagSelect name={FormFields.tags} requiredRule />
      <Typography.Text strong>Short Description</Typography.Text>
      <ProFormTextArea
        name={FormFields.descriptionShort}
        placeholder="Challenge short description"
        rules={[
          {
            required: true,
            message: 'Short description is required',
          },
        ]}
      />
      <Typography.Text strong>Description</Typography.Text>
      <Form.Item
        name={FormFields.descriptionMarkdown}
        rules={[
          {
            required: true,
            message: 'Description is required',
          },
        ]}
      >
        <MarkdownDescriptionEditor
          editorRef={markdownEditorRef}
          //initialValue={initialChallenge?.descriptionMarkdown}
          //inputChanged={handleMarkdownInputChanged}
        />
      </Form.Item>
    </CardSection>
  )
}
