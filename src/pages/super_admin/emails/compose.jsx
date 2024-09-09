import { Field, Form, Formik } from "formik";
import { useState } from "react";
import { useMutation, useQuery } from "react-query";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { Button, Col, Container, FormGroup, Row } from "reactstrap";
import {
  createEmailTemplates,
  fetchEmailTemplates,
  getEmailFetchingOptions,
  sendEmail,
} from "src/api/index";
import QueryResult from "src/components/utils/queryResults";
import { v4 as uuidv4 } from "uuid";
import * as Yup from "yup";

export default function ComposeEmail() {
  const [emailAddress, setEmailAddress] = useState({
    id: "",
    name: "",
    type: "",
  });

  const { isError, data, isLoading } = useQuery(
    "getEmailTemplates",
    async () => {
      return await fetchEmailTemplates({ pageNumber: 1, pageSize: 10 });
    }
  );

  return (
    <QueryResult isLoading={isLoading} isError={isError} data={data}>
      <FlitteringOptions setEmailAddress={setEmailAddress} />
      <ComposeNewEmail
        subject={""}
        body={""}
        emailAddress={emailAddress}
        setEmailAddress={setEmailAddress}
      />
    </QueryResult>
  );
}

function ComposeNewEmail({ subject, body, emailAddress, setEmailAddress }) {
  const [, setEmailTemplateId] = useState("");
  const mutation = useMutation(createEmailTemplates, {
    onSuccess: (data) => {
      console.log(data);
      setEmailTemplateId(data.data.id);
      sendEmailBlast.mutate({
        email_template_id: data.data.id,
        email_filtering_options: {
          option_type: emailAddress.type || "institution",
          option_value: emailAddress.id || "default",
          email_blast_option: "one_time",
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
      ["bold", "italic", "underline", "strike", "blockquote"],
      [
        { list: "ordered" },
        { list: "bullet" },
        { indent: "-1" },
        { indent: "+1" },
      ],
      ["link", "image"],
      ["clean"],
    ],
  };

  async function doSaveEmailTemplate({ subject, body }) {
    mutation.mutate({ header: subject, body: body });
  }

  const emailValidationSchema = Yup.string()
    .required("Email addresses are required")
    .test(
      "valid-emails",
      "All inputs must be valid email addresses",
      (value) => {
        if (!value) return false;

        const emails = value.split(",").map((email) => email.trim());

        return emails.every((email) => Yup.string().email().isValidSync(email));
      }
    );
  function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

  const handleSaveButton = (value, { resetForm }) => {
    value.emailAddress = Array.isArray(value.emailAddress)
      ? value.emailAddress
      : [value.emailAddress];

    console.log(value);
    doSaveEmailTemplate(value);
    resetForm();
    setEmailAddress({ id: "", name: "", type: "" });
  };

  const initialValues = {
    subject: "",
    body: "",
    emailAddress: "",
  };

  return (
    <div className="min-h-96 mt-24 ">
      <style>
        {`
          .ql-editor {
            min-height: 24rem;
          }
        `}
      </style>
      <Container>
        <Row>
          <Col md="12">
            <Formik
              initialValues={initialValues}
              validationSchema={Yup.object({
                subject: Yup.string().required("Required"),
                body: Yup.string().required("Required"),
                emailAddress: emailValidationSchema,
              })}
              onSubmit={handleSaveButton}
            >
              {({ handleSubmit, handleReset, values, handleChange }) => (
                <Form className="row justify-center" onSubmit={handleSubmit}>
                  <FormGroup className="col-md-12">
                    <label htmlFor="EmailAddress " className="block">
                      {capitalizeFirstLetter(emailAddress.type)}:
                    </label>
                    <Field
                      type="text"
                      className="form-control"
                      id="EmailAddress"
                      name="emailAddress"
                      placeholder="Email Address"
                      value={`${emailAddress.name}`}
                      onChange={(e) => {
                        handleChange(e);
                        setEmailAddress({
                          ...emailAddress,
                          name: e.target.value,
                        });
                      }}
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
                        />
                      )}
                    </Field>
                  </FormGroup>

                  <Col md="12" className="mt-12">
                    <Button
                      type="submit"
                      className="btn btn-success waves-effect waves-light m-r-10"
                    >
                      Submit
                    </Button>
                    <Button
                      type="button"
                      className="btn btn-inverse waves-effect waves-light"
                      onClick={handleReset}
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

function FlitteringOptions({ setEmailAddress }) {
  const { isError, data, isFetching } = useQuery(
    ["getInstitutions", "getDepartments"],
    async () => {
      return await getEmailFetchingOptions();
    }
  );

  return (
    <div className="flex">
      <Container>
        <Row>
          <div className="flex min-w-full ">
            <div className="flex flex-col justify-start justify-items-start min-w-full">
              <div className="text-start px-3">
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
      <div className="container w-full min-w-full ">
        <CollapseComponent title="Filter By Institutions">
          <select
            className="form-control w-full"
            id="role_id"
            onChange={(e) => {
              const inst = data.institutions.find(
                (item) => item.id === e.target.value
              );
              setEmailAddress({
                id: inst.id,
                name: inst.name,
                type: "institution",
              });
            }}
            name="role_id"
          >
            {data?.institutions?.map((institution) => (
              <option key={institution.id} value={institution.id}>
                {institution.name}
              </option>
            ))}
          </select>
        </CollapseComponent>
      </div>

      <div className="container w-full min-w-full pt-2">
        <CollapseComponent title="Filter By Departments">
          <select
            className="form-control w-full"
            id="role_id"
            onChange={(e) => {
              const inst = data.departments.find(
                (item) => item.id === e.target.value
              );
              setEmailAddress({
                id: inst.id,
                name: inst.name,
                type: "department",
              });
            }}
            name="role_id"
          >
            {data?.departments?.map((department) => (
              <option key={department.id + uuidv4()} value={department.id}>
                {department.name}
              </option>
            ))}
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
    <div className="border rounded-lg w-2/3">
      <div
        className="flex items-center justify-between cursor-pointer pl-2"
        onClick={toggleCollapse}
      >
        <h2 className="text-lg font-semibold">{title}</h2>
        <span className="text-xl">{isOpen ? "▼" : "▲"}</span>
      </div>
      {isOpen && <div className="p-4 border-t">{children}</div>}
    </div>
  );
};
