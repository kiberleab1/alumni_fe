import { useQuery, useQueryClient, useMutation } from 'react-query';
import { createInstitute, getInstitutes } from '../api';

import {
  Container,
  Row,
  Col,
  FormGroup,
  Label,
  Button,
  Table,
} from 'reactstrap';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import DatePicker from 'react-datepicker'; //
import 'react-datepicker/dist/react-datepicker.css'; // Import the styles Import react-datepicker

export default function InstitutionsPage() {
  const { isError, data, error, isFetching } = useQuery(
    'getInstitutions',
    async () => {
      return await getInstitutes({ pageNumber: 0, pageSize: 10 });
    }
  );

  console.log(data);
  if (isFetching) return <div>Loading...</div>;
  if (isError) return <div>Error: {error.message}</div>;
  return (
    <>
      <div>
        <ListInstitutions departments={data.data.institute} />
        <CreateInstitutionForm />
      </div>
    </>
  );
}

// eslint-disable-next-line react/prop-types
const CreateInstitutionForm = () => {
  const queryClient = useQueryClient();
  const mutation = useMutation(createInstitute, {
    onSuccess: () => {
      queryClient.invalidateQueries('getInstitutions');
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
              <h1 className="title font-bold">Create Institute</h1>
              <h6 className="subtitle">
                Fill the form below to create a new institute.
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
                name: '',
                description: '',
                contactInfo: '',
                address_id: '',
                starting_year: null,
              }}
              validationSchema={Yup.object({
                name: Yup.string().required('Required'),
                description: Yup.string().required('Required'),
                contactInfo: Yup.string().required('Required'),
                address_id: Yup.string().required('Required'),
                starting_year: Yup.date().required('Required'),
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
                  <FormGroup className="col-md-6">
                    <Label htmlFor="startingYear">Starting Year</Label>
                    <br />
                    <DatePicker
                      id="starting_year"
                      name="starting_year"
                      selected={formik.values.starting_year}
                      onChange={(date) =>
                        formik.setFieldValue('starting_year', date)
                      }
                      className="form-control" // Set class to style the date picker
                      placeholderText="Select Starting Year" // Placeholder text
                    />
                    <ErrorMessage
                      name="startingYear"
                      component="div"
                      className="error"
                    />
                  </FormGroup>
                  <FormGroup className="col-md-6">
                    <Label htmlFor="address_id">Address Id</Label>
                    <Field
                      as="select" // Use "select" instead of "textarea"
                      className="form-control"
                      id="address_id"
                      name="address_id"
                    >
                      <option value="">Select an address</option>
                      <option value="1">Address 1</option>
                      <option value="2">Address 2</option>
                      {/* Add more options as needed */}
                    </Field>
                    <ErrorMessage
                      name="address_id"
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

// eslint-disable-next-line react/prop-types
function ListInstitutions({ departments }) {
  return (
    <div>
      <div className="spacer" id="table-component">
        <Container>
          <Row className="justify-content-center">
            <Col md="7" className="text-center">
              <h1 className="title font-bold">List of Institutions</h1>
              <h6 className="subtitle">
                Here is list of institutions you have accesses too.
              </h6>
            </Col>
          </Row>
        </Container>
      </div>
      <Container>
        <Row>
          <Col md="12">
            <div className="table-responsive">
              <Table>
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Institution Name</th>
                    <th>Description</th>
                    <th>Contact Info</th>
                    <th>Starting Year</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {
                    // eslint-disable-next-line react/prop-types
                    departments.map((department, index) => {
                      return (
                        <tr key={department.id}>
                          <td>{index + 1}</td>
                          <td>{department.name}</td>
                          <td className="truncate ...">
                            {department.description}
                          </td>
                          <td className="truncate ...">
                            {department.contact_info}
                          </td>
                          <td>{department.starting_year}</td>

                          <td>
                            <span
                              className="label label-danger"
                              onClick={() => {
                                console.log('get here');
                              }}
                            >
                              admin
                            </span>{' '}
                            <span className="label label-warning text-red-500">
                              admin
                            </span>{' '}
                          </td>
                        </tr>
                      );
                    })
                  }
                </tbody>
              </Table>
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  );
}
