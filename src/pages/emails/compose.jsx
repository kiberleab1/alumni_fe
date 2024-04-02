import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { Button } from 'reactstrap';
import { useMutation, useQuery } from 'react-query';
import { createEmailTemplates, fetchEmailTemplates } from '../../api/index';
import { Container, Row, Col, FormGroup } from 'reactstrap';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';

export default function ComposeEmail() {
  const { isError, data, error, isFetching } = useQuery(
    'getEmailTemplates',
    async () => {
      return await fetchEmailTemplates({ pageNumber: 1, pageSize: 10 });
    }
  );
  console.log(data);
  if (isFetching) return <div>Loading...</div>;
  if (isError) return <div>Error: {error.message}</div>;
  return (
    <>
      <ComposeNewEmail subject={''} body={''} />;
    </>
  );
}
function ComposeNewEmail({ subject, body }) {
  const mutation = useMutation(createEmailTemplates, {
    onSuccess: (data) => {
      console.log('Email template created:', data);
    },
  });

  const modules = {
    toolbar: [
      [{ header: [1, 2, false] }],
      ['bold', 'italic', 'underline', 'strike', 'blockquote'],
      [
        { list: 'ordered' },
        { list: 'bullet' },
        { indent: '-1' },
        { indent: '+1' },
      ],
      ['link', 'image'],
      ['clean'],
    ],
  };
  async function doSaveEmailTemplate({ subject, body }) {
    mutation.mutate({ header: subject, body: body });
  }

  const handleSaveButton = (value) => {
    console.log(value);
    doSaveEmailTemplate(value);
  };

  return (
    <div className="min-h-96 mt-24 ">
      <style>
        {`
          .ql-editor {
            min-height: 24rem; /* Adjust the minHeight as needed */
          }
          `}
      </style>
      <Container>
        <Row>
          <Col md="12">
            <Formik
              initialValues={{
                subject: subject,
                body: body,
              }}
              validationSchema={Yup.object({
                subject: Yup.string().required('Required'),
                body: Yup.string().required('Required'),
              })}
              onSubmit={handleSaveButton}
            >
              {(formik) => (
                <Form className="row justify-center">
                  <FormGroup className="col-md-12">
                    <Field
                      type="text"
                      className="form-control"
                      id="subject"
                      name="subject"
                      placeholder="Subject"
                    />
                  </FormGroup>

                  <FormGroup>
                    <Field id="body" name="body">
                      {({ field }) => (
                        <ReactQuill
                          theme="snow"
                          value={field.value}
                          onChange={field.onChange(field.name)}
                          className="h-full min-h-96"
                          modules={modules}
                          placeholder="Compose Your Email Here"
                          // formats={formats}
                          // preserveWhitespace={true}
                          // scrollingContainer={true}
                        />
                      )}
                    </Field>
                  </FormGroup>

                  <Col md="12" className="mt-12">
                    <Button
                      type="submit"
                      className="btn btn-success waves-effect waves-light m-r-10"
                      // disabled={formik.isSubmitting}
                    >
                      Submit
                    </Button>
                    <Button
                      type="button"
                      className="btn btn-inverse waves-effect waves-light"
                      onClick={formik.handleReset}
                    >
                      Reset
                    </Button>
                  </Col>
                </Form>
              )}
            </Formik>
          </Col>
        </Row>
      </Container>
    </div>
  );
}
