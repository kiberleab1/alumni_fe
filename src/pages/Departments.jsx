import { useQuery } from 'react-query';
import { getDepartments } from '../api';

import { Container, Row, Col, Table } from 'reactstrap';

export default function DepartmentPage() {
  const { isError, data, error, isFetching } = useQuery(
    'getDepartments',
    async () => {
      return await getDepartments({ pageNumber: 0, pageSize: 10 });
    }
  );

  console.log(data);
  if (isFetching) return <div>Loading...</div>;
  if (isError) return <div>Error: {error.message}</div>;
  return (
    <>
      <div>
        <ListDepartment departments={data.data.department} />
      </div>
    </>
  );
}

// eslint-disable-next-line react/prop-types

// eslint-disable-next-line react/prop-types
function ListDepartment({ departments }) {
  return (
    <div>
      <div className="spacer" id="table-component">
        <Container>
          <Row className="justify-content-center">
            <Col md="7" className="text-center">
              <h1 className="title font-bold">List of Departments</h1>
              <h6 className="subtitle">
                Here is list of departments you have accesses too.
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
                    <th>Department Name</th>
                    <th>Description</th>
                    <th>Contact Info</th>
                    <th>Created Date</th>
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
                          <td>{department.createdAt}</td>

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
