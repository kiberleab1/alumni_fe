import { useQueryClient, useMutation } from "react-query";
import { createDepartment } from "src/api";

import { Container, Row, Col, FormGroup, Label, Button } from "reactstrap";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";

export default function HomePageContent() {
  // Change page

  return (
    <div className="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
      <CreateHomePage />
    </div>
  );
}
const CreateHomePage = () => {
  const queryClient = useQueryClient();
  const mutation = useMutation(createDepartment, {
    onSuccess: () => {
      queryClient.invalidateQueries("getDepartments");
    },
  });
  const handleSubmit = (values) => {
    console.log({ values });
    mutation.mutate(values);
  };
  return (
    <div>
      <div className="spacer" id="forms-component">
        <Container>
          <Row className="justify-content-center">
            <Col md="7" className="text-center">
              <h1 className="title font-bold">Create Homepage</h1>
              <h6 className="subtitle">
                Fill the form below to create a new department.
              </h6>
            </Col>
          </Row>
        </Container>
      </div>
      <Container>
        <Row>
          <Col md="12">
            <Formik
              initialValues={{
                name: "",
                description: "",
                contactInfo: "",
              }}
              validationSchema={Yup.object({
                name: Yup.string().required("Required"),
                description: Yup.string().required("Required"),
                contactInfo: Yup.string().required("Required"),
              })}
              onSubmit={handleSubmit}
            >
              {(formik) => (
                <Form className="row justify-center">
                  <FormGroup className="col-md-9">
                    <Label htmlFor="name">Name</Label>
                    <Field
                      type="text"
                      className="form-control"
                      id="name"
                      name="name"
                      placeholder="Enter Departments Name"
                    />
                    <ErrorMessage
                      name="name"
                      component="div"
                      className="error"
                    />
                  </FormGroup>
                  <FormGroup className="col-md-9">
                    <Label htmlFor="description">Description</Label>
                    <Field
                      type="textarea"
                      className="form-control"
                      id="description"
                      name="description"
                      placeholder="Description"
                    />
                    <ErrorMessage
                      name="description"
                      component="div"
                      className="error"
                    />
                  </FormGroup>
                  <FormGroup className="col-md-9">
                    <Label htmlFor="contactInfo">Contact Info</Label>
                    <Field
                      type="textarea"
                      className="form-control"
                      id="contactInfo"
                      name="contactInfo"
                      placeholder="Department ContactInfo"
                    />
                    <ErrorMessage
                      name="contactInfo"
                      component="div"
                      className="error"
                    />
                  </FormGroup>
                  <Col md="12">
                    <Button
                      type="submit"
                      className="btn btn-success waves-effect waves-light m-r-10"
                      disabled={formik.isSubmitting}
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
};
