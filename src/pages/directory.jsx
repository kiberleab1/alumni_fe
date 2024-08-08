import { Container, Row, Table } from "reactstrap";
import { InputGroup, Input, Button } from "reactstrap";
import Paginations from "../components/pagination/pagination";
const Directory = () => {
  const data = [
    {
      name: "Abebe Kebede",
      diploma: "Bachelor's Degree",
      graduationDate: "2023-05-15",
      location: "Addis Ababa",
      department: "Engineering",
    },
    {
      name: "Meron Tadesse",
      diploma: "Master's Degree",
      graduationDate: "2022-12-31",
      location: "Hawassa",
      department: "Medicine",
    },
    {
      name: "Yohannes Mulugeta",
      diploma: "Associate's Degree",
      graduationDate: "2024-02-28",
      location: "Bahir Dar",
      department: "Business",
    },
    {
      name: "Senait Berhe",
      diploma: "Bachelor's Degree",
      graduationDate: "2023-08-20",
      location: "Gondar",
      department: "Nursing",
    },
    {
      name: "Dawit Tsegaye",
      diploma: "Master's Degree",
      graduationDate: "2022-11-15",
      location: "Dire Dawa",
      department: "Education",
    },
    {
      name: "Hanna Solomon",
      diploma: "Bachelor's Degree",
      graduationDate: "2023-06-10",
      location: "Mekele",
      department: "Social Sciences",
    },
    {
      name: "Girma Abate",
      diploma: "Bachelor's Degree",
      graduationDate: "2023-04-25",
      location: "Jimma",
      department: "Agriculture",
    },
    {
      name: "Birtukan Alemu",
      diploma: "Master's Degree",
      graduationDate: "2022-12-01",
      location: "Adama",
      department: "Law",
    },
    {
      name: "Ali Mohammed",
      diploma: "Associate's Degree",
      graduationDate: "2024-01-10",
      location: "Awasa",
      department: "Information Technology",
    },
    {
      name: "Zewdu Bekele",
      diploma: "Bachelor's Degree",
      graduationDate: "2023-07-05",
      location: "Debre Markos",
      department: "Finance",
    },
    {
      name: "Tigist Alemu",
      diploma: "Master's Degree",
      graduationDate: "2022-09-30",
      location: "Axum",
      department: "Archaeology",
    },
    {
      name: "Muluken Gebre",
      diploma: "Bachelor's Degree",
      graduationDate: "2023-11-20",
      location: "Lalibela",
      department: "Tourism Management",
    },
    {
      name: "Tadesse Gebremedhin",
      diploma: "Associate's Degree",
      graduationDate: "2024-06-15",
      location: "Arba Minch",
      department: "Environmental Science",
    },
    //   {
    //     name: "Genet Mekonnen",
    //     diploma: "Master's Degree",
    //     graduationDate: "2022-12-31",
    //     location: "Bahirdar",
    //     department: "Psychology",
    //   },
    //   {
    //     name: "Alemayehu Tekle",
    //     diploma: "Bachelor's Degree",
    //     graduationDate: "2023-05-10",
    //     location: "Gambela",
    //     department: "Forestry",
    //   },
    //   {
    //     name: "Meseret Haile",
    //     diploma: "Master's Degree",
    //     graduationDate: "2022-11-30",
    //     location: "Harar",
    //     department: "Linguistics",
    //   },
    //   {
    //     name: "Dawit Solomon",
    //     diploma: "Bachelor's Degree",
    //     graduationDate: "2023-08-15",
    //     location: "Jijiga",
    //     department: "Political Science",
    //   },
    //   {
    //     name: "Genene Wondimu",
    //     diploma: "Associate's Degree",
    //     graduationDate: "2024-03-20",
    //     location: "Nekemte",
    //     department: "Journalism",
    //   },
    //   {
    //     name: "Teshome Ayalew",
    //     diploma: "Bachelor's Degree",
    //     graduationDate: "2023-06-25",
    //     location: "Semera",
    //     department: "Public Health",
    //   },
    //   {
    //     name: "Bisrat Lemma",
    //     diploma: "Master's Degree",
    //     graduationDate: "2022-10-15",
    //     location: "Shashamane",
    //     department: "Sociology",
    //   },
  ];
  return (
    <div>
      <Container>
        <Row className="justify-end py-4">
          <InputGroup className="w-1/3 ">
            <Input placeholder="Keywords (e.g name, department, city)" />
            <Button color="primary">Search</Button>
          </InputGroup>
        </Row>
        <Row>
          <div className="table-responsive pt-2">
            <Table>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Diploma</th>
                  <th>Graduation Date</th>
                  <th>Location</th>
                  <th>Department</th>
                </tr>
              </thead>
              <tbody>
                {data.map((item) => (
                  <tr key={item.name}>
                    <td>{item.name}</td>
                    <td>{item.diploma}</td>
                    <td>{item.graduationDate}</td>
                    <td>{item.location}</td>
                    <td>{item.department}</td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>
        </Row>
        <Row className="">
          <Paginations />
        </Row>
      </Container>
    </div>
  );
};

export default Directory;
