import { ErrorMessage, Field, Formik } from "formik";
import { useQueryClient } from "react-query";
import { useMutation } from "react-query";

import {
  Button,
  Col,
  Container,
  Form,
  FormGroup,
  Label,
  Row,
} from "reactstrap";
import { createWebContent } from "src/api";
import * as Yup from "yup";

function CreateVisionContent() {
  return (
    <>
      <CreateWebContentForm />
    </>
  );
}

export default CreateVisionContent;

function CreateWebContentForm() {
  const queryClient = useQueryClient();

  const mutation = useMutation(createWebContent, {
    onSuccess: () => {
      queryClient.invalidateQueries("getAllVisionComponent");
    },
    onError: (err) => {
      console.log({ err });
      queryClient.invalidateQueries("getAllVisionComponent");
    },
  });
  // const typesOfContent = [{ name: "about us" }, { name: "gallery" }];
  const initialValues = {
    // chooseInput: "",
    title: "",
    description: "",
    images: [], // New field for multiple image
  };

  const validationSchema = Yup.object({
    // chooseInput: Yup.string().required("Required"),
    title: Yup.string().required("Required"),
    description: Yup.string().required("Required"),
    images: Yup.array(),
    // .min(1, "Please select at least one image")
    // .required("Required"),
  });
  const handleSubmit = (values) => {
    mutation.mutate({
      component: "Vision",
      title: values.title,
      description: values.description,
      images: values.images,
    });

    // Perform form subVision actions here
  };
  return (
    <div>
      <div className="spacer" id="forms-component">
        <Container>
          <Row className="justify-content-center">
            <Col md="7" className="text-center">
              <h1 className="title font-bold">Vision Page</h1>
              <h6 className="subtitle">
                Here you can check Demos we created based on WrapKit. Its quite
                easy to Create your own dream website &amp; dashboard in
                No-time.
              </h6>
            </Col>
          </Row>
        </Container>
      </div>
      <Container>
        <Row>
          <Col md="12">
            <Formik
              initialValues={initialValues}
              validationSchema={validationSchema}
              onSubmit={handleSubmit}
            >
              {({ handleSubmit }) => (
                <Form className="row" onSubmit={handleSubmit}>
                  {/* <FormGroup className="md-12">
                    <Label htmlFor="chooseInput">Choose Page</Label>
                    <Field
                      as="select"
                      name="chooseInput"
                      className="form-control"
                      id="chooseInput"
                    >
                      {typesOfContent.map((type) => (
                        <option key={type.name} value={type.name}>
                          {type.name.toUpperCase()}
                        </option>
                      ))}
                    </Field>
                    <ErrorMessage
                      name="chooseInput"
                      component="div"
                      className="text-danger"
                    />
                  </FormGroup> */}

                  <FormGroup className="col-md-12">
                    <Label htmlFor="name">Title</Label>
                    <Field
                      component="textarea"
                      name="title"
                      className="form-control"
                      id="title"
                      placeholder="Enter  title"
                    />
                    <ErrorMessage
                      name="title"
                      component="div"
                      className="text-danger"
                    />
                  </FormGroup>

                  <FormGroup className="col-md-12">
                    <Label htmlFor="email">Enter Details</Label>
                    <Field
                      component="textarea"
                      name="description"
                      rows="4"
                      className="form-control"
                      id="description"
                      placeholder="Enter description"
                    />
                    <ErrorMessage
                      name="description"
                      component="div"
                      className="text-danger"
                    />
                  </FormGroup>
                  {/* <FormGroup className="col-md-12">
                    <Label htmlFor="images">Select Multiple Images</Label>
                    <br />
                    <input
                      id="images"
                      name="images"
                      type="file"
                      className="form-control-file"
                      multiple
                      onChange={(event) => {
                        const filesArray = Array.from(event.target.files);
                        console.log(filesArray);
                        // Convert FileList to Array
                        setFieldValue("images", filesArray);
                      }}
                      // onBlur={handleChange}
                      // Note: onBlur event handler is recommended for file inputs in Formik to trigger validation
                    />
                    <ErrorMessage
                      name="images"
                      component="div"
                      className="text-danger"
                    />
                  </FormGroup> */}
                  <Col md="12">
                    <Button
                      type="submit"
                      className="btn btn-success waves-effect waves-light m-r-10"
                    >
                      Submit
                    </Button>
                    <Button
                      type="reset"
                      className="btn btn-inverse waves-effect waves-light"
                    >
                      Cancel
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
