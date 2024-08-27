// sample data format
// const data = {
//   user: {
//     id: "74ca10f4-b174-41c1-807e-a0fbdccb4fee",
//     email: "admin@admin.com",
//     first_name: "Blake",
//     middle_name: "Neve Wheeler",
//     last_name: "Valencia",
//     phone_number: "+1 (819) 815-1546",
//     password: "$2a$10$AcUoV7FXbUNouOCrfcnVO.4sD7ivfi3SjFX.v69UR26kAopdKC/Bm",
//     gender: "password",
//     date_of_birth: "1985-11-15T00:00:00.000Z",
//     role_id: "21b5db26-d630-45b3-b6b8-97d01e032896",
//     address_id: "cc9613ca-18e0-476b-9020-f8308cb82d4b",
//     birth_place_id: "f14fa223-4d07-4150-b72f-1f26e43db1b1",
//     institute_id: "40e9772b-05c3-4ef1-8ebc-d3ef30710e23",
//     createdAt: "2024-08-15T22:01:10.162Z",
//     updatedAt: "2024-08-15T22:01:10.162Z",
//   },
//   token:
//     "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI3NGNhMTBmNC1iMTc0LTQxYzEtODA3ZS1hMGZiZGNjYjRmZWUiLCJpYXQiOjE3MjM3NTkzMjksImV4cCI6MTcyMzg0NTcyOX0.GtCwW8HGjTeERABCVZSbBqdkhmzMtapbiZmAh4cR5kM",
// };

export function getUserToken() {
  const storedData = localStorage.getItem("userData");
  if (!storedData) {
    return;
  }
  const parsedData = JSON.parse(storedData);
  return parsedData;
}

export function storeUserToken(data) {
  const jsonData = JSON.stringify(data);

  // Store it in localStorage
  localStorage.setItem("userData", jsonData);
  return data;
}

export function deleteUserToken() {
  localStorage.removeItem("userData");
}
