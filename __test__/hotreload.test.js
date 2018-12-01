//import hotreload from "../lib/hotreload";

function errorFn() {
  throw new SyntaxError("wow");
}
test('this is should be an error', () => {
  expect(errorFn).toThrow("wow");
});


// test validate in insertjs() 



// test validate scripts in reloadjs()


// test browser 


// const serverForTest = http.createServer((req, res) => res.end());
// const messageForTest = {
//   reload: "reloadTest",
//   disconnect: "disconnectTest"
// }
// const portTest = 5000;

// const optionsForTest = {
//   server: serverForTest,
//   socketio: socketioTest,
//   port: portTest,
//   message: messageForTest
// };


// describe("test server", () => {
//   test("test options server", () => {

//   })
// });

// test("test whether server get started", () => {

// });

// 

// const onPress = jest.fn();
// expect(onPress).toBeCalledWith(
//     expect.objectContaining({
//       x: expect.any(Number),
//       y: expect.any(Number),
//     }),
//   );