import request from "supertest";
import dotenv from "dotenv";
import app from "../server/app.js";
import {connectDBTest} from "../server/config/database.js";

// describe("Users API", () => {
//   beforeAll(async () => {
//     dotenv.config();
//     await connectDBTest();
//   });

//   it("GET /users --> array of users", () => {
//     return request(app)
//       .get("/users")
//       .set("Authorization", `Bearer ${process.env.TEST_TOKEN}`)
//       .expect("Content-Type", /json/)
//       .expect(200)
//       .then((res) => {
//         expect(res.body).toEqual(
//           expect.objectContaining({
//             data: expect.arrayContaining([
//               expect.objectContaining({
//                 _id: expect.any(String), // MongoDB usa _id como string
//                 name: expect.any(String),
//                 email: expect.any(String),
//                 // Campos adicionais podem ser ignorados
//                 createdAt: expect.any(String),
//                 updatedAt: expect.any(String),
//                 __v: expect.any(Number),
//                 password: expect.any(String),
//               }),
//             ]),
//             metadata: expect.objectContaining({
//               totalCount: expect.any(Number),
//             }),
//           })
//         );
//       });
//   });
//   //save user id to next requests
//   describe("GET /users", () => {

//       beforeAll((
//         async () => {
//           await request(app)
//             .post("/users")
//             .send({
//               name: "John Doe",
//               email: "2M4iI@example.com",
//             })
//             .set("Authorization", `Bearer ${process.env.TEST_TOKEN}`)
//             .expect(201);
//         }
//       ))
//   });

//   it("GET /users/id --> specific user by ID", () => {
//     return request(app)
//       .get("/users/1")
//       .set("Authorization", `Bearer ${process.env.TEST_TOKEN}`)
//       .expect("Content-Type", /json/)
//       .expect(200)
//       .then((res) => {
//         expect(res.body).toEqual(
//           expect.objectContaining({
//             id: expect.any(Number),
//             name: expect.any(String),
//             email: expect.any(String),
//           })
//         );
//       });
//   });

//   it("GET /users/id --> 404 if not found", () => {
//     return request(app).get("/users/0").set("Authorization", `Bearer ${process.env.TEST_TOKEN}`).expect(404);
//   });

//   it("POST /users --> create user", () => {
//     return request(app)
//       .post("/users")
//       .send({
//         name: "John Doe",
//         email: "2M4iI@example.com",
//       })
//       .set("Authorization", `Bearer ${process.env.TEST_TOKEN}`)
//       .expect(201)
//       .then((res) => {
//         expect(res.body).toEqual(
//           expect.objectContaining({
//             id: expect.any(Number),
//             name: "John Doe",
//             email: "2M4iI@example.com",
//           })
//         );
//       });
//   });

//   it("POST /users --> validates request body", () => {
//     return request(app)
//       .post("/users")
//       .send({
//         name: 123,
//       })
//       .set("Authorization", `Bearer ${process.env.TEST_TOKEN}`)
//       .expect(422);
//   });

//   it("PUT /users --> update user", () => {
//     return request(app)
//       .put("/users/1")
//       .send({
//         name: "John Doe 2",
//       })
//       .set("Authorization", `Bearer ${process.env.TEST_TOKEN}`)
//       .expect(200)
//       .then((res) => {
//         expect(res.body).toEqual(
//           expect.objectContaining({
//             id: expect.any(Number),
//             name: "John Doe 2",
//             email: expect.any(String),
//           })
//         );
//       });
//   });
// });
