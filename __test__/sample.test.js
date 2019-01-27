
// function errorFn() {
//   throw new SyntaxError("wow");
// }
// test THROW error
// test('this is should be an error', () => {
//   expect(errorFn).toThrow("wow");
// });

// test assigned object
// test('object assignment', () => {
//   const realData = { one: 100 };
//   realData['two'] = 100;
//   let expectedData = { one: 100, two: 100 };
//   expect(realData).toEqual(expectedData);
// });

// test string or fileName
// test('there is no I in team', () => {
//   expect('team').not.toMatch(/I/);
// });

// test('zero', () => {
//   const z = 0;
//   expect(z).not.toBeNull();
//   expect(z).toBeDefined();
//   expect(z).not.toBeUndefined();
//   expect(z).not.toBeTruthy();
//   expect(z).toBeFalsy();
// });