import {useQuery, useQueryClient, useMutation } from 'react-query';
import { login } from '../api';
import { Container, Row, Col, FormGroup, Label, Button } from 'reactstrap';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import propTypes from 'prop-types';



export default function LoginPage() {
    const {data:ip_address, isError, error, isFetching } = useQuery(
        'ip_address',
        async () => {
            const response = await fetch('https://api.ipify.org?format=json');
            const data = await response.json();
            return data.ip;
        }
    );
   
    // console.log("login data ",data);
    if (isFetching) return <div>Loading...</div>;
    if (isError) return <div>Error: {error.message}</div>;
    return (
        <>
            <div>
                <LoginForm ip_address={ip_address} />
            </div>
        </>
    );
}


const LoginForm = ({ip_address}) => {
    const queryClient = useQueryClient();
    const mutation = useMutation(login, {
        onSuccess: () => {
            queryClient.invalidateQueries('login');
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
                            <h1 className="title font-bold">Login</h1>
                            <h6 className="subtitle">
                                Fill the form below to login.
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
                                email: '',
                                password: '',
                                ip_address: ip_address || '' }}
                            validationSchema={Yup.object({
                                email: Yup.string().required('Required'),
                                password: Yup.string().required('Required')
                                // ip_address: Yup.string().required('Required'),
                            })} 
                            onSubmit={handleSubmit}>
                {(formik) => (
                    <Form>
                        <FormGroup>
                            <Label for="email">Email</Label>
                            <Field name="email" type="email" className="form-control" />
                            <ErrorMessage name="email" component="div" className="error" />
                        </FormGroup>
                        <FormGroup>
                            <Label for="password">Password</Label>
                            <Field name="password" type="password" className="form-control" />
                            <ErrorMessage name="password" component="div" className="error" />
                        </FormGroup>
                        <Col md="12">
                            <Button type="submit" color="primary" className="mr-1" disabled={formik.isSubmitting} onClick={formik.handleSubmit}>Login</Button>
                            <Button type="reset" color="secondary">Reset</Button>
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

                LoginForm.propTypes = {
                    ip_address: propTypes.string.isRequired,
                };
