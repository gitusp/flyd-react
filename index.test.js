import React from "react";
import { configure, mount } from "enzyme";
import Adapter from "enzyme-adapter-react-16";
import flyd from "flyd";
import { connect } from ".";

configure({ adapter: new Adapter() });

test("stream connection", async () => {
  // Connected stream.
  const stream = flyd.stream(1);

  // Set up mock components.
  const Container = () => {
    const childProps = {
      count: connect(stream)
    };
    return React.createElement(View, childProps);
  };

  const View = ({ count }) => React.createElement("p", null, `${count}`);

  const elm = mount(React.createElement(Container));

  // Assert that the component contains the initial value.
  expect(elm.find("p").text()).toBe("1");

  // Emit a new value to update the component.
  stream(2);

  // Assert that the new value is applied to the component.
  await new Promise(resolve => {
    setTimeout(() => {
      expect(elm.find("p").text()).toBe("2");
      resolve(true);
    }, 100);
  });
});
