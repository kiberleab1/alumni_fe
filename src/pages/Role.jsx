import { useQuery, useQueryClient, useMutation } from 'react-query';
import { getRoles, createNewRole } from '../api';

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

export default function RolePage() {
  const { isError, data, error, isFetching } = useQuery(
    'getRoles',
    async () => {
      return await getRoles({ pageNumber: 0, pageSize: 10 });
    }
  );

  console.log(data);
  if (isFetching) return <div>Loading...</div>;
  if (isError) return <div>Error: {error.message}</div>;
  return (
    <>
      <div>
        <ListRole roles={data.data.role} />
        <CreateRoleForm />
      </div>
    </>
  );
}

// eslint-disable-next-line react/prop-types
const CreateRoleForm = () => {
  const queryClient = useQueryClient();
  const mutation = useMutation(createNewRole, {
    onSuccess: () => {
      queryClient.invalidateQueries('getRoles');
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
              <h1 className="title font-bold">Create Role</h1>
              <h6 className="subtitle">
                Fill the form below to create a new role.
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
                role_name: ''
              }}
              validationSchema={Yup.object({
                role_name: Yup.string().required('Required')
              })}
              onSubmit={handleSubmit}
            >
              {(formik) => (
                <Form className="row justify-center">
                  <FormGroup className="col-md-9">
                    <Label htmlFor="role_name">Role Name</Label>
                    <Field
                      type="text"
                      className="form-control"
                      id="role_name"
                      name="role_name"
                      placeholder="Enter Role Name"
                    />
                    <ErrorMessage
                      name="role_name"
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
function ListRole({ roles }) {
  return (
    <div>
      <div className="spacer" id="table-component">
        <Container>
          <Row className="justify-content-center">
            <Col md="7" className="text-center">
              <h1 className="title font-bold">List of Roles</h1>
              <h6 className="subtitle">
                Here is list of roles you have accesses too.
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
                    <th>Role Name</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {
                    // eslint-disable-next-line react/prop-types
                    roles.map((role, index) => {
                      return (
                        <tr key={role.id}>
                          <td>{index + 1}</td>
                          <td>{role.role_name}</td>
                          <td>{role.createdAt}</td>

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
