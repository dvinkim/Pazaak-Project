var unit = require('../jasminetest');
describe("Unit Testing test",function(){
	it("meep should be true",function(){
		expect(unit.test('meep')).toBe(true);
	});
});
