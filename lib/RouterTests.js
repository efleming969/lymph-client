import * as Router from "./Router";
describe("router", function () {
    test("match a static route", function () {
        var result = Router.match("/parent/child", {
            "/parent/child": function () { return "found"; }
        });
        expect(result).toEqual("found");
    });
    test("match route with param", function () {
        var result = Router.match("/parent/child", {
            "/parent/:name": function (params) { return "found " + params.name; }
        });
        expect(result).toEqual("found child");
    });
    test("match route with 2 params", function () {
        var result = Router.match("/parent/child/grandchild", {
            "/parent/:name/:id": function (p) { return "found " + p.name + " & " + p.id; }
        });
        expect(result).toEqual("found child & grandchild");
    });
    test("match default route", function () {
        var result = Router.match("/parent/unknown", {
            "/parent/child": function () { return "should not find this"; },
            "*": function () { return "found"; }
        });
        expect(result).toEqual("found");
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiUm91dGVyVGVzdHMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi9zcmMvUm91dGVyVGVzdHMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxLQUFLLE1BQU0sTUFBTSxVQUFVLENBQUE7QUFFbEMsUUFBUSxDQUFFLFFBQVEsRUFBRTtJQUVoQixJQUFJLENBQUUsc0JBQXNCLEVBQUU7UUFDMUIsSUFBTSxNQUFNLEdBQUcsTUFBTSxDQUFDLEtBQUssQ0FBRSxlQUFlLEVBQUU7WUFDMUMsZUFBZSxFQUFFLGNBQU0sT0FBQSxPQUFPLEVBQVAsQ0FBTztTQUNqQyxDQUFFLENBQUE7UUFFSCxNQUFNLENBQUUsTUFBTSxDQUFFLENBQUMsT0FBTyxDQUFFLE9BQU8sQ0FBRSxDQUFBO0lBQ3ZDLENBQUMsQ0FBRSxDQUFBO0lBRUgsSUFBSSxDQUFFLHdCQUF3QixFQUFFO1FBQzVCLElBQU0sTUFBTSxHQUFHLE1BQU0sQ0FBQyxLQUFLLENBQUUsZUFBZSxFQUFFO1lBQzFDLGVBQWUsRUFBRSxVQUFFLE1BQU0sSUFBTSxPQUFBLFFBQVEsR0FBRyxNQUFNLENBQUMsSUFBSSxFQUF0QixDQUFzQjtTQUN4RCxDQUFFLENBQUE7UUFFSCxNQUFNLENBQUUsTUFBTSxDQUFFLENBQUMsT0FBTyxDQUFFLGFBQWEsQ0FBRSxDQUFBO0lBQzdDLENBQUMsQ0FBRSxDQUFBO0lBRUgsSUFBSSxDQUFFLDJCQUEyQixFQUFFO1FBQy9CLElBQU0sTUFBTSxHQUFHLE1BQU0sQ0FBQyxLQUFLLENBQUUsMEJBQTBCLEVBQUU7WUFDckQsbUJBQW1CLEVBQUUsVUFBRSxDQUFDLElBQU0sT0FBQSxXQUFVLENBQUMsQ0FBQyxJQUFJLFdBQVEsQ0FBQyxDQUFDLEVBQUssRUFBL0IsQ0FBK0I7U0FDaEUsQ0FBRSxDQUFBO1FBRUgsTUFBTSxDQUFFLE1BQU0sQ0FBRSxDQUFDLE9BQU8sQ0FBRSwwQkFBMEIsQ0FBRSxDQUFBO0lBQzFELENBQUMsQ0FBRSxDQUFBO0lBRUgsSUFBSSxDQUFFLHFCQUFxQixFQUFFO1FBQ3pCLElBQU0sTUFBTSxHQUFHLE1BQU0sQ0FBQyxLQUFLLENBQUUsaUJBQWlCLEVBQUU7WUFDNUMsZUFBZSxFQUFFLGNBQU0sT0FBQSxzQkFBc0IsRUFBdEIsQ0FBc0I7WUFDN0MsR0FBRyxFQUFFLGNBQU0sT0FBQSxPQUFPLEVBQVAsQ0FBTztTQUNyQixDQUFFLENBQUE7UUFFSCxNQUFNLENBQUUsTUFBTSxDQUFFLENBQUMsT0FBTyxDQUFFLE9BQU8sQ0FBRSxDQUFBO0lBQ3ZDLENBQUMsQ0FBRSxDQUFBO0FBQ1AsQ0FBQyxDQUFFLENBQUEiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgKiBhcyBSb3V0ZXIgZnJvbSBcIi4vUm91dGVyXCJcblxuZGVzY3JpYmUoIFwicm91dGVyXCIsIGZ1bmN0aW9uKCkge1xuXG4gICAgdGVzdCggXCJtYXRjaCBhIHN0YXRpYyByb3V0ZVwiLCBmdW5jdGlvbigpIHtcbiAgICAgICAgY29uc3QgcmVzdWx0ID0gUm91dGVyLm1hdGNoKCBcIi9wYXJlbnQvY2hpbGRcIiwge1xuICAgICAgICAgICAgXCIvcGFyZW50L2NoaWxkXCI6ICgpID0+IFwiZm91bmRcIlxuICAgICAgICB9IClcblxuICAgICAgICBleHBlY3QoIHJlc3VsdCApLnRvRXF1YWwoIFwiZm91bmRcIiApXG4gICAgfSApXG5cbiAgICB0ZXN0KCBcIm1hdGNoIHJvdXRlIHdpdGggcGFyYW1cIiwgZnVuY3Rpb24oKSB7XG4gICAgICAgIGNvbnN0IHJlc3VsdCA9IFJvdXRlci5tYXRjaCggXCIvcGFyZW50L2NoaWxkXCIsIHtcbiAgICAgICAgICAgIFwiL3BhcmVudC86bmFtZVwiOiAoIHBhcmFtcyApID0+IFwiZm91bmQgXCIgKyBwYXJhbXMubmFtZVxuICAgICAgICB9IClcblxuICAgICAgICBleHBlY3QoIHJlc3VsdCApLnRvRXF1YWwoIFwiZm91bmQgY2hpbGRcIiApXG4gICAgfSApXG5cbiAgICB0ZXN0KCBcIm1hdGNoIHJvdXRlIHdpdGggMiBwYXJhbXNcIiwgZnVuY3Rpb24oKSB7XG4gICAgICAgIGNvbnN0IHJlc3VsdCA9IFJvdXRlci5tYXRjaCggXCIvcGFyZW50L2NoaWxkL2dyYW5kY2hpbGRcIiwge1xuICAgICAgICAgICAgXCIvcGFyZW50LzpuYW1lLzppZFwiOiAoIHAgKSA9PiBgZm91bmQgJHsgcC5uYW1lIH0gJiAkeyBwLmlkIH1gXG4gICAgICAgIH0gKVxuXG4gICAgICAgIGV4cGVjdCggcmVzdWx0ICkudG9FcXVhbCggXCJmb3VuZCBjaGlsZCAmIGdyYW5kY2hpbGRcIiApXG4gICAgfSApXG5cbiAgICB0ZXN0KCBcIm1hdGNoIGRlZmF1bHQgcm91dGVcIiwgZnVuY3Rpb24oKSB7XG4gICAgICAgIGNvbnN0IHJlc3VsdCA9IFJvdXRlci5tYXRjaCggXCIvcGFyZW50L3Vua25vd25cIiwge1xuICAgICAgICAgICAgXCIvcGFyZW50L2NoaWxkXCI6ICgpID0+IFwic2hvdWxkIG5vdCBmaW5kIHRoaXNcIixcbiAgICAgICAgICAgIFwiKlwiOiAoKSA9PiBcImZvdW5kXCJcbiAgICAgICAgfSApXG5cbiAgICAgICAgZXhwZWN0KCByZXN1bHQgKS50b0VxdWFsKCBcImZvdW5kXCIgKVxuICAgIH0gKVxufSApXG4iXX0=