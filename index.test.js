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

test("selective stream connection", async () => {
  // Selective streams.
  const streams = {
    one: flyd.stream(1),
    two: flyd.stream(2)
  };

  // Set up mock components.
  const ContainerWithDefaultConnection = ({ streamKey }) => {
    const childProps = {
      count: connect(streams[streamKey])
    };
    return React.createElement(View, childProps);
  };
  const ContainerWithIdenticalConnection = ({ streamKey }) => {
    const childProps = {
      count: connect(
        streams[streamKey],
        []
      )
    };
    return React.createElement(View, childProps);
  };
  const ContainerWithAppropriateConnection = ({ streamKey }) => {
    const childProps = {
      count: connect(
        streams[streamKey],
        [streamKey]
      )
    };
    return React.createElement(View, childProps);
  };

  const View = ({ count }) => React.createElement("p", null, `${count}`);

  const elmWithDefaultConnection = mount(
    React.createElement(ContainerWithDefaultConnection, { streamKey: "one" })
  );
  const elmWithIdenticalConnection = mount(
    React.createElement(ContainerWithIdenticalConnection, { streamKey: "one" })
  );
  const elmWithAppropriateConnection = mount(
    React.createElement(ContainerWithAppropriateConnection, {
      streamKey: "one"
    })
  );

  // Assert that the components contains the initial value.
  expect(elmWithDefaultConnection.find("p").text()).toBe("1");
  expect(elmWithIdenticalConnection.find("p").text()).toBe("1");
  expect(elmWithAppropriateConnection.find("p").text()).toBe("1");

  // Make the components select the second stream.
  elmWithDefaultConnection.setProps({ streamKey: "two" });
  elmWithIdenticalConnection.setProps({ streamKey: "two" });
  elmWithAppropriateConnection.setProps({ streamKey: "two" });

  // Assert that the new value is applied to the component.
  await new Promise(resolve => {
    setTimeout(() => {
      expect(elmWithDefaultConnection.find("p").text()).toBe("2");
      // NOTE: Identical connection should not apply the new stream.
      expect(elmWithIdenticalConnection.find("p").text()).toBe("1");
      expect(elmWithAppropriateConnection.find("p").text()).toBe("2");
      resolve(true);
    }, 100);
  });
});
