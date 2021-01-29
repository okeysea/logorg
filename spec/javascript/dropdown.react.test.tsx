import * as React from 'react'
import * as renderer from 'react-test-renderer'
import Dropdown from '../../app/javascript/components/Dropdown'
import { shallow, mount, render } from 'enzyme'
import { mountToJson } from 'enzyme-to-json'
//「React v16.8: The One With Hooks – React Blog」 https://reactjs.org/blog/2019/02/06/react-v16.8.0.html#testing-hooks (2021/01/29 金)
import { act } from 'react-dom/test-utils'

describe('<Dropdown />', ()=>{

  it('Dropdown component snapshot test', ()=>{
    const component = renderer.create(
        <Dropdown>
          <Dropdown.Trigger>
            <b>trigger button</b>
          </Dropdown.Trigger>
          <Dropdown.Menu>
            <Dropdown.Item>item 1</Dropdown.Item>
            <Dropdown.Item>item 2</Dropdown.Item>
            <Dropdown.Item>item 3</Dropdown.Item>
            <Dropdown.Divider />
            <Dropdown.Item>item 4</Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
    );
    let tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });
  
  it('Dropdown component with href attribute snapshot test', ()=>{
    const wrapper = mount(
        <Dropdown>
          <Dropdown.Trigger>
            <b>trigger button</b>
          </Dropdown.Trigger>
          <Dropdown.Menu>
            <Dropdown.Item href="http://www.example.com/">item 1</Dropdown.Item>
            <Dropdown.Item href="/root/folder/">item 2</Dropdown.Item>
            <Dropdown.Item>item 3</Dropdown.Item>
            <Dropdown.Divider />
            <Dropdown.Item>item 4</Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
    );
    expect(wrapper).toMatchSnapshot();
  });

  it('active/inactive toggle test', ()=>{
    let wrapper;
    act(()=>{
      wrapper = mount(
          <Dropdown>
            <Dropdown.Trigger>
              <b>trigger button</b>
            </Dropdown.Trigger>
            <Dropdown.Menu>
              <Dropdown.Item href="http://www.example.com/">item 1</Dropdown.Item>
              <Dropdown.Item href="/root/folder/">item 2</Dropdown.Item>
              <Dropdown.Item>item 3</Dropdown.Item>
              <Dropdown.Divider />
              <Dropdown.Item>item 4</Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>,
          { attachTo: document.body.appendChild(document.createElement("div")) }
      );
    });

    expect(mountToJson(wrapper)).toMatchSnapshot();

    act(()=>{
      wrapper.find(".dropdown-trigger").simulate("click");
    });
    expect(mountToJson(wrapper)).toMatchSnapshot();

    act(()=>{
      wrapper.find(".dropdown-trigger").simulate("click");
    });
    expect(mountToJson(wrapper)).toMatchSnapshot();

    act(()=>{
      wrapper.find(".dropdown-trigger").simulate("click");
    });
    expect(mountToJson(wrapper)).toMatchSnapshot();
  });

});
