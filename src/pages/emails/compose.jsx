import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { Button } from 'reactstrap';
import { useMutation, useQuery } from 'react-query';
import {
  createEmailTemplates,
  fetchEmailTemplates,
  getEmailFetchingOptions,
  sendEmail,
} from '../../api/index';
import { Container, Row, Col, FormGroup } from 'reactstrap';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
export default function ComposeEmail() {
  const [emailAddress, setEmailAddress] = useState({
    id: '',
    name: '',
    type: '',
  });
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
      <FlitteringOptions setEmailAddress={setEmailAddress} />
      <ComposeNewEmail subject={''} body={''} emailAddress={emailAddress} />;
    </>
  );
}

function ComposeNewEmail({ subject, body, emailAddress }) {
  const [, setEmailTemplateId] = useState('');
  const mutation = useMutation(createEmailTemplates, {
    onSuccess: (data) => {
      console.log(data.data.id);
      setEmailTemplateId(data.data.id);
      sendEmailBlast.mutate({
        email_template_id: data.data.id,
        email_filtering_options: {
          option_type: emailAddress.type,
          option_value: emailAddress.id,
          email_blast_option: 'one_time',
        },
      });
    },
  });
  const sendEmailBlast = useMutation(sendEmail, {
    onSuccess: (data) => {
      console.log(data);
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

  function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
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
                      id="EmailAddress"
                      name="Sent to Email"
                      placeholder="Email Address"
                      value={`${capitalizeFirstLetter(emailAddress.type)}:  ${
                        emailAddress.name
                      }`}
                    />
                  </FormGroup>
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
function sleep(time) {
  return new Promise((resolve) => setTimeout(resolve, time));
}
function FlitteringOptions({ setEmailAddress }) {
  const { isError, data, error, isFetching } = useQuery(
    ['getInstitutions', 'getDepartments'],
    async () => {
      await sleep(10);
      return await getEmailFetchingOptions();
    }
  );
  console.log({ asd: error });

  return (
    <div className="flex">
      <Container>
        <Row>
          <div className="flex min-w-full ">
            <div className="flex flex-col justify-start justify-items-start min-w-full">
              <div className=" text-start px-3">
                <h2 className="p">Filtering Options</h2>
                <Loading isLoading={isFetching} />
                <ErrorComponent isError={isError} />
                <FlitteringOptionsComp
                  data={data}
                  setEmailAddress={setEmailAddress}
                />
              </div>
            </div>
          </div>
        </Row>
      </Container>
    </div>
  );
}
function FlitteringOptionsComp({ data, setEmailAddress }) {
  return (
    <div className="flex flex-col min-w-full pl-4 ">
      <div className="container  w-full min-w-full ">
        <CollapseComponent title="Filter By Institutions">
          <select
            className="form-control w-full"
            id="role_id"
            // value={formik.values.role_id}
            onChange={(e) => {
              const inst = data.institutions.find(
                (item) => item.id == e.target.value
              );
              setEmailAddress({
                id: inst.id,
                name: inst.name,
                type: 'institution',
              });
            }}
            name="role_id"
          >
            {data?.institutions?.map((institution) => {
              return (
                <option key={institution.id} value={institution.id}>
                  {institution.name}
                </option>
              );
            })}
          </select>
        </CollapseComponent>
      </div>
      <div className="container  w-full min-w-full pt-2">
        <CollapseComponent title="Filter By Departments">
          <select
            className="form-control w-full"
            id="role_id"
            // value={formik.values.role_id}
            onChange={(e) => {
              const inst = data.departments.find(
                (item) => item.id == e.target.value
              );
              setEmailAddress({
                id: inst.id,
                name: inst.name,
                type: 'department',
              });
            }}
            name="role_id"
          >
            {data?.departments?.map((institution) => {
              return (
                <option key={institution.id + uuidv4()} value={institution.id}>
                  {institution.name}
                </option>
              );
            })}
          </select>
        </CollapseComponent>
      </div>
    </div>
  );
}
function Loading({ isLoading }) {
  if (isLoading) return <div>Loading...</div>;
}
function ErrorComponent({ isError }) {
  if (isError) return <div>Error Loading filtering</div>;
}

const CollapseComponent = ({ title, children }) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleCollapse = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="border rounded-lg w-2/3 ">
      <div
        className="flex items-center justify-between  cursor-pointer pl-2"
        onClick={toggleCollapse}
      >
        <h2 className="text-lg font-semibold">{title}</h2>
        <span className="text-xl">{isOpen ? '▼' : '▲'}</span>
      </div>
      {isOpen && <div className="p-4 border-t">{children}</div>}
    </div>
  );
};
